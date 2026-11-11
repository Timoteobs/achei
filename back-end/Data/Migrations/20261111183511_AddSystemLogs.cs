using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class AddSystemLogs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "tbl_system_log",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    level = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    category = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    event_id = table.Column<int>(type: "int", nullable: false),
                    message = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: false),
                    exception = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    trace_id = table.Column<string>(type: "varchar(32)", unicode: false, maxLength: 32, nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_system_log", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tbl_system_log_created_at",
                table: "tbl_system_log",
                column: "created_at");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tbl_system_log");
        }
    }
}
