using Belot.Data;
using Belot.Models.Belot;
using Belot.Models.DataEntries;
using Belot.Models.Http.Requests.SignalR;
using Belot.Models.Http.Responses.SignalR;
using Belot.Services.Application;
using Belot.Services.Belot;
using Belot.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;
using System.Diagnostics;
using System.Numerics;

namespace Belot.SignalR
{
    public partial class BelotHub : Hub<IBelotHub>, IBelotHub
    {
        readonly ApplicationDbContext context;
        readonly IJudgeManager<BelotJudgeService> judgeManager;
        Game gameEntry;

        public BelotHub(ApplicationDbContext context, IJudgeManager<BelotJudgeService> judgeManager)
        {
            this.context = context;
            this.judgeManager = judgeManager;

            ApplicationEvents.JudgeNotFound += DeleteGameEvent;
        }

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public async Task JoinGame(JoinGameRequest request)
        {
            Guid gameId = request.GameId;
            var judge = judgeManager.GetJudge(gameId);
            if (judge == null)
            {
                Clients.Client(Context.ConnectionId).Error("Judge not found");
                return;
            }

            gameEntry = context.Games.First(x => x.Id == gameId);
            if (gameEntry is null)
                await CreateGame(new CreateGameRequest() { Username = request.Username });
            
            await Groups.AddToGroupAsync(Context.ConnectionId, gameId.ToString());
            gameEntry.ConnectedPlayers++;
            judge.AddPlayer(new Player()
            {
                Username = request.Username,
                ConnectionId = Context.ConnectionId                
            });

            if (gameEntry.ConnectedPlayers == 4)
            {
                StartGameInternal(gameId);
                gameEntry.HasStarted = true;
            }

            context.SaveChanges();
        }        

        public GetGameInfoResponse GetGameInfo(string gameId)
        {
            if (!Guid.TryParse(gameId, out Guid id))
                throw new ArgumentException($"GetGameInfo expected valid Guid. Received: {gameId}");

            return new GetGameInfoResponse()
            {
                DealerPlayerRealtive = GetRelativeDealerIndex(id),
                DealerPlayer = judgeManager.GetJudge(id).DealerPlayer.PlayerIndex
            };
        }

        public async Task CreateGame(CreateGameRequest request)
        {            
            Guid gameId = Guid.NewGuid();
            judgeManager.Judges.Add(gameId, new BelotJudgeService());
            gameEntry = new Game()
            {
                Id = gameId,
                HasStarted = false,
                ConnectedPlayers = 0,                
            };

            context.Games.Add(gameEntry);
            context.SaveChanges();
            await JoinGame(new JoinGameRequest() { GameId = gameId, Username = request.Username });              
        }

        public async Task LeaveGame(LeaveGameRequest request)
        {
            Guid gameId = request.GameId;
            Stopwatch stopwatch = new();
            stopwatch.Start();

            gameEntry = context.Games.First(x => x.Id == gameId);
            if (gameEntry is null)
            {
                await CreateGame(new CreateGameRequest() { Username = request.Username });
            }


            await Groups.AddToGroupAsync(Context.ConnectionId, gameId.ToString());
            gameEntry.ConnectedPlayers--;
            judgeManager.GetJudge(request.GameId).RemovePlayer(Context.ConnectionId);

            context.SaveChanges();

            while (stopwatch.ElapsedMilliseconds < 1500)
            {

            }
        }      

        public Task DealCards(DealCardsRequest request)
        {
            judgeManager.GetJudge(request.GameId).DealCards(Context.ConnectionId, request.Count);
            return Task.CompletedTask;
        }        

        public async Task Announce(GameAnnouncementRequest request)
        {
            judgeManager.GetJudge(request.GameId).GetPlayer(Context.ConnectionId).SetAnnouncement(request.Announcement);            
            judgeManager.GetJudge(request.GameId).Announce(Context.ConnectionId, request.Announcement);
            judgeManager.GetJudge(request.GameId).NextToPlay();

            if (judgeManager.GetJudge(request.GameId).CheckSecondDeal())
            {
                await Clients.Group(request.GameId.ToString()).SecondDeal(judgeManager.GetJudge(request.GameId).Announcer.Announcement);
                Clients.Client(judgeManager.GetJudge(request.GameId).FirstToPlay.ConnectionId).OnTurn(new Turn()
                { 
                    TurnCode = TurnCodes.ThrowCard
                });
            }
            else
            {
                Turn turn = new()
                {
                    TurnCode = TurnCodes.Announcement
                };
                if (judgeManager.GetJudge(request.GameId).CheckPasses())
                {
                    DealNewInternal(request.GameId);
                    await Clients.Group(request.GameId.ToString()).DealNew();
                }
                else
                {
                    foreach (var player in judgeManager.GetJudge(request.GameId).GetPlayers())
                    {
                        Clients.Client(player.ConnectionId).UpdateClientAnnouncements(request.Announcement, judgeManager.GetJudge(request.GameId).GetRelativePlayerIndex(player.ConnectionId, Context.ConnectionId));
                    }
                    
                    Clients.Client(judgeManager.GetJudge(request.GameId).PlayerToPlay.ConnectionId).OnTurn(turn);
                }                
            }
        }

