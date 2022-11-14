using Belot.Models;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace Belot.SignalR
{
    public class BelotHub : Hub<IBelotHub>
    {
        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public void AddToGame(Guid gameId)
        {
            Groups.AddToGroupAsync(Context.ConnectionId, gameId.ToString());                       
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
