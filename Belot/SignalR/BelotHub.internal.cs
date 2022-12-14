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
            int dealerPlayer = judgeManager.Judges[id].DealerPlayer.PlayerIndex;
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
    }
}
