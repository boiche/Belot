using Belot.Models.DataEntries;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Belot.Data.Configurations
{
    public class UserBalanceConfiguration : IEntityTypeConfiguration<UserBalance>
    {
        public void Configure(EntityTypeBuilder<UserBalance> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Balance).HasColumnType("decimal(18, 2)");
            builder.Property(x => x.CreatedBy).IsRequired(false);
            builder.Property(x => x.ModifiedBy).IsRequired(false);
            //builder.HasOne(x => x.User)
            //    .WithOne(x => x.UserBalance)
            //    .HasForeignKey<ApplicationUser>(x => x.UserBalanceId)
            //    .IsRequired(false);
        }
    }
}
