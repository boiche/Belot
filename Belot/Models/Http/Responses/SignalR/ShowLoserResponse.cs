using Belot.Models.Belot;

namespace Belot.Models.Http.Responses.SignalR
{
    public class ShowLoserResponse : BaseResponse
    {
        public Score Score { get; set; }
    }
}
