using Belot.Data;
using Belot.Models;
using Belot.Models.Http.Requests.SignalR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Newtonsoft.Json;
using System.Diagnostics;

namespace Belot.SignalR
{
    public class BelotHub : Hub<IBelotHub>
    {
        readonly ApplicationDbContext context;
        Game gameEntry;

        public BelotHub(ApplicationDbContext context)
        {
            this.context = context;
        }
        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public async Task JoinGame(JoinGameRequest request)
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
            gameEntry.ConnectedPlayers++;
            context.SaveChanges();

            while (stopwatch.ElapsedMilliseconds < 1500)
            {

            }
        }

        public async Task CreateGame()
        {            
            Stopwatch stopwatch = new();
            stopwatch.Start();
            Guid gameId = Guid.NewGuid();
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
            context.SaveChanges();

            while (stopwatch.ElapsedMilliseconds < 1500)
            {

            }
        }

        public async Task MakeTurn(Guid gameId, int playerNumber, string thrownCard)
        {
            try
            {
                Turn turn = new()
                {
                    PlayerNumber = playerNumber,
                    ThrownCard = JsonConvert.DeserializeObject<Card>(thrownCard) ?? throw new Exception("Cannot deserialize card " + thrownCard)
                };

                await Clients.Group(gameId.ToString()).ShowTurn(JsonConvert.SerializeObject(turn));
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
