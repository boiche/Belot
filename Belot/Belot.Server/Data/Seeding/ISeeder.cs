namespace Belot.Server.Data.Seeding
{
    using Belot.Data;
    using Belot.Server.Utils;
    using Microsoft.Extensions.Options;

    public interface ISeeder
    {
        Task SeedAsync(
           ApplicationDbContext dbContext,
           IServiceProvider serviceProvider,
           IOptions<ApplicationConfig> appConfig);
    }
}
