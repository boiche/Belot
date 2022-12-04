namespace Belot.Models.Http.Requests.SignalR
{
    public class DealtCardsRequest : BaseSignalRRequest
    {
        public int DealPlayerIndex { get; set; }
    }
}
