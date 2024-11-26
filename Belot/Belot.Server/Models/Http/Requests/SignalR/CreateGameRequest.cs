namespace Belot.Models.Http.Requests.SignalR
{
    public class CreateGameRequest : BaseSignalRRequest
    {
        [Obsolete("This request type doesn't work with gameId, yet is part of the SignalR requests")]
        public new Guid GameId { get; set; }

        public string Username { get; set; }

        public decimal PrizePool { get; set; }
    }
}
