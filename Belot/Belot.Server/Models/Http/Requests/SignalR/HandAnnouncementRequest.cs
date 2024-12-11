namespace Belot.Models.Http.Requests.SignalR
{
    using Models.Belot;

    public class HandAnnouncementRequest : BaseSignalRRequest
    {
        public HandAnnouncement Announcement { get; set; }

        public int? HighestRank { get; set; }
    }
}
