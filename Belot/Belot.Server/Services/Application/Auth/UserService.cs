namespace Belot.Services.Application.Auth
{
    using Models.DataEntries;
    using Models.Http.Requests;
    using Models.Http.Responses;
    using Services.Application.Auth.Interfaces;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Options;
    using Microsoft.IdentityModel.Tokens;
    using System.IdentityModel.Tokens.Jwt;
    using System.Security.Claims;
    using System.Text;
    using Server.Utils;

    public class UserService(IOptions<ApplicationConfig> appConfig) 
        : BaseAppService, IUserService<ApplicationUser>
    {
        public SignInManager<ApplicationUser> SignInManager { get; set; }

        public UserManager<ApplicationUser> UserManager { get; set; }

        // TODO: Implement when Ban functionality is started
        public bool Ban(BanRequest banRequest)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<ApplicationUser>> GetAllAsync()
        {
            return await this.context.Users
                .ToListAsync();
        }

        public async Task<ApplicationUser> GetByIdAsync(string id)
        {
            return await this.context.Users
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            var user = await this.context.Users
                .SingleOrDefaultAsync(x => x.UserName == request.Username);

            if (user == null)
            {
                return new LoginResponse(string.Empty, true);
            }

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
                return new LoginResponse(string.Empty, true);
            }
        }

        public async Task<LogoutResponse> LogoutAsync(LogoutRequest request)
        {
            await SignInManager.SignOutAsync();

            return new LogoutResponse()
            {
                Status = true
            };
        }

        public async Task<RegisterResponse> RegisterAsync(RegisterRequest request)
        {
            ApplicationUser user = new()
            {
                Email = request.Email,
                UserName = request.Username,
                UserBalanceId = Guid.NewGuid()
            };

            var result = await UserManager.CreateAsync(user, request.Password);
            if (result.Succeeded)
            {
                var token = JWT.GenerateJwtToken(user, appConfig);
                await UserManager.SetAuthenticationTokenAsync(user, "Bearer", "authToken", token.RawData);

                return new RegisterResponse(token, user);
            }
            else
            {
                return new RegisterResponse(result.Errors.First().Description);
            }
        }
    }
}
