namespace Belot.Server.Data.Seeding
{
    using Belot.Data;
    using Belot.Server.Models.DataEntries;
    using Belot.Server.Utils;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.Extensions.Options;

    public class RolesSeeder : ISeeder
    {
        public async Task SeedAsync(
            ApplicationDbContext dbContext,
            IServiceProvider serviceProvider,
            IOptions<ApplicationConfig> appConfig)
        {
            var roleManager = serviceProvider
               .GetRequiredService<RoleManager<ApplicationRole>>();

            await SeedRoleAsync(roleManager, appConfig.Value.AdministratorRoleName);
            await SeedRoleAsync(roleManager, appConfig.Value.UserRoleName);
        }

        private static async Task SeedRoleAsync(RoleManager<ApplicationRole> roleManager, string roleName)
        {
            var role = await roleManager.FindByNameAsync(roleName);

            if (role == null)
            {
                var result = await roleManager.CreateAsync(new ApplicationRole(roleName));

                if (!result.Succeeded)
                {
                    throw new Exception(string.Join(Environment.NewLine, result.Errors.Select(e => e.Description)));
                }
            }
        }
    }
}
