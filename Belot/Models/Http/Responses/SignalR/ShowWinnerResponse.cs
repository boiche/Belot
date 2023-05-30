using Belot.Models.Belot;

namespace Belot.Models.Http.Responses.SignalR
{
    public class ShowWinnerResponse : BaseResponse
    {
        public Score Score { get; set; }
    }
}
