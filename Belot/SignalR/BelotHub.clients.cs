using Belot.Models.Belot;
using Belot.Models.Http.Responses.SignalR;

namespace Belot.SignalR
{
    public partial class BelotHub
    {
        public Task SecondDeal(GameAnnouncement announcement)
        {
            return Task.Run(() => announcement);
        }

        public Task StartGame(Guid gameId)
        {
            return Task.Run(() => gameId);
        }

        public Task AwaitGame()
        {
            DebugHelper.WriteLine(() => "Player with connection " + Context.ConnectionId + " has joined the game");

            return Task.CompletedTask;
        }

        public Task DealNew()
        {
            return Task.CompletedTask;
        }

        public Task RefreshPlayer()
        {
            return Task.CompletedTask;
        }

        public Task UpdateClientAnnouncements(GameAnnouncement announcement)
        {
            return Task.Run(() => announcement);
        }

        public Task OnTurn(Turn turn)
        {
            return Task.Run(() => turn);
        }

        public Task ShowOpponentCard(ShowOpponentCardResponse response)
        {
            return Task.Run(() => response);
        }

        public Task CollectCards(CollectCardsResponse response)
        {
            return Task.Run(() => response);
        }

        public Task ShowScore(ShowScoreResponse response)
        {
            return Task.Run(() => response);
        }
    }
}
