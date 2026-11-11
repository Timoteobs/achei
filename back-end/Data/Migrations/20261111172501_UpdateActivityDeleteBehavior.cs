using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateActivityDeleteBehavior : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tbl_activity_tbl_space_space_id",
                table: "tbl_activity");

            migrationBuilder.DropForeignKey(
                name: "FK_tbl_activity_tbl_user_user_id",
                table: "tbl_activity");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_activity_tbl_space_space_id",
                table: "tbl_activity",
                column: "space_id",
                principalTable: "tbl_space",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_activity_tbl_user_user_id",
                table: "tbl_activity",
                column: "user_id",
                principalTable: "tbl_user",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tbl_activity_tbl_space_space_id",
                table: "tbl_activity");

            migrationBuilder.DropForeignKey(
                name: "FK_tbl_activity_tbl_user_user_id",
                table: "tbl_activity");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_activity_tbl_space_space_id",
                table: "tbl_activity",
                column: "space_id",
                principalTable: "tbl_space",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_activity_tbl_user_user_id",
                table: "tbl_activity",
                column: "user_id",
                principalTable: "tbl_user",
                principalColumn: "id");
        }
    }
}
