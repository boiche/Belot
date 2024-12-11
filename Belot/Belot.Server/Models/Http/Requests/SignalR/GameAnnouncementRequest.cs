namespace Belot.Models.Http.Requests.SignalR
{
    using Models.Belot;

    public class GameAnnouncementRequest : BaseSignalRRequest
    {
        public GameAnnouncement Announcement { get; set; }
    }
}
