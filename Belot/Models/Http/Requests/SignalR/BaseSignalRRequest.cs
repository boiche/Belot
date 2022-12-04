namespace Belot.Models.Http.Requests.SignalR
{
    public abstract class BaseSignalRRequest
    {
        public Guid GameId { get; set; }
    }
}
