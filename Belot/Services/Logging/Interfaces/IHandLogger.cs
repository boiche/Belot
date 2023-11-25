using Belot.Data;
using Belot.Models.Belot;
using Belot.Models.DataEntries;

namespace Belot.Services.Logging.Interfaces
{
    /// <summary>
    /// Provides the mechanism for creating ML training records
    /// </summary>
    public interface IHandLogger
    {
        ApplicationDbContext DbContext { get; set; }
        HandLog CreateLog(List<Card> playedCards, List<Card> playingHand, Card cardToRemove, GameAnnouncement announcement);
        Task<int> SaveChangesAsync();        
    }
}
