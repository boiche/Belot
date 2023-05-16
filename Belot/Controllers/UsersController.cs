﻿using Belot.Data;
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
        public IActionResult Register([FromBody]RegisterRequest request)
        {
            var response = userService.Register(request);
            if (!response.Errors.Any())
                return Ok();
            else
                return BadRequest(response.Errors);
        }

        [HttpPost]
        [Route("/Users/Login")]
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
