using Belot.Models.Belot;
using Belot.Models.DataEntries;

namespace Belot.Services.Logging.Interfaces
{
    /// <summary>
    /// Provides the mechanism for creating ML training records
    /// </summary>
    public interface IHandLogger
    {
        /// <summary>
        /// Creates a new log with provided data
        /// </summary>
        /// <param name="playedCards">Cards that already have been played by other players</param>
        /// <param name="playingHand">Cards in hand for current player</param>
        /// <param name="cardToRemove">Played card</param>
        /// <param name="announcement">Current announcement of the game</param>
        /// <returns></returns>
        HandLog CreateLog(List<Card> playedCards, List<Card> playingHand, Card cardToRemove, GameAnnouncement announcement);
        Task<int> SaveChangesAsync();
    }
}
