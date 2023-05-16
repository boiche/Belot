using Belot.Models.DataEntries;
using Belot.Services.Application.Auth.Interfaces;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace Belot.Utils
{
    public class JWTMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly JWTSettings _settings;

        public JWTMiddleware(RequestDelegate next, IOptions<JWTSettings> options)
        {
            _next = next;
            _settings = options.Value;
        }

        public async Task Invoke(HttpContext context, IUserService<ApplicationUser> userService)
        {
            string token = context.Request.Headers.Authorization.FirstOrDefault()?.Split(" ").First();            

            if (!string.IsNullOrEmpty(token)) 
            {
                token = token.Remove(0, 1);
                AttachUserToHttpContext(context, userService, token);
            }

            await _next(context);
        }

        private void AttachUserToHttpContext(HttpContext context, IUserService<ApplicationUser> userService, string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_settings.Secret);
                tokenHandler.ValidateToken(token, new TokenValidationParameters()
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var userId = jwtToken.Claims.First(x => x.Type == "id").Value;

                context.Items["User"] = userId;
            }
            catch (Exception e) 
            {
                throw e;
            }
        }
    }
}
