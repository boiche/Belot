namespace Belot.Utils
{
    using Belot.Models.DataEntries;
    using Belot.Server.Utils;
    using Belot.Services.Application.Auth.Interfaces;
    using Microsoft.Extensions.Options;
    using Microsoft.IdentityModel.Tokens;
    using System.IdentityModel.Tokens.Jwt;
    using System.Text;

    public class JWTMiddleware(RequestDelegate next, IOptions<ApplicationConfig> appConfig)
    {
        private readonly string _jwtSecret = appConfig.Value.JwtSecret;

        public async Task Invoke(HttpContext context, IUserService<ApplicationUser> userService)
        {
            string token = context.Request.Headers.Authorization.FirstOrDefault()?.Split(" ").First();

            if (!string.IsNullOrEmpty(token))
            {
                token = token.Remove(0, 1);
                AttachUserToHttpContext(context, userService, token);
            }

            await next(context);
        }

        /// <summary>
        /// Sets user's id to the <see cref="HttpContent"/>
        /// </summary>
        /// <param name="context"></param>
        /// <param name="userService"></param>
        /// <param name="token"></param>
        private void AttachUserToHttpContext(HttpContext context, IUserService<ApplicationUser> userService, string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_jwtSecret);
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
            catch (Exception)
            {
                throw;
            }
        }
    }
}
