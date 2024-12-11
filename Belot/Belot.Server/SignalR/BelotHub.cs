namespace Belot.SignalR
{
    using Belot.Data;
    using Belot.Models.Belot;
    using Belot.Models.DataEntries;
    using Belot.Models.Http.Requests.SignalR;
    using Belot.Models.Http.Responses.SignalR;
    using Belot.Services.Application;
    using Belot.Services.Belot;
    using Belot.Services.Interfaces;
    using Belot.Services.Logging;
    using Belot.Services.Logging.Interfaces;
    using Microsoft.AspNetCore.SignalR;
    using Microsoft.EntityFrameworkCore;
    using System.Diagnostics;

    public partial class BelotHub : Hub<IBelotHub>, IBelotHub
    {
        readonly ApplicationDbContext context;
        readonly IJudgeManager<BelotJudgeService> judgeManager;
        readonly IHandLogger handLogger;
        readonly IUserBalanceService userBalanceService;
        Game? gameEntry;

        public BelotHub(
            ApplicationDbContext context,
            IJudgeManager<BelotJudgeService> judgeManager,
            IUserBalanceService userBalanceService,
            IHandLogger handLogger)
        {
            this.context = context;
            this.judgeManager = judgeManager;
            this.userBalanceService = userBalanceService;
            this.handLogger = handLogger;

            ApplicationEvents.JudgeNotFound += DeleteGameEvent;
        }

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        /// <summary>
        /// Registers user to a game
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public async Task JoinGame(JoinGameRequest request)
        {
            try
            {
                Guid gameId = request.GameId;
                var currentPlayer = await this.context.Users
                    .FirstAsync(x => x.UserName == request.Username);
                var currentPlayerBalance = await this.context.UserBalances
                    .FirstAsync(x => x.Id == currentPlayer.UserBalanceId);

                var belotJudgeService = judgeManager.GetJudge(gameId);
                gameEntry = await this.context.Games.FirstOrDefaultAsync(x => x.Id == gameId);

                if (gameEntry is null || belotJudgeService == null)
                {
                    Clients.Caller.Error("Game doesn't exist");
                    return;
                }

                await Groups.AddToGroupAsync(Context.ConnectionId, gameId.ToString());
                gameEntry.ConnectedPlayers++;
                userBalanceService.WithdrawAsync(currentPlayerBalance.Id, 50); //TODO: according to the game type (provided by the request) withdraw more/less

                belotJudgeService.AddPlayer(new Player()
                {
                    Username = currentPlayer.UserName ?? string.Empty,
                    ConnectionId = Context.ConnectionId,
                    Id = currentPlayer.Id,
                });

                Clients.Group(gameId.ToString()).JoinedGame();
                if (gameEntry.ConnectedPlayers == 4)
                {
                    StartGameInternal(gameId);
                    gameEntry.HasStarted = true;
                }

                await context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                Clients.Caller.Error(e.Message);
                throw;
            }
        }

        /// <summary>
        /// Retreives dealer info about a game
        /// </summary>
        /// <param name="gameId"></param>
        /// <returns></returns>
        /// <exception cref="ArgumentException"></exception>
        public GetGameInfoResponse GetGameInfo(string gameId)
        {
            if (!Guid.TryParse(gameId, out Guid GameId))
            {
                throw new ArgumentException($"GetGameInfo expected valid Guid. Received: {gameId}");
            }

            var belotJudgeService = judgeManager.GetJudge(GameId);

            return new GetGameInfoResponse()
            {
                DealerPlayerRealtive = GetRelativeDealerIndex(GameId),
                DealerPlayer = belotJudgeService.DealerPlayer.PlayerIndex
            };
        }

        public async Task CreateGame(CreateGameRequest request)
        {
            Guid gameId = Guid.NewGuid();
            var user = await this.context.Users.FirstAsync(x => x.UserName == request.Username);
            var canCreateGame = await this.userBalanceService
                .TryWithdrawAsync(user.UserBalanceId, request.PrizePool / 4);
            if (canCreateGame.Success)
            {
                judgeManager.Judges.Add(gameId, new BelotJudgeService());
                gameEntry = new Game()
                {
                    Id = gameId,
                    HasStarted = false,
                    ConnectedPlayers = 0,
                    PrizePool = request.PrizePool
                };

                await this.context.Games.AddAsync(gameEntry);
                await this.context.SaveChangesAsync();
                await JoinGame(new JoinGameRequest() { GameId = gameId, Username = request.Username });
            }
            else
            {
                Clients.Caller.Error(canCreateGame.Error.Message);
            }
        }

        public async Task LeaveGame(LeaveGameRequest request)
        {
            Guid gameId = request.GameId;
            Stopwatch stopwatch = new();
            stopwatch.Start();

            gameEntry = await this.context.Games.FirstAsync(x => x.Id == gameId);
            if (gameEntry is null)
            {
                Clients.Caller.Error("Game doesn't exist");
                return;
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, gameId.ToString());
            gameEntry.ConnectedPlayers--;
            var belotJudgeService = judgeManager.GetJudge(request.GameId);
            belotJudgeService.RemovePlayer(Context.ConnectionId);

            await context.SaveChangesAsync();

            while (stopwatch.ElapsedMilliseconds < 1500)
            {

            }
        }

        public Task DealCards(DealCardsRequest request)
        {
            var belotJudgeService = judgeManager.GetJudge(request.GameId);
            belotJudgeService.DealCards(Context.ConnectionId, request.Count);

            return Task.CompletedTask;
        }

        public async Task Announce(GameAnnouncementRequest request)
        {
            var gameId = request.GameId;
            var connectionId = Context.ConnectionId;
            var belotJudgeService = judgeManager.GetJudge(gameId);

            belotJudgeService.GetPlayer(connectionId).SetAnnouncement(request.Announcement);
            belotJudgeService.Announce(connectionId, request.Announcement);
            belotJudgeService.NextToPlay();

            if (belotJudgeService.CheckSecondDeal())
            {
                await Clients
                    .Group(gameId.ToString())
                    .SecondDeal(belotJudgeService.Announcer.Announcement);

                Clients.Client(belotJudgeService.FirstToPlay.ConnectionId).OnTurn(new Turn()
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

                if (belotJudgeService.CheckPasses())
                {
                    DealNewInternal(gameId);
                    await Clients.Group(gameId.ToString()).DealNew();
                }
                else
                {
                    foreach (var player in belotJudgeService.GetPlayers())
                    {
                        Clients
                            .Client(player.ConnectionId)
                            .UpdateClientAnnouncements(
                                request.Announcement,
                                belotJudgeService.GetRelativePlayerIndex(player.ConnectionId, connectionId));
                    }

                    Clients.Client(belotJudgeService.PlayerToPlay.ConnectionId).OnTurn(turn);
                }
            }
        }

        public async Task HandAnnounce(HandAnnouncementRequest request)
        {
            var belotJudgeService = judgeManager.GetJudge(request.GameId);
            var connectionId = Context.ConnectionId;
            belotJudgeService.HandAnnounce(connectionId, request.Announcement, request.HighestRank);

            foreach (var player in belotJudgeService.GetPlayers())
            {
                await Clients
                    .Client(player.ConnectionId)
                    .AnnounceHandAnnouncement(request.Announcement, belotJudgeService.GetRelativePlayerIndex(player.ConnectionId, connectionId));
            }
        }

        public Player GetPlayerInfo(string gameId)
        {
            if (!Guid.TryParse(gameId, out Guid GameId))
            {
                throw new Exception($"Cannot represent key as valid game identifier: {gameId}");
            }

            var belotJudgeService = judgeManager.GetJudge(GameId);

            return belotJudgeService.GetPlayer(Context.ConnectionId);
        }

        public async Task FirstDealCompleted(string gameId)
        {
            if (!Guid.TryParse(gameId, out Guid GameId))
            {
                throw new Exception($"Cannot represent key as valid game identifier: {gameId}");
            }

            var belotJudgeService = judgeManager.GetJudge(GameId);

            DebugHelper.WriteLine($"Deal completed. Player to announce first: {belotJudgeService.PlayerToPlay.ConnectionId}");
            await Clients.Client(belotJudgeService.FirstToPlay.ConnectionId).OnTurn(
                new Turn()
                {
                    TurnCode = TurnCodes.Announcement
                });
        }

        public async Task SecondDealCompleted(string gameId)
        {
            if (!Guid.TryParse(gameId, out Guid GameId))
            {
                throw new Exception($"Cannot represent key as valid game identifier: {gameId}");
            }

            var belotJudgeService = judgeManager.GetJudge(GameId);

            DebugHelper.WriteLine($"Deal completed. Player to announce first: {belotJudgeService.PlayerToPlay.ConnectionId}");
            Clients.Client(belotJudgeService.FirstToPlay.ConnectionId).OnTurn(
                new Turn()
                {
                    TurnCode = TurnCodes.ThrowCard
                });

            await Clients.Group(gameId).ShowHandAnnouncements();
        }

        public Task ThrowCard(ThrowCardRequest request)
        {
            //TODO: Find elegant way to populate necessary data for single HandLog entity
            RemoveCardInternal(request);
            UpdateTurnInternal(request);
            var belotJudgeService = judgeManager.GetJudge(request.GameId);

            foreach (var player in belotJudgeService.GetPlayers())
            {
                var response = new ShowOpponentCardResponse()
                {
                    Card = request.Card,
                    OpponentRelativeIndex = belotJudgeService.GetRelativePlayerIndex(Context.ConnectionId, player.ConnectionId)
                };

                Clients.Client(player.ConnectionId).ShowOpponentCard(response);

                if (belotJudgeService.LastHandFinished())
                {
                    var collectCardsResponse = new CollectCardsResponse()
                    {
                        OpponentRelativeIndex = belotJudgeService.GetRelativePlayerIndex(player.ConnectionId, belotJudgeService.LastHand.WonBy)
                    };

                    Clients.Client(player.ConnectionId).CollectCards(collectCardsResponse);
                }
            }

            if (belotJudgeService.GameFinished())
            {
                bool gameOver = belotJudgeService.FinishGame();

                var showScoreResponse = new ShowScoreResponse()
                {
                    Score = belotJudgeService.GetScore(),
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
                belotJudgeService.NextToPlay();

                Clients.Client(belotJudgeService.PlayerToPlay.ConnectionId).OnTurn(new Turn()
                {
                    TurnCode = TurnCodes.ThrowCard
                });
            }

            return Task.CompletedTask;
        }

        public async Task GameOver(string gameId)
        {
            var belotJudgeService = judgeManager.GetJudge(Guid.Parse(gameId));
            Game game = await this.context.Games.FirstAsync(x => x.Id == Guid.Parse(gameId));

            var winnerRespone = new ShowWinnerResponse()
            {
                Score = belotJudgeService.GetScore()
            };

            var winners = belotJudgeService.GetWinners();
            foreach (var winner in winners)
            {
                Clients.Client(winner.ConnectionId).ShowWinning(winnerRespone);

                var user = await this.context.Users.FirstAsync(x => x.Id == winner.Id);
                var balanceId = user.UserBalanceId;
                userBalanceService.DepositAsync(balanceId, game.PrizePool / 2);
            }

            var loserResponse = new ShowLoserResponse()
            {
                Score = belotJudgeService.GetScore()
            };

            var losers = belotJudgeService.GetLosers();
            foreach (var loser in losers)
            {
                Clients.Client(loser.ConnectionId).ShowLosing(loserResponse);
            }

            return;
        }
    }
}
