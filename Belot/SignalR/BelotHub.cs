using Belot.Data;
using Belot.Models;
using Belot.Models.Http.Requests;
using Belot.Models.Http.Requests.SignalR;
using Belot.Models.Http.Responses.SignalR;
using Belot.Services.Belot;
using Belot.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Newtonsoft.Json;
using System.Diagnostics;

namespace Belot.SignalR
{
    public class BelotHub : Hub<IBelotHub>, IBelotHub
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
                StartGames(gameId);
                gameEntry.HasStarted = true;
            }

            //StartGames(gameId);

            context.SaveChanges();
        }

        private Task StartGames(Guid gameId)
        {
            Stopwatch stopwatch = new();
            stopwatch.Start();

            judgeManager.Judges[gameId].StartGame();

            while (stopwatch.ElapsedMilliseconds < 2000)
            {

            }

            Clients.Group(gameId.ToString()).StartGame(gameId);
            return Task.CompletedTask;
        }

        public Task StartGame(Guid gameId)
        {
            return Task.Run(() => gameId);
        }

        public GetGameInfoResponse GetGameInfo(string gameId)
        {
            if (!Guid.TryParse(gameId, out Guid id))
                throw new ArgumentException($"GetGameInfo expected valid Guid. Received: {gameId}");

            return new GetGameInfoResponse()
            {
                DealerPlayer = GetDealerIndex(id)
            };
        }

        /// <summary>
        /// Gets the dealer seat based on current player's seat
        /// </summary>
        /// <param name="currentPlayer"></param>
        /// <returns></returns>
        private int GetDealerIndex(Guid id)
        {
            int dealerPlayer = judgeManager.Judges[id].DealerPlayer;
            int currentPlayer = judgeManager.Judges[id].GetPlayer(Context.ConnectionId).PlayerIndex;
            int result = 0;

            while (currentPlayer != dealerPlayer)
            {
                result++;
                currentPlayer++;
                if (currentPlayer > 3)
                    currentPlayer = 0;
            }

            return result;
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

        public Task AwaitGame()
        {
            DebugHelper.WriteLine(() => "Player with connection " + Context.ConnectionId + " has joined the game");

            return Task.CompletedTask;
        }

        public Task Pass(string gameId)
        {
            Guid.TryParse(gameId, out Guid id);
            judgeManager.Judges[id].NextToPlay();
            return Clients.Group(id.ToString()).RefreshPlayer();
        }

        public Player GetPlayerInfo(string gameId)
        {
            Guid.TryParse(gameId, out Guid id);
            return judgeManager.Judges[id].GetPlayer(Context.ConnectionId);
        }

        public Task RefreshPlayer()
        {
            return Task.CompletedTask;
        }
    }
}