        public async Task HandAnnounce(HandAnnouncementRequest request)
        {
            var judge = judgeManager.GetJudge(request.GameId);
            judge.HandAnnounce(Context.ConnectionId, request.Announcement, request.HighestRank);

            foreach (var player in judge.GetPlayers())
            {
                await Clients.Client(player.ConnectionId).AnnounceHandAnnouncement(request.Announcement, judge.GetRelativePlayerIndex(player.ConnectionId, Context.ConnectionId));
            }
        }

        public Player GetPlayerInfo(string gameId)
        {
            if (!Guid.TryParse(gameId, out Guid id))
                throw new Exception($"Cannot represent key as valid game identifier: {gameId}");

            return judgeManager.GetJudge(id).GetPlayer(Context.ConnectionId);
        }

        public async Task FirstDealCompleted(string gameId)
        {
            if (!Guid.TryParse(gameId, out Guid GameId))
                throw new Exception($"Cannot represent key as valid game identifier: {gameId}");

            DebugHelper.WriteLine(() => $"Deal completed. Player to announce first: {judgeManager.GetJudge(GameId).PlayerToPlay.ConnectionId}");
            await Clients.Client(judgeManager.GetJudge(GameId).FirstToPlay.ConnectionId).OnTurn(new Turn()
            {
                TurnCode = TurnCodes.Announcement
            });
        }

        public async Task SecondDealCompleted(string gameId)
        {
            if (!Guid.TryParse(gameId, out Guid GameId))
                throw new Exception($"Cannot represent key as valid game identifier: {gameId}");

            DebugHelper.WriteLine(() => $"Deal completed. Player to announce first: {judgeManager.GetJudge(GameId).PlayerToPlay.ConnectionId}");
            Clients.Client(judgeManager.GetJudge(GameId).FirstToPlay.ConnectionId).OnTurn(new Turn()
            {
                TurnCode = TurnCodes.ThrowCard
            });

            await Clients.Group(gameId).ShowHandAnnouncements();
        }

        public Task ThrowCard(ThrowCardRequest request)
        {
            RemoveCardInternal(request);
            UpdateTurnInternal(request);
            BelotJudgeService belotJudge = judgeManager.GetJudge(request.GameId);

            foreach (var player in belotJudge.GetPlayers())
            {
                var response = new ShowOpponentCardResponse()
                {
                    Card = request.Card,
                    OpponentRelativeIndex = belotJudge.GetRelativePlayerIndex(Context.ConnectionId, player.ConnectionId)
                };

                Clients.Client(player.ConnectionId).ShowOpponentCard(response);

                if (belotJudge.LastHandFinished())
                {
                    var collectCardsResponse = new CollectCardsResponse()
                    {
                        OpponentRelativeIndex = belotJudge.GetRelativePlayerIndex(player.ConnectionId, belotJudge.LastHand.WonBy)
                    };
                    Clients.Client(player.ConnectionId).CollectCards(collectCardsResponse);
                }
            }

            if (belotJudge.GameFinished())
            {
                bool gameOver = belotJudge.FinishGame();

                var showScoreResponse = new ShowScoreResponse()
                {
                    Score = belotJudge.GetScore(),
                    IsGameOver = gameOver
                };
                Clients.Group(request.GameId.ToString()).ShowScore(showScoreResponse);

                if (!gameOver)
                {
                    DealNewInternal(request.GameId);
                }                
            }
            else
            {
                belotJudge.NextToPlay();
                Clients.Client(belotJudge.PlayerToPlay.ConnectionId).OnTurn(new Turn()
                {
                    TurnCode = TurnCodes.ThrowCard
                });
            }                        

            return Task.CompletedTask;
        }

        public Task GameOver(string gameId)
        {
            BelotJudgeService belotJudge = judgeManager.GetJudge(Guid.Parse(gameId));

            var winnerRespone = new ShowWinnerResponse()
            {
                Score = belotJudge.GetScore()
            };
            var winners = belotJudge.GetWinners();
            foreach (var winner in winners)
            {
                Clients.Client(winner.ConnectionId).ShowWinning(winnerRespone);
            }

            var loserResponse = new ShowLoserResponse()
            {
                Score = belotJudge.GetScore()
            };
            var losers = belotJudge.GetLosers();
            foreach (var loser in losers)
            {
                Clients.Client(loser.ConnectionId).ShowLosing(loserResponse);
            }

            return Task.CompletedTask;
        }
    }
}
