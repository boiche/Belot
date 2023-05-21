namespace Belot.Models.Http.Requests.SignalR
{
    public class JoinGameRequest : BaseSignalRRequest
    {
        public string Username { get; set; }
    }
}
