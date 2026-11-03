using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "user",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    active = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    email = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    password_hash = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    phone = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    avatar_url = table.Column<string>(type: "varchar(1000)", unicode: false, maxLength: 1000, nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "space",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    owner_user_id = table.Column<long>(type: "bigint", nullable: false),
                    name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    image_url = table.Column<string>(type: "varchar(1000)", unicode: false, maxLength: 1000, nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_space", x => x.id);
                    table.ForeignKey(
                        name: "FK_space_user_owner_user_id",
                        column: x => x.owner_user_id,
                        principalTable: "user",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "activity",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    space_id = table.Column<long>(type: "bigint", nullable: false),
                    user_id = table.Column<long>(type: "bigint", nullable: true),
                    action = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    entity_type = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: false),
                    entity_id = table.Column<long>(type: "bigint", nullable: true),
                    metadata = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_activity", x => x.id);
                    table.ForeignKey(
                        name: "FK_activity_space_space_id",
                        column: x => x.space_id,
                        principalTable: "space",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_activity_user_user_id",
                        column: x => x.user_id,
                        principalTable: "user",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "category",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    space_id = table.Column<long>(type: "bigint", nullable: true),
                    name = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    icon = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    color = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    position = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_category", x => x.id);
                    table.ForeignKey(
                        name: "FK_category_space_space_id",
                        column: x => x.space_id,
                        principalTable: "space",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "invitation",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    space_id = table.Column<long>(type: "bigint", nullable: false),
                    invited_by_user_id = table.Column<long>(type: "bigint", nullable: false),
                    email = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    token = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    role = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    status = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false, defaultValue: "PENDING"),
                    expires_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    accepted_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_invitation", x => x.id);
                    table.ForeignKey(
                        name: "FK_invitation_space_space_id",
                        column: x => x.space_id,
                        principalTable: "space",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_invitation_user_invited_by_user_id",
                        column: x => x.invited_by_user_id,
                        principalTable: "user",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "location",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    space_id = table.Column<long>(type: "bigint", nullable: false),
                    parent_location_id = table.Column<long>(type: "bigint", nullable: true),
                    created_by_user_id = table.Column<long>(type: "bigint", nullable: true),
                    name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    type = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: false),
                    description = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    icon = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    color = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    position = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    qr_code = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_location", x => x.id);
                    table.ForeignKey(
                        name: "FK_location_location_parent_location_id",
                        column: x => x.parent_location_id,
                        principalTable: "location",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_location_space_space_id",
                        column: x => x.space_id,
                        principalTable: "space",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_location_user_created_by_user_id",
                        column: x => x.created_by_user_id,
                        principalTable: "user",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "member",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    space_id = table.Column<long>(type: "bigint", nullable: false),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    role = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    joined_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_member", x => x.id);
                    table.ForeignKey(
                        name: "FK_member_space_space_id",
                        column: x => x.space_id,
                        principalTable: "space",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_member_user_user_id",
                        column: x => x.user_id,
                        principalTable: "user",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "tag",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    space_id = table.Column<long>(type: "bigint", nullable: false),
                    name = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    color = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tag", x => x.id);
                    table.ForeignKey(
                        name: "FK_tag_space_space_id",
                        column: x => x.space_id,
                        principalTable: "space",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "item",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    location_id = table.Column<long>(type: "bigint", nullable: false),
                    category_id = table.Column<long>(type: "bigint", nullable: true),
                    created_by_user_id = table.Column<long>(type: "bigint", nullable: true),
                    name = table.Column<string>(type: "varchar(150)", unicode: false, maxLength: 150, nullable: false),
                    description = table.Column<string>(type: "varchar(1000)", unicode: false, maxLength: 1000, nullable: true),
                    quantity = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    notes = table.Column<string>(type: "varchar(1000)", unicode: false, maxLength: 1000, nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_item", x => x.id);
                    table.ForeignKey(
                        name: "FK_item_category_category_id",
                        column: x => x.category_id,
                        principalTable: "category",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_item_location_location_id",
                        column: x => x.location_id,
                        principalTable: "location",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_item_user_created_by_user_id",
                        column: x => x.created_by_user_id,
                        principalTable: "user",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "location_image",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    location_id = table.Column<long>(type: "bigint", nullable: false),
                    url = table.Column<string>(type: "varchar(1000)", unicode: false, maxLength: 1000, nullable: false),
                    position = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_location_image", x => x.id);
                    table.ForeignKey(
                        name: "FK_location_image_location_location_id",
                        column: x => x.location_id,
                        principalTable: "location",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "favorite",
                columns: table => new
                {
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    item_id = table.Column<long>(type: "bigint", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_favorite", x => new { x.user_id, x.item_id });
                    table.ForeignKey(
                        name: "FK_favorite_item_item_id",
                        column: x => x.item_id,
                        principalTable: "item",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_favorite_user_user_id",
                        column: x => x.user_id,
                        principalTable: "user",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "item_image",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    item_id = table.Column<long>(type: "bigint", nullable: false),
                    url = table.Column<string>(type: "varchar(1000)", unicode: false, maxLength: 1000, nullable: false),
                    position = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_item_image", x => x.id);
                    table.ForeignKey(
                        name: "FK_item_image_item_item_id",
                        column: x => x.item_id,
                        principalTable: "item",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "item_tag",
                columns: table => new
                {
                    item_id = table.Column<long>(type: "bigint", nullable: false),
                    tag_id = table.Column<long>(type: "bigint", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_item_tag", x => new { x.item_id, x.tag_id });
                    table.ForeignKey(
                        name: "FK_item_tag_item_item_id",
                        column: x => x.item_id,
                        principalTable: "item",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_item_tag_tag_tag_id",
                        column: x => x.tag_id,
                        principalTable: "tag",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_activity_space_id",
                table: "activity",
                column: "space_id");

            migrationBuilder.CreateIndex(
                name: "IX_activity_space_id_created_at",
                table: "activity",
                columns: new[] { "space_id", "created_at" });

            migrationBuilder.CreateIndex(
                name: "IX_activity_user_id",
                table: "activity",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_category_space_id",
                table: "category",
                column: "space_id");

            migrationBuilder.CreateIndex(
                name: "IX_favorite_item_id",
                table: "favorite",
                column: "item_id");

            migrationBuilder.CreateIndex(
                name: "IX_invitation_invited_by_user_id",
                table: "invitation",
                column: "invited_by_user_id");

            migrationBuilder.CreateIndex(
                name: "IX_invitation_space_id_email",
                table: "invitation",
                columns: new[] { "space_id", "email" });

            migrationBuilder.CreateIndex(
                name: "IX_invitation_token",
                table: "invitation",
                column: "token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_item_category_id",
                table: "item",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "IX_item_created_by_user_id",
                table: "item",
                column: "created_by_user_id");

            migrationBuilder.CreateIndex(
                name: "IX_item_location_id",
                table: "item",
                column: "location_id");

            migrationBuilder.CreateIndex(
                name: "IX_item_name",
                table: "item",
                column: "name");

            migrationBuilder.CreateIndex(
                name: "IX_item_image_item_id",
                table: "item_image",
                column: "item_id");

            migrationBuilder.CreateIndex(
                name: "IX_item_tag_tag_id",
                table: "item_tag",
                column: "tag_id");

            migrationBuilder.CreateIndex(
                name: "IX_location_created_by_user_id",
                table: "location",
                column: "created_by_user_id");

            migrationBuilder.CreateIndex(
                name: "IX_location_parent_location_id",
                table: "location",
                column: "parent_location_id");

            migrationBuilder.CreateIndex(
                name: "IX_location_qr_code",
                table: "location",
                column: "qr_code",
                unique: true,
                filter: "[qr_code] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_location_space_id",
                table: "location",
                column: "space_id");

            migrationBuilder.CreateIndex(
                name: "IX_location_space_id_parent_location_id",
                table: "location",
                columns: new[] { "space_id", "parent_location_id" });

            migrationBuilder.CreateIndex(
                name: "IX_location_image_location_id",
                table: "location_image",
                column: "location_id");

            migrationBuilder.CreateIndex(
                name: "IX_member_space_id_user_id",
                table: "member",
                columns: new[] { "space_id", "user_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_member_user_id",
                table: "member",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_space_owner_user_id",
                table: "space",
                column: "owner_user_id");

            migrationBuilder.CreateIndex(
                name: "IX_tag_space_id_name",
                table: "tag",
                columns: new[] { "space_id", "name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_user_email",
                table: "user",
                column: "email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "activity");

            migrationBuilder.DropTable(
                name: "favorite");

            migrationBuilder.DropTable(
                name: "invitation");

            migrationBuilder.DropTable(
                name: "item_image");

            migrationBuilder.DropTable(
                name: "item_tag");

            migrationBuilder.DropTable(
                name: "location_image");

            migrationBuilder.DropTable(
                name: "member");

            migrationBuilder.DropTable(
                name: "item");

            migrationBuilder.DropTable(
                name: "tag");

            migrationBuilder.DropTable(
                name: "category");

            migrationBuilder.DropTable(
                name: "location");

            migrationBuilder.DropTable(
                name: "space");

            migrationBuilder.DropTable(
                name: "user");
        }
    }
}
