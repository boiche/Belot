using Belot.Data;
using Belot.Models.DataEntries;
using Belot.Models.Http.Requests;
using Belot.Services.Application.Auth.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Belot.Controllers
{
    [Route("Security/[controller]")]
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
        public IActionResult Register(RegisterRequest request)
        {
            if (userService.Register(request))
                return Ok();
            else
                return BadRequest();
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginRequest request) 
        {
            if (!request.Checked)
            {
                return Unauthorized("Please check I'm not a robot");
            }

            var response = await this.userService.Login(request);

            if (response.WrongCredentials)
            {
                return Unauthorized($"Invalid email or password");
            }
            if (!string.IsNullOrEmpty(response.Id))            
                return Ok(response);
            
            else if (response.BanDate.HasValue)
                return Unauthorized($"You're banned until: {response.BanDate}");

            return Unauthorized($"Invalid email or password");
        }

        [HttpGet]
        public IActionResult GetUser(GetUserRequest request)
        {
           return new JsonResult(new 
           { 
               user = userService.GetById(request.Username) 
           });
        }

        [HttpGet]
        public IActionResult GetUsers()
        {
            return new JsonResult(new
            {
                users = userService.GetAll().ToList()
            });
        }
    }
}
