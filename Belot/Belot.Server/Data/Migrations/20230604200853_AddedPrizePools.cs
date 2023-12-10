using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Belot.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddedPrizePools : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "PrizePool",
                table: "Games",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PrizePool",
                table: "Games");
        }
    }
}
