using Belot.Data.Configurations;
using Belot.Models.DataEntries;
using Duende.IdentityServer.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Laraue.EfCoreTriggers.Common.Extensions;

namespace Belot.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions options, IOptions<OperationalStoreOptions> operationalStoreOptions)
            : base(options, operationalStoreOptions)
        {

        }

        public DbSet<Game> Games { get; set; }
        public DbSet<UserBalance> UserBalances { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            string insertUserBalance = @"";

            builder.Entity<ApplicationUser>()
                .HasOne(x => x.UserBalance)
                .WithOne(x => x.User)
                .HasForeignKey<UserBalance>(x => x.UserId)
                .IsRequired(false);

            builder.ApplyConfiguration(new GameConfiguration());
            builder.ApplyConfiguration(new UserBalanceConfiguration());

            base.OnModelCreating(builder);
        }
    }
}