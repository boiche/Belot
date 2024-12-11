namespace Belot.Data.Configurations
{
    using Belot.Models.DataEntries;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Metadata.Builders;

    public class HandLogConfiguration : IEntityTypeConfiguration<HandLog>
    {
        public void Configure(EntityTypeBuilder<HandLog> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();
        }
    }
}
