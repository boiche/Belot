using Belot.Models.DataEntries;

namespace Belot.Models.Http.Responses
{
    public class GetAvailableGamesResponse : BaseResponse
    {
        public List<Game> Games { get; set; }
    }
}
