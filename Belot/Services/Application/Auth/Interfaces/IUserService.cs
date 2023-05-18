using Belot.Models.DataEntries;
using Belot.Models.Http.Requests;
using Belot.Models.Http.Responses;
using Microsoft.AspNetCore.Identity;

namespace Belot.Services.Application.Auth.Interfaces
{
    public interface IUserService<T> : IAppService where T : class
    {
        Task<LoginResponse> Login(LoginRequest model);
        IEnumerable<ApplicationUser> GetAll();
        ApplicationUser GetById(string id);
        Task<RegisterResponse> Register(RegisterRequest newUser);
        public bool Ban(BanRequest banRequest);
        Task<LogoutResponse> Logout(LogoutRequest request);

        public SignInManager<T> SignInManager { get; set; }
        public UserManager<T> UserManager { get; set; }
    }
}
