namespace Belot.Controllers
{
    using Belot.Data;
    using Belot.Models.DataEntries;
    using Belot.Models.Http.Requests;
    using Belot.Models.Http.Responses;
    using Belot.Services.Application.Auth.Interfaces;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;

    public class UsersController : ApiController
    {
        private readonly IUserService<ApplicationUser> userService;

        public UsersController(
            ApplicationDbContext context,
            IUserService<ApplicationUser> userService,
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager)
        {
            this.userService = userService;
            userService.SetContext(context);
            userService.SignInManager = signInManager;
            userService.UserManager = userManager;
        }

        [ProducesResponseType(typeof(RegisterResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(RegisterResponse), StatusCodes.Status400BadRequest)]
        [HttpPost]
        [Route(nameof(Register))]
        public async Task<ActionResult> Register([FromBody] RegisterRequest request)
        {
            var response = await this.userService.RegisterAsync(request);

            if (string.IsNullOrEmpty(response.Error))
            {
                return Ok(response);
            }
            else
            {
                return BadRequest(response.Error);
            }
        }

        [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status401Unauthorized)]
        [HttpPost]
        [Route(nameof(Login))]
        public async Task<ActionResult> Login(LoginRequest request)
        {
            var response = await this.userService.LoginAsync(request);

            if (response.WrongCredentials)
            {
                return Unauthorized($"Invalid email or password");
            }
            else if (!string.IsNullOrEmpty(response.Id))
            {
                return Ok(response);
            }
            else if (response.BanDate.HasValue)
            {
                return Unauthorized($"You're banned until: {response.BanDate}");
            }
            else
            {
                return Unauthorized($"Invalid email or password");
            }
        }

        [ProducesResponseType(typeof(LogoutResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(LogoutResponse), StatusCodes.Status204NoContent)]
        [HttpPost]
        [Route(nameof(Logout))]
        public async Task<ActionResult> Logout(LogoutRequest request)
        {
            var response = await this.userService.LogoutAsync(request);

            if (response.Status)
            {
                return Ok(response);
            }
            else
            {
                return NoContent();
            }
        }

        [ProducesResponseType(typeof(JsonResult), StatusCodes.Status200OK)]
        [HttpGet]
        [Route(nameof(GetUser))]
        public async Task<ActionResult> GetUser(GetUserRequest request)
        {
            return new JsonResult(new
            {
                user = await userService.GetByIdAsync(request.Username)
            });
        }

        [ProducesResponseType(typeof(JsonResult), StatusCodes.Status200OK)]
        [HttpGet]
        [Route(nameof(GetUsers))]
        public async Task<ActionResult> GetUsers()
        {
            return new JsonResult(new
            {
                users = await userService.GetAllAsync()
            });
        }
    }
}
