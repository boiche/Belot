namespace Belot.Models.Http.Requests
{
    public class RegisterRequest : BaseRequest
    {
        public string Username { get; internal set; }
        public string Password { get; internal set; }
        public string Email { get; internal set; }
    }
}
