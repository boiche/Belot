namespace Belot.Data
{
    using Belot.Data.Configurations;
    using Belot.Models.DataEntries;
    using Belot.Server.Data.Configurations;
    using Belot.Server.Models.DataEntries;
    using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore;

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Game> Games { get; set; }

        public DbSet<UserBalance> UserBalances { get; set; }

        public DbSet<HandLog> HandLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.ApplyConfiguration(new GameConfiguration());
            builder.ApplyConfiguration(new UserBalanceConfiguration());
            builder.ApplyConfiguration(new HandLogConfiguration());
            builder.ApplyConfiguration(new ApplicationUserConfiguration());
        }
    }
}