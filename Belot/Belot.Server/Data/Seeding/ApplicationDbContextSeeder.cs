namespace Belot.Server.Data.Seeding
{
    using Belot.Data;
    using Belot.Server.Utils;
    using Microsoft.Extensions.Options;

    public class ApplicationDbContextSeeder : ISeeder
    {
        public async Task SeedAsync(
            ApplicationDbContext context,
            IServiceProvider serviceProvider,
            IOptions<ApplicationConfig> appConfig)
        {
            ArgumentNullException.ThrowIfNull(context);

            ArgumentNullException.ThrowIfNull(serviceProvider);

            var logger = serviceProvider
                .GetService<ILoggerFactory>()!
                .CreateLogger(typeof(ApplicationDbContextSeeder));

            var seeders = new List<ISeeder>
            {
                new RolesSeeder(),
                new UsersSeeder()
            };

            foreach (var seeder in seeders)
            {
                await seeder.SeedAsync(context, serviceProvider, appConfig);
                await context.SaveChangesAsync();

                logger.LogInformation($"Seeder {seeder.GetType().Name} done.");
            }
        }
    }
}
