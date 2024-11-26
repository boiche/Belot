namespace Belot.Models.Http.Requests
{
    public class BanRequest : BaseRequest
    {
        public string UserId { get; internal set; }

        public DateTime BanDate { get; internal set; }

        public string BanReason { get; internal set; }
    }
}
