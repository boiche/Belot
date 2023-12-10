using Belot.Data;
using Belot.Models.DataEntries;
using Belot.Models.Http.Requests;
using Belot.Services.Application.Auth.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Belot.Controllers
{
    [ApiController]

    public class UsersController : ControllerBase
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

        [HttpPost]
        [Route("/Users/Register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            var response = userService.Register(request).Result;
            if (string.IsNullOrEmpty(response.Error))
                return Ok(response);
            else
                return BadRequest(response.Error);
        }

        [HttpPost]
        [Route("/Users/Login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var response = await this.userService.Login(request);

            if (response.WrongCredentials)
                return Unauthorized($"Invalid email or password");

            else if (!string.IsNullOrEmpty(response.Id))
                return Ok(response);

            else if (response.BanDate.HasValue)
                return Unauthorized($"You're banned until: {response.BanDate}");

            else
                return Unauthorized($"Invalid email or password");
        }

        [HttpPost]
        [Route("/Users/Logout")]
        public async Task<IActionResult> Logout(LogoutRequest request)
        {
            var response = await this.userService.Logout(request);
            if (response.Status)
                return Ok(response);

            else
                return NoContent();
        }

        [HttpGet]
        [Route("/Users/GetUser")]
        public IActionResult GetUser(GetUserRequest request)
        {
            return new JsonResult(new
            {
                user = userService.GetById(request.Username)
            });
        }

        [HttpGet]
        [Route("/Users/GetUsers")]
        public IActionResult GetUsers()
        {
            return new JsonResult(new
            {
                users = userService.GetAll().ToList()
            });
        }
    }
}
