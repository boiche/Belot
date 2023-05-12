namespace Belot.Models.Http.Requests
{
    public class LoginRequest : BaseRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public bool Checked { get; set; }
        public string IPAddress { get; internal set; }
    }
}
