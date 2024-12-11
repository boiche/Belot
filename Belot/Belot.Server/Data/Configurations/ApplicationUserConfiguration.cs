namespace Belot.Server.Data.Configurations
{
    using Belot.Models.DataEntries;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Metadata.Builders;

    public class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser>
    {
        public void Configure(EntityTypeBuilder<ApplicationUser> builder)
        {
            builder
                .HasOne(x => x.UserBalance)
                .WithOne(x => x.User)
                .HasForeignKey<UserBalance>(x => x.UserId)
                .IsRequired(false);

            builder
               .HasMany(e => e.Roles)
               .WithOne()
               .HasForeignKey(e => e.UserId)
               .IsRequired();
        }
    }
}
