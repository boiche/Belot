using Belot.Models.DataEntries;
using Belot.Models.Http.Requests;
using Belot.Models.Http.Responses;
using Belot.Services.Application.Auth.Interfaces;
using Belot.Utils;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Belot.Services.Application.Auth
{
    public class UserService : BaseAppService, IUserService<ApplicationUser> //TODO: Make it generic (low priority)
    {
        public SignInManager<ApplicationUser> SignInManager { get; set; }
        public UserManager<ApplicationUser> UserManager { get; set; }

        private readonly JWTSettings _jwtSettings;

        public UserService(IOptions<JWTSettings> appSettings)
        {
            _jwtSettings = appSettings.Value;
        }

        public bool Ban(BanRequest banRequest)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ApplicationUser> GetAll()
        {
            throw new NotImplementedException();
        }

        public ApplicationUser GetById(string id)
        {
            return this.context.Users.SingleOrDefault(x => x.Id == id);
        }

        public async Task<LoginResponse> Login(LoginRequest request)
        {
            var user = context.Users.SingleOrDefault(x => x.UserName == request.Username);

            if (user == null)
                return new LoginResponse(default, true);

            var result = await SignInManager.PasswordSignInAsync(user, request.Password, true, false);
            if (result.Succeeded)
            {
                string token = await UserManager.GetAuthenticationTokenAsync(user, "Bearer", "authToken");
                return token == null
                    ? throw new NullReferenceException($"Auth token of {request.Username} is empty")
                    : new LoginResponse(user, token);
            }
            else if (result.IsLockedOut)
            {
                return new LoginResponse(user.LockoutEnd.Value);
            }
            else
            {
                return new LoginResponse(default, true);
            }
        }

        public async Task<LogoutResponse> Logout(LogoutRequest request)
        {
            await SignInManager.SignOutAsync();
            bool isOut = SignInManager.IsSignedIn(ClaimsPrincipal.Current);
            return new LogoutResponse()
            {
                Status = isOut
            };
        }

        public async Task<RegisterResponse> Register(RegisterRequest request)
        {
            ApplicationUser user = new()
            {
                Email = request.Email,
                UserName = request.Username                
            };
            var result = await UserManager.CreateAsync(user, request.Password);
            if (result.Succeeded) 
            {
                var token = GenerateJwtToken(user);
                await UserManager.SetAuthenticationTokenAsync(user, "Bearer", "authToken", token.RawData);
                return new RegisterResponse(token, user);
            }
            else
            {
                return new RegisterResponse(result.Errors.First().Description);
            }
        }

        private JwtSecurityToken GenerateJwtToken(ApplicationUser user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("id", user.Id.ToString()) }),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            return (JwtSecurityToken)tokenHandler.CreateToken(tokenDescriptor);
        }
    }
}
