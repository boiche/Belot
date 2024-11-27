using Belot.Models.DataEntries;

namespace Belot.Models.Http.Responses.SignalR
{
    public class GetGameInfoResponse
    {
        public Game Game { get; set; }

        public int DealerPlayer { get; set; }

        public int DealerPlayerRealtive { get; internal set; }
    }
}
