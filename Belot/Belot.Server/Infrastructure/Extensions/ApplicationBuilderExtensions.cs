namespace Belot.Server.Infrastructure.Extensions
{
    using Belot.Data;
    using Belot.Server.Data.Seeding;
    using Belot.Server.Utils;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Options;

    public static class ApplicationBuilderExtensions
    {
        public static void ApplyMigrationsAndSeedDatabase(this IApplicationBuilder appBuilder)
        {
            using var serviceScope = appBuilder.ApplicationServices.CreateScope();

            var dbContext = serviceScope
                .ServiceProvider
                .GetService<ApplicationDbContext>();

            dbContext.Database.Migrate();

            var appConfig = serviceScope
                .ServiceProvider
                .GetService<IOptions<ApplicationConfig>>();

            new ApplicationDbContextSeeder()
                .SeedAsync(dbContext, serviceScope.ServiceProvider, appConfig!)
                .GetAwaiter()
                .GetResult();
        }
    }
}
