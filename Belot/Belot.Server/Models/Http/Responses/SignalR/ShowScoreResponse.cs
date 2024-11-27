using Belot.Models.Belot;

namespace Belot.Models.Http.Responses.SignalR
{
    public class ShowScoreResponse
    {
        public Score Score { get; set; }

        public bool IsGameOver { get; set; }
    }
}
