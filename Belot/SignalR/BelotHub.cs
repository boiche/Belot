using Belot.Data;
using Belot.Models;
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

            gameEntry ??= context.Games.FirstOrDefault(x => x.Id == gameId);
            if (gameEntry is null)
            {
                await CreateGame();
            }
            
            
            await Groups.AddToGroupAsync(Context.ConnectionId, gameId.ToString());
            gameEntry.ConnectedPlayers++;
            judgeManager.Judges[gameId].AddPlayer(new Player()
            {
                Username = "some username",
                ConnectionId = Context.ConnectionId
            });

            //if (gameEntry.ConnectedPlayers == 4)
            //{
            //    StartGames(gameId);
            //    gameEntry.HasStarted = true;
            //}

            StartGames(gameId);

            context.SaveChanges();
        }

        private async Task StartGames(Guid gameId)
        {
            Stopwatch stopwatch = new();
            stopwatch.Start();

            judgeManager.Judges[gameId].StartGame();

            while (stopwatch.ElapsedMilliseconds < 2000)
            {

            }

            await Clients.Group(gameId.ToString()).StartGame(gameId);
        }

        public Task StartGame(Guid gameId)
        {
            return Task.Run(() => gameId);
        }

        public GetGameInfoResponse GetGameInfo(string gameId)
        {
            Guid.TryParse(gameId, out Guid id);
            return new GetGameInfoResponse()
            {
                DealerPlayer = judgeManager.Judges[id].DealerPlayer
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
            await JoinGame(new JoinGameRequest() { GameId = gameId });            
        }

        public async Task LeaveGame(LeaveGameRequest request)
        {
            Guid gameId = request.GameId;
            Stopwatch stopwatch = new();
            stopwatch.Start();

            gameEntry ??= context.Games.FirstOrDefault(x => x.Id == gameId);
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

        public async Task DealCards(DealCardsRequest request)
        {
            judgeManager.Judges[request.GameId].DealCards(Context.ConnectionId, request.Count);
        }

        public async Task AwaitGame()
        {
            Debug.WriteLine("");
            Debug.WriteLine("Player with connection " + Context.ConnectionId + " has joined the game");
            Debug.WriteLine("");
        }

        public Player GetPlayerInfo(Guid gameId)
        {
            return judgeManager.Judges[gameId].GetPlayer(Context.ConnectionId);
        }
    }
}
