namespace Belot.Models.Http.Requests
{
    public class BanRequest : BaseRequest
    {
        public object UserId { get; internal set; }
        public DateTime BanDate { get; internal set; }
        public object BanReason { get; internal set; }
    }
}
