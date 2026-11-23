using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class AddNotifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "tbl_notification",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    message = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: false),
                    type = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    screen_id = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    payload = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    was_read = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    sent_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    read_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_notification", x => x.id);
                    table.ForeignKey(
                        name: "FK_tbl_notification_tbl_user_user_id",
                        column: x => x.user_id,
                        principalTable: "tbl_user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tbl_notification_user_id_sent_at",
                table: "tbl_notification",
                columns: new[] { "user_id", "sent_at" });

            migrationBuilder.CreateIndex(
                name: "IX_tbl_notification_user_id_was_read",
                table: "tbl_notification",
                columns: new[] { "user_id", "was_read" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tbl_notification");
        }
    }
}
