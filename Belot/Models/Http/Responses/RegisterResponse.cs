using Belot.Models.DataEntries;
using System.IdentityModel.Tokens.Jwt;

namespace Belot.Models.Http.Responses
{
    public class RegisterResponse : BaseResponse
    {
        public RegisterResponse(JwtSecurityToken authToken, ApplicationUser user)
        {
            AuthToken = authToken.RawData;
            User = user;
        }
        public RegisterResponse(string error)
        {
            Error = error;
        }

        public string AuthToken { get; set; }
        public string Error { get; set; }
        public ApplicationUser User { get; set; }
    }
}
