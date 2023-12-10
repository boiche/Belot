using Belot.Models.Belot;

namespace Belot.Models.Http.Requests.SignalR
{
    public class HandAnnouncementRequest : BaseSignalRRequest
    {
        public HandAnnouncement Announcement { get; set; }
        public int? HighestRank { get; set; } 
    }
}
