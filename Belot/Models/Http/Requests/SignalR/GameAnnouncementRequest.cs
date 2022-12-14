namespace Belot.Models.Http.Requests.SignalR
{
    public class GameAnnouncementRequest : BaseSignalRRequest
    {
        public GameAnnouncement Announcement { get; set; }
    }
}
