using Belot.Data.Configurations;
using Belot.Models.DataEntries;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Belot.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions options)
            : base(options)
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