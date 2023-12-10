using Belot.Models.Belot;

namespace Belot.Models.Http.Responses.SignalR
{
    public class ShowOpponentCardResponse
    {
        public Card Card { get; set; }
        public int OpponentRelativeIndex { get; internal set; }
    }
}
