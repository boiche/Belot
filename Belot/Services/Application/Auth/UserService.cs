using Belot.Models.DataEntries;
using Belot.Models.Http.Requests;
using Belot.Models.Http.Responses;
using Belot.Services.Application.Auth.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace Belot.Services.Application.Auth
{
    public class UserService : BaseAppService, IUserService<ApplicationUser> //TODO: Make it generic (low priority)
    {
        public SignInManager<ApplicationUser> SignInManager { get; set; }
        public UserManager<ApplicationUser> UserManager { get; set; }

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

            var result = await SignInManager.PasswordSignInAsync(user, request.Password, true, true);
            if (result.Succeeded)
            {
                var token = GenerateJwtToken(user);
                return new LoginResponse(user, token);
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

        public IdentityResult Register(RegisterRequest request)
        {
            ApplicationUser user = new()
            {
                Email = request.Email,
                UserName = request.Username                
            };
            return UserManager.CreateAsync(user, request.Password).Result;
        }

        private string GenerateJwtToken(ApplicationUser user)
        {
            throw new NotImplementedException();
        }
    }
}
