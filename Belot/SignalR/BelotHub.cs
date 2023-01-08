using Belot.Data;
using Belot.Models.Belot;
using Belot.Models.DataEntries;
using Belot.Models.Http.Requests.SignalR;
using Belot.Models.Http.Responses.SignalR;
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
        }
        
        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public async Task JoinGame(JoinGameRequest request)
        {
            Guid gameId = request.GameId;

            gameEntry = context.Games.First(x => x.Id == gameId);
            if (gameEntry is null)
                await CreateGame();
            
            await Groups.AddToGroupAsync(Context.ConnectionId, gameId.ToString());
            gameEntry.ConnectedPlayers++;
            judgeManager.Judges[gameId].AddPlayer(new Player()
            {
                Username = "some username",
                ConnectionId = Context.ConnectionId
            });

            if (gameEntry.ConnectedPlayers == 4)
            {
                StartGameInternal(gameId);
                gameEntry.HasStarted = true;
            }

            //StartGameInternal(gameId);

            context.SaveChanges();
        }        

        public GetGameInfoResponse GetGameInfo(string gameId)
        {
            if (!Guid.TryParse(gameId, out Guid id))
                throw new ArgumentException($"GetGameInfo expected valid Guid. Received: {gameId}");

            return new GetGameInfoResponse()
            {
                DealerPlayerRealtive = GetRelativeDealerIndex(id),
                DealerPlayer = judgeManager.Judges[id].DealerPlayer.PlayerIndex
            };
        }

        public async Task CreateGame()
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
            await JoinGame(new JoinGameRequest() { GameId = gameId });              
        }

        public async Task LeaveGame(LeaveGameRequest request)
        {
            Guid gameId = request.GameId;
            Stopwatch stopwatch = new();
            stopwatch.Start();

            gameEntry = context.Games.First(x => x.Id == gameId);
            if (gameEntry is null)
            {
                await CreateGame();
            }


            await Groups.AddToGroupAsync(Context.ConnectionId, gameId.ToString());
            gameEntry.ConnectedPlayers--;
            judgeManager.Judges[request.GameId].RemovePlayer(Context.ConnectionId);

            context.SaveChanges();

            while (stopwatch.ElapsedMilliseconds < 1500)
            {

            }
        }      

        public Task DealCards(DealCardsRequest request)
        {
            judgeManager.Judges[request.GameId].DealCards(Context.ConnectionId, request.Count);
            return Task.CompletedTask;
        }        

        public async Task Announce(GameAnnouncementRequest request)
        {
            judgeManager.Judges[request.GameId].GetPlayer(Context.ConnectionId).SetAnnouncement(request.Announcement);            
            judgeManager.Judges[request.GameId].Announce(Context.ConnectionId, request.Announcement);
            judgeManager.Judges[request.GameId].NextToPlay();

            if (judgeManager.Judges[request.GameId].CheckSecondDeal())
            {
                await Clients.Group(request.GameId.ToString()).SecondDeal();
                Clients.Client(judgeManager.Judges[request.GameId].FirstToPlay.ConnectionId).OnTurn(new Turn()
                { 
                    TurnCode = TurnCodes.ThrowCard
                });
            }
            else
            {
                Turn turn = new Turn()
                {
                    TurnCode = TurnCodes.Announcement
                };
                if (judgeManager.Judges[request.GameId].CheckPasses())
                {
                    DealNewInternal(request.GameId);
                    await Clients.Group(request.GameId.ToString()).DealNew();
                    Clients.Client(judgeManager.Judges[request.GameId].FirstToPlay.ConnectionId).OnTurn(turn);
                }

                Clients.Group(request.GameId.ToString()).UpdateClientAnnouncements(request.Announcement);
                Clients.Client(judgeManager.Judges[request.GameId].PlayerToPlay.ConnectionId).OnTurn(turn);
            }
        }

        public Player GetPlayerInfo(string gameId)
        {
            Guid.TryParse(gameId, out Guid id);
            return judgeManager.Judges[id].GetPlayer(Context.ConnectionId);
        }

        public async Task FirstDealCompleted(string gameId)
        {
            Guid.TryParse(gameId, out Guid GameId);
            DebugHelper.WriteLine(() => $"Deal completed. Player to announce first: {judgeManager.Judges[GameId].PlayerToPlay.ConnectionId}");
            await Clients.Client(judgeManager.Judges[GameId].PlayerToPlay.ConnectionId).OnTurn(new Turn()
            {
                TurnCode = TurnCodes.Announcement
            });
        }

        public async Task SecondDealCompleted(string gameId)
        {
            Guid.TryParse(gameId, out Guid GameId);
            DebugHelper.WriteLine(() => $"Deal completed. Player to announce first: {judgeManager.Judges[GameId].PlayerToPlay.ConnectionId}");
            await Clients.Client(judgeManager.Judges[GameId].PlayerToPlay.ConnectionId).OnTurn(new Turn()
            {
                TurnCode = TurnCodes.ThrowCard
            });
        }

        public Task ThrowCard(ThrowCardRequest request)
        {
            RemoveCardInternal(request);
            UpdateTurnInternal(request);

            foreach (var player in judgeManager.Judges[request.GameId].GetPlayers())
            {
                var response = new ShowOpponentCardResponse()
                {
                    Card = request.Card,
                    OpponentRelativeIndex = judgeManager.Judges[request.GameId].GetRelativePlayerIndex(Context.ConnectionId, player.ConnectionId)
                };

                Clients.Client(player.ConnectionId).ShowOpponentCard(response);

                if (judgeManager.Judges[request.GameId].LastHandFinished())
                {
                    var collectCardsResponse = new CollectCardsResponse()
                    {
                        OpponentRelativeIndex = judgeManager.Judges[request.GameId].GetRelativePlayerIndex(player.ConnectionId, judgeManager.Judges[request.GameId].LastHand.WonBy)
                    };

                    Clients.Client(player.ConnectionId).CollectCards(collectCardsResponse);
                }
            }

            if (judgeManager.Judges[request.GameId].GameFinished())
            {
                judgeManager.Judges[request.GameId].FinishGame();
            }
            else
            {
                judgeManager.Judges[request.GameId].NextToPlay();
                Clients.Client(judgeManager.Judges[request.GameId].PlayerToPlay.ConnectionId).OnTurn(new Turn()
                {
                    TurnCode = TurnCodes.ThrowCard
                });
            }                        

            return Task.CompletedTask;
        }
    }
}
