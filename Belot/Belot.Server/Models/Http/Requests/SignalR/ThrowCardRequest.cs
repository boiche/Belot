namespace Belot.Models.Http.Requests.SignalR
{
    using Models.Belot;

    public class ThrowCardRequest : BaseSignalRRequest
    {
        public Card Card { get; set; }

        public string OpponentConnectionId { get; set; }
    }
}
