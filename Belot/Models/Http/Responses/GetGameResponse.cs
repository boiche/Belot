using Belot.Models.DataEntries;

namespace Belot.Models.Http.Responses
{
    public class GetGameResponse : BaseResponse
    {
        public Game game { get; set; }
    }
}
