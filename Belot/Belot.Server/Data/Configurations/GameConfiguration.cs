﻿using Belot.Models.DataEntries;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Belot.Data.Configurations
{
    public class GameConfiguration : IEntityTypeConfiguration<Game>
    {
        public void Configure(EntityTypeBuilder<Game> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.PrizePool)
                .HasColumnType("decimal(18,2)")
                .HasDefaultValue(0);
            builder.Property(x => x.CreatedBy).IsRequired(false);
            builder.Property(x => x.ModifiedBy).IsRequired(false);
        }
    }
}
