namespace Belot.Services.Application.Auth.Interfaces
{
    using Models.DataEntries;
    using Models.Http.Requests;
    using Models.Http.Responses;
    using Microsoft.AspNetCore.Identity;

    public interface IUserService<T> : IAppService where T : class
    {
        Task<LoginResponse> LoginAsync(LoginRequest model);

        Task<IEnumerable<ApplicationUser>> GetAllAsync();

        Task<ApplicationUser> GetByIdAsync(string id);

        Task<RegisterResponse> RegisterAsync(RegisterRequest newUser);

        public bool Ban(BanRequest banRequest);

        Task<LogoutResponse> LogoutAsync(LogoutRequest request);

        public SignInManager<T> SignInManager { get; set; }

        public UserManager<T> UserManager { get; set; }
    }
}
