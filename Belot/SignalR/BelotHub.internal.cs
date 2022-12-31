using Belot.Models;
using Belot.Models.Http.Requests.SignalR;
using System.Diagnostics;

namespace Belot.SignalR
{
    public partial class BelotHub
    {
        private void DealNewInternal(Guid gameId)
        {
            judgeManager.Judges[gameId].DealNew();
        }

        private Task StartGameInternal(Guid gameId)
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

        private void SecondDealInternal(Guid gameId)
        {

        }

        /// <summary>
        /// Gets the dealer seat based on current player's seat
        /// </summary>
        /// <returns></returns>
        private int GetRelativeDealerIndex(Guid id)
        {
            return judgeManager.Judges[id].GetRelativePlayerIndex(judgeManager.Judges[id].DealerPlayer.ConnectionId, Context.ConnectionId);
        }

        private void RemoveCardInternal(ThrowCardRequest request)
        {
            var playingHand = judgeManager.Judges[request.GameId].GetPlayer(Context.ConnectionId).PlayingHand;
            Card cardToRemove = playingHand.First(x => x.Rank == request.Card.Rank && x.Suit == request.Card.Suit);
            request.Card.FrameIndex = cardToRemove.FrameIndex;
            playingHand.Remove(cardToRemove);
        }
    }
}
