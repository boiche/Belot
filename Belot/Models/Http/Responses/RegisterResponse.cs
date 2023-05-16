using System.IdentityModel.Tokens.Jwt;

namespace Belot.Models.Http.Responses
{
    public class RegisterResponse : BaseResponse
    {
        public RegisterResponse(JwtSecurityToken authToken)
        {
            AuthToken = authToken.RawData;
        }
        public RegisterResponse(string error)
        {
            Error = error;
        }

        public string AuthToken { get; set; }
        public string Error { get; set; }
    }
}
