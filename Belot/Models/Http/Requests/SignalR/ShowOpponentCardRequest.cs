namespace Belot.Models.Http.Requests.SignalR
{
    public class ThrowCardRequest : BaseSignalRRequest
    {
        public Card Card { get; set; }
        public string OpponentConnectionId { get; set; }
    }
}
