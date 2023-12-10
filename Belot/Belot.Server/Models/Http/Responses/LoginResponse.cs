using Belot.Models.DataEntries;
using Belot.Models.Http.Requests;

namespace Belot.Models.Http.Responses
{
    public class LoginResponse : BaseRequest
    {
        public LoginResponse(DateTimeOffset lockoutDateEnd)
        {
            this.LockoutDateEnd = lockoutDateEnd;
        }

        public LoginResponse(string userId, bool wrongCredentials)
        {
            WrongCredentials = wrongCredentials;
            Id = userId;
        }
        public LoginResponse(DateTime banDate, string banReason)
        {
            BanDate = banDate;
            BanReason = banReason;
        }
        public LoginResponse(ApplicationUser user, string token)
        {
            Id = user.Id;
            Username = user.UserName;
            AuthToken = token;
        }

        public bool WrongCredentials { get; internal set; }
        public DateTime? BanDate { get; set; }
        public string BanReason { get; set; }
        public string Id { get; internal set; }
        public string? Username { get; internal set; }
        public DateTimeOffset LockoutDateEnd { get; set; }
        public string AuthToken { get; set; }
    }
}
