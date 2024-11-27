namespace Belot.Server.Data.Seeding
{
    using Belot.Data;
    using Belot.Models.DataEntries;
    using Belot.Server.Utils;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Options;

    public class UsersSeeder : ISeeder
    {
        public async Task SeedAsync(
            ApplicationDbContext dbContext,
            IServiceProvider serviceProvider,
            IOptions<ApplicationConfig> appConfig)
        {
            var userManager = serviceProvider
                .GetRequiredService<UserManager<ApplicationUser>>();

            if (!await userManager.Users
                .AnyAsync(x => x.UserName == appConfig.Value.AdministratorUserName))
            {
                var user = new ApplicationUser
                {
                    UserName = appConfig.Value.AdministratorUserName,
                    Email = appConfig.Value.AdministratorEmail,
                    UserBalance = new UserBalance()
                };

                var result = await userManager.CreateAsync(user, appConfig.Value.AdministratorPassword);

                if (result.Succeeded)
                {
                    var token = JWT.GenerateJwtToken(user, appConfig);
                    await userManager.SetAuthenticationTokenAsync(user, "Bearer", "authToken", token.RawData);

                    await userManager.AddToRoleAsync(user, appConfig.Value.AdministratorRoleName);
                }
                else
                {
                    throw new Exception(string.Join(Environment.NewLine, result.Errors.Select(e => e.Description)));
                }
            }
        }
    }
}
