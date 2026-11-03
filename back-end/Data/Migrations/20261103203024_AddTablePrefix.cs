using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTablePrefix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_activity_space_space_id",
                table: "activity");

            migrationBuilder.DropForeignKey(
                name: "FK_activity_user_user_id",
                table: "activity");

            migrationBuilder.DropForeignKey(
                name: "FK_category_space_space_id",
                table: "category");

            migrationBuilder.DropForeignKey(
                name: "FK_favorite_item_item_id",
                table: "favorite");

            migrationBuilder.DropForeignKey(
                name: "FK_favorite_user_user_id",
                table: "favorite");

            migrationBuilder.DropForeignKey(
                name: "FK_invitation_space_space_id",
                table: "invitation");

            migrationBuilder.DropForeignKey(
                name: "FK_invitation_user_invited_by_user_id",
                table: "invitation");

            migrationBuilder.DropForeignKey(
                name: "FK_item_category_category_id",
                table: "item");

            migrationBuilder.DropForeignKey(
                name: "FK_item_location_location_id",
                table: "item");

            migrationBuilder.DropForeignKey(
                name: "FK_item_user_created_by_user_id",
                table: "item");

            migrationBuilder.DropForeignKey(
                name: "FK_item_image_item_item_id",
                table: "item_image");

            migrationBuilder.DropForeignKey(
                name: "FK_item_tag_item_item_id",
                table: "item_tag");

            migrationBuilder.DropForeignKey(
                name: "FK_item_tag_tag_tag_id",
                table: "item_tag");

            migrationBuilder.DropForeignKey(
                name: "FK_location_location_parent_location_id",
                table: "location");

            migrationBuilder.DropForeignKey(
                name: "FK_location_space_space_id",
                table: "location");

            migrationBuilder.DropForeignKey(
                name: "FK_location_user_created_by_user_id",
                table: "location");

            migrationBuilder.DropForeignKey(
                name: "FK_location_image_location_location_id",
                table: "location_image");

            migrationBuilder.DropForeignKey(
                name: "FK_member_space_space_id",
                table: "member");

            migrationBuilder.DropForeignKey(
                name: "FK_member_user_user_id",
                table: "member");

            migrationBuilder.DropForeignKey(
                name: "FK_space_user_owner_user_id",
                table: "space");

            migrationBuilder.DropForeignKey(
                name: "FK_tag_space_space_id",
                table: "tag");

            migrationBuilder.DropPrimaryKey(
                name: "PK_user",
                table: "user");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tag",
                table: "tag");

            migrationBuilder.DropPrimaryKey(
                name: "PK_space",
                table: "space");

            migrationBuilder.DropPrimaryKey(
                name: "PK_member",
                table: "member");

            migrationBuilder.DropPrimaryKey(
                name: "PK_location_image",
                table: "location_image");

            migrationBuilder.DropPrimaryKey(
                name: "PK_location",
                table: "location");

            migrationBuilder.DropPrimaryKey(
                name: "PK_item_tag",
                table: "item_tag");

            migrationBuilder.DropPrimaryKey(
                name: "PK_item_image",
                table: "item_image");

            migrationBuilder.DropPrimaryKey(
                name: "PK_item",
                table: "item");

            migrationBuilder.DropPrimaryKey(
                name: "PK_invitation",
                table: "invitation");

            migrationBuilder.DropPrimaryKey(
                name: "PK_favorite",
                table: "favorite");

            migrationBuilder.DropPrimaryKey(
                name: "PK_category",
                table: "category");

            migrationBuilder.DropPrimaryKey(
                name: "PK_activity",
                table: "activity");

            migrationBuilder.RenameTable(
                name: "user",
                newName: "tbl_user");

            migrationBuilder.RenameTable(
                name: "tag",
                newName: "tbl_tag");

            migrationBuilder.RenameTable(
                name: "space",
                newName: "tbl_space");

            migrationBuilder.RenameTable(
                name: "member",
                newName: "tbl_member");

            migrationBuilder.RenameTable(
                name: "location_image",
                newName: "tbl_location_image");

            migrationBuilder.RenameTable(
                name: "location",
                newName: "tbl_location");

            migrationBuilder.RenameTable(
                name: "item_tag",
                newName: "tbl_item_tag");

            migrationBuilder.RenameTable(
                name: "item_image",
                newName: "tbl_item_image");

            migrationBuilder.RenameTable(
                name: "item",
                newName: "tbl_item");

            migrationBuilder.RenameTable(
                name: "invitation",
                newName: "tbl_invitation");

            migrationBuilder.RenameTable(
                name: "favorite",
                newName: "tbl_favorite");

            migrationBuilder.RenameTable(
                name: "category",
                newName: "tbl_category");

            migrationBuilder.RenameTable(
                name: "activity",
                newName: "tbl_activity");

            migrationBuilder.RenameIndex(
                name: "IX_user_email",
                table: "tbl_user",
                newName: "IX_tbl_user_email");

            migrationBuilder.RenameIndex(
                name: "IX_tag_space_id_name",
                table: "tbl_tag",
                newName: "IX_tbl_tag_space_id_name");

            migrationBuilder.RenameIndex(
                name: "IX_space_owner_user_id",
                table: "tbl_space",
                newName: "IX_tbl_space_owner_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_member_user_id",
                table: "tbl_member",
                newName: "IX_tbl_member_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_member_space_id_user_id",
                table: "tbl_member",
                newName: "IX_tbl_member_space_id_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_location_image_location_id",
                table: "tbl_location_image",
                newName: "IX_tbl_location_image_location_id");

            migrationBuilder.RenameIndex(
                name: "IX_location_space_id_parent_location_id",
                table: "tbl_location",
                newName: "IX_tbl_location_space_id_parent_location_id");

            migrationBuilder.RenameIndex(
                name: "IX_location_space_id",
                table: "tbl_location",
                newName: "IX_tbl_location_space_id");

            migrationBuilder.RenameIndex(
                name: "IX_location_qr_code",
                table: "tbl_location",
                newName: "IX_tbl_location_qr_code");

            migrationBuilder.RenameIndex(
                name: "IX_location_parent_location_id",
                table: "tbl_location",
                newName: "IX_tbl_location_parent_location_id");

            migrationBuilder.RenameIndex(
                name: "IX_location_created_by_user_id",
                table: "tbl_location",
                newName: "IX_tbl_location_created_by_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_item_tag_tag_id",
                table: "tbl_item_tag",
                newName: "IX_tbl_item_tag_tag_id");

            migrationBuilder.RenameIndex(
                name: "IX_item_image_item_id",
                table: "tbl_item_image",
                newName: "IX_tbl_item_image_item_id");

            migrationBuilder.RenameIndex(
                name: "IX_item_name",
                table: "tbl_item",
                newName: "IX_tbl_item_name");

            migrationBuilder.RenameIndex(
                name: "IX_item_location_id",
                table: "tbl_item",
                newName: "IX_tbl_item_location_id");

            migrationBuilder.RenameIndex(
                name: "IX_item_created_by_user_id",
                table: "tbl_item",
                newName: "IX_tbl_item_created_by_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_item_category_id",
                table: "tbl_item",
                newName: "IX_tbl_item_category_id");

            migrationBuilder.RenameIndex(
                name: "IX_invitation_token",
                table: "tbl_invitation",
                newName: "IX_tbl_invitation_token");

            migrationBuilder.RenameIndex(
                name: "IX_invitation_space_id_email",
                table: "tbl_invitation",
                newName: "IX_tbl_invitation_space_id_email");

            migrationBuilder.RenameIndex(
                name: "IX_invitation_invited_by_user_id",
                table: "tbl_invitation",
                newName: "IX_tbl_invitation_invited_by_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_favorite_item_id",
                table: "tbl_favorite",
                newName: "IX_tbl_favorite_item_id");

            migrationBuilder.RenameIndex(
                name: "IX_category_space_id",
                table: "tbl_category",
                newName: "IX_tbl_category_space_id");

            migrationBuilder.RenameIndex(
                name: "IX_activity_user_id",
                table: "tbl_activity",
                newName: "IX_tbl_activity_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_activity_space_id_created_at",
                table: "tbl_activity",
                newName: "IX_tbl_activity_space_id_created_at");

            migrationBuilder.RenameIndex(
                name: "IX_activity_space_id",
                table: "tbl_activity",
                newName: "IX_tbl_activity_space_id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tbl_user",
                table: "tbl_user",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tbl_tag",
                table: "tbl_tag",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tbl_space",
                table: "tbl_space",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tbl_member",
                table: "tbl_member",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tbl_location_image",
                table: "tbl_location_image",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tbl_location",
                table: "tbl_location",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tbl_item_tag",
                table: "tbl_item_tag",
                columns: new[] { "item_id", "tag_id" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_tbl_item_image",
                table: "tbl_item_image",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tbl_item",
                table: "tbl_item",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tbl_invitation",
                table: "tbl_invitation",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tbl_favorite",
                table: "tbl_favorite",
                columns: new[] { "user_id", "item_id" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_tbl_category",
                table: "tbl_category",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tbl_activity",
                table: "tbl_activity",
                column: "id");

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

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_category_tbl_space_space_id",
                table: "tbl_category",
                column: "space_id",
                principalTable: "tbl_space",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_favorite_tbl_item_item_id",
                table: "tbl_favorite",
                column: "item_id",
                principalTable: "tbl_item",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_favorite_tbl_user_user_id",
                table: "tbl_favorite",
                column: "user_id",
                principalTable: "tbl_user",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_invitation_tbl_space_space_id",
                table: "tbl_invitation",
                column: "space_id",
                principalTable: "tbl_space",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_invitation_tbl_user_invited_by_user_id",
                table: "tbl_invitation",
                column: "invited_by_user_id",
                principalTable: "tbl_user",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_item_tbl_category_category_id",
                table: "tbl_item",
                column: "category_id",
                principalTable: "tbl_category",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_item_tbl_location_location_id",
                table: "tbl_item",
                column: "location_id",
                principalTable: "tbl_location",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_item_tbl_user_created_by_user_id",
                table: "tbl_item",
                column: "created_by_user_id",
                principalTable: "tbl_user",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_item_image_tbl_item_item_id",
                table: "tbl_item_image",
                column: "item_id",
                principalTable: "tbl_item",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_item_tag_tbl_item_item_id",
                table: "tbl_item_tag",
                column: "item_id",
                principalTable: "tbl_item",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_item_tag_tbl_tag_tag_id",
                table: "tbl_item_tag",
                column: "tag_id",
                principalTable: "tbl_tag",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_location_tbl_location_parent_location_id",
                table: "tbl_location",
                column: "parent_location_id",
                principalTable: "tbl_location",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_location_tbl_space_space_id",
                table: "tbl_location",
                column: "space_id",
                principalTable: "tbl_space",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_location_tbl_user_created_by_user_id",
                table: "tbl_location",
                column: "created_by_user_id",
                principalTable: "tbl_user",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_location_image_tbl_location_location_id",
                table: "tbl_location_image",
                column: "location_id",
                principalTable: "tbl_location",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_member_tbl_space_space_id",
                table: "tbl_member",
                column: "space_id",
                principalTable: "tbl_space",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_member_tbl_user_user_id",
                table: "tbl_member",
                column: "user_id",
                principalTable: "tbl_user",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_space_tbl_user_owner_user_id",
                table: "tbl_space",
                column: "owner_user_id",
                principalTable: "tbl_user",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_tag_tbl_space_space_id",
                table: "tbl_tag",
                column: "space_id",
                principalTable: "tbl_space",
                principalColumn: "id");
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

            migrationBuilder.DropForeignKey(
                name: "FK_tbl_category_tbl_space_space_id",
                table: "tbl_category");

            migrationBuilder.DropForeignKey(
                name: "FK_tbl_favorite_tbl_item_item_id",
                table: "tbl_favorite");

            migrationBuilder.DropForeignKey(
                name: "FK_tbl_favorite_tbl_user_user_id",
                table: "tbl_favorite");

            migrationBuilder.DropForeignKey(
                name: "FK_tbl_invitation_tbl_space_space_id",
                table: "tbl_invitation");

            migrationBuilder.DropForeignKey(
                name: "FK_tbl_invitation_tbl_user_invited_by_user_id",
                table: "tbl_invitation");

            migrationBuilder.DropForeignKey(
                name: "FK_tbl_item_tbl_category_category_id",
                table: "tbl_item");

            migrationBuilder.DropForeignKey(
                name: "FK_tbl_item_tbl_location_location_id",
                table: "tbl_item");

            migrationBuilder.DropForeignKey(
                name: "FK_tbl_item_tbl_user_created_by_user_id",
                table: "tbl_item");

            migrationBuilder.DropForeignKey(
                name: "FK_tbl_item_image_tbl_item_item_id",
                table: "tbl_item_image");

            migrationBuilder.DropForeignKey(
                name: "FK_tbl_item_tag_tbl_item_item_id",
                table: "tbl_item_tag");

            migrationBuilder.DropForeignKey(
                name: "FK_tbl_item_tag_tbl_tag_tag_id",
                table: "tbl_item_tag");

            migrationBuilder.DropForeignKey(
                name: "FK_tbl_location_tbl_location_parent_location_id",
                table: "tbl_location");

            migrationBuilder.DropForeignKey(
                name: "FK_tbl_location_tbl_space_space_id",
                table: "tbl_location");

            migrationBuilder.DropForeignKey(
                name: "FK_tbl_location_tbl_user_created_by_user_id",
                table: "tbl_location");

            migrationBuilder.DropForeignKey(
                name: "FK_tbl_location_image_tbl_location_location_id",
                table: "tbl_location_image");

            migrationBuilder.DropForeignKey(
                name: "FK_tbl_member_tbl_space_space_id",
                table: "tbl_member");

            migrationBuilder.DropForeignKey(
                name: "FK_tbl_member_tbl_user_user_id",
                table: "tbl_member");

            migrationBuilder.DropForeignKey(
                name: "FK_tbl_space_tbl_user_owner_user_id",
                table: "tbl_space");

            migrationBuilder.DropForeignKey(
                name: "FK_tbl_tag_tbl_space_space_id",
                table: "tbl_tag");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tbl_user",
                table: "tbl_user");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tbl_tag",
                table: "tbl_tag");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tbl_space",
                table: "tbl_space");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tbl_member",
                table: "tbl_member");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tbl_location_image",
                table: "tbl_location_image");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tbl_location",
                table: "tbl_location");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tbl_item_tag",
                table: "tbl_item_tag");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tbl_item_image",
                table: "tbl_item_image");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tbl_item",
                table: "tbl_item");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tbl_invitation",
                table: "tbl_invitation");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tbl_favorite",
                table: "tbl_favorite");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tbl_category",
                table: "tbl_category");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tbl_activity",
                table: "tbl_activity");

            migrationBuilder.RenameTable(
                name: "tbl_user",
                newName: "user");

            migrationBuilder.RenameTable(
                name: "tbl_tag",
                newName: "tag");

            migrationBuilder.RenameTable(
                name: "tbl_space",
                newName: "space");

            migrationBuilder.RenameTable(
                name: "tbl_member",
                newName: "member");

            migrationBuilder.RenameTable(
                name: "tbl_location_image",
                newName: "location_image");

            migrationBuilder.RenameTable(
                name: "tbl_location",
                newName: "location");

            migrationBuilder.RenameTable(
                name: "tbl_item_tag",
                newName: "item_tag");

            migrationBuilder.RenameTable(
                name: "tbl_item_image",
                newName: "item_image");

            migrationBuilder.RenameTable(
                name: "tbl_item",
                newName: "item");

            migrationBuilder.RenameTable(
                name: "tbl_invitation",
                newName: "invitation");

            migrationBuilder.RenameTable(
                name: "tbl_favorite",
                newName: "favorite");

            migrationBuilder.RenameTable(
                name: "tbl_category",
                newName: "category");

            migrationBuilder.RenameTable(
                name: "tbl_activity",
                newName: "activity");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_user_email",
                table: "user",
                newName: "IX_user_email");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_tag_space_id_name",
                table: "tag",
                newName: "IX_tag_space_id_name");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_space_owner_user_id",
                table: "space",
                newName: "IX_space_owner_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_member_user_id",
                table: "member",
                newName: "IX_member_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_member_space_id_user_id",
                table: "member",
                newName: "IX_member_space_id_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_location_image_location_id",
                table: "location_image",
                newName: "IX_location_image_location_id");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_location_space_id_parent_location_id",
                table: "location",
                newName: "IX_location_space_id_parent_location_id");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_location_space_id",
                table: "location",
                newName: "IX_location_space_id");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_location_qr_code",
                table: "location",
                newName: "IX_location_qr_code");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_location_parent_location_id",
                table: "location",
                newName: "IX_location_parent_location_id");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_location_created_by_user_id",
                table: "location",
                newName: "IX_location_created_by_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_item_tag_tag_id",
                table: "item_tag",
                newName: "IX_item_tag_tag_id");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_item_image_item_id",
                table: "item_image",
                newName: "IX_item_image_item_id");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_item_name",
                table: "item",
                newName: "IX_item_name");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_item_location_id",
                table: "item",
                newName: "IX_item_location_id");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_item_created_by_user_id",
                table: "item",
                newName: "IX_item_created_by_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_item_category_id",
                table: "item",
                newName: "IX_item_category_id");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_invitation_token",
                table: "invitation",
                newName: "IX_invitation_token");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_invitation_space_id_email",
                table: "invitation",
                newName: "IX_invitation_space_id_email");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_invitation_invited_by_user_id",
                table: "invitation",
                newName: "IX_invitation_invited_by_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_favorite_item_id",
                table: "favorite",
                newName: "IX_favorite_item_id");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_category_space_id",
                table: "category",
                newName: "IX_category_space_id");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_activity_user_id",
                table: "activity",
                newName: "IX_activity_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_activity_space_id_created_at",
                table: "activity",
                newName: "IX_activity_space_id_created_at");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_activity_space_id",
                table: "activity",
                newName: "IX_activity_space_id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_user",
                table: "user",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tag",
                table: "tag",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_space",
                table: "space",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_member",
                table: "member",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_location_image",
                table: "location_image",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_location",
                table: "location",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_item_tag",
                table: "item_tag",
                columns: new[] { "item_id", "tag_id" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_item_image",
                table: "item_image",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_item",
                table: "item",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_invitation",
                table: "invitation",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_favorite",
                table: "favorite",
                columns: new[] { "user_id", "item_id" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_category",
                table: "category",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_activity",
                table: "activity",
                column: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_activity_space_space_id",
                table: "activity",
                column: "space_id",
                principalTable: "space",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_activity_user_user_id",
                table: "activity",
                column: "user_id",
                principalTable: "user",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_category_space_space_id",
                table: "category",
                column: "space_id",
                principalTable: "space",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_favorite_item_item_id",
                table: "favorite",
                column: "item_id",
                principalTable: "item",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_favorite_user_user_id",
                table: "favorite",
                column: "user_id",
                principalTable: "user",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_invitation_space_space_id",
                table: "invitation",
                column: "space_id",
                principalTable: "space",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_invitation_user_invited_by_user_id",
                table: "invitation",
                column: "invited_by_user_id",
                principalTable: "user",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_item_category_category_id",
                table: "item",
                column: "category_id",
                principalTable: "category",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_item_location_location_id",
                table: "item",
                column: "location_id",
                principalTable: "location",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_item_user_created_by_user_id",
                table: "item",
                column: "created_by_user_id",
                principalTable: "user",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_item_image_item_item_id",
                table: "item_image",
                column: "item_id",
                principalTable: "item",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_item_tag_item_item_id",
                table: "item_tag",
                column: "item_id",
                principalTable: "item",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_item_tag_tag_tag_id",
                table: "item_tag",
                column: "tag_id",
                principalTable: "tag",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_location_location_parent_location_id",
                table: "location",
                column: "parent_location_id",
                principalTable: "location",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_location_space_space_id",
                table: "location",
                column: "space_id",
                principalTable: "space",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_location_user_created_by_user_id",
                table: "location",
                column: "created_by_user_id",
                principalTable: "user",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_location_image_location_location_id",
                table: "location_image",
                column: "location_id",
                principalTable: "location",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_member_space_space_id",
                table: "member",
                column: "space_id",
                principalTable: "space",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_member_user_user_id",
                table: "member",
                column: "user_id",
                principalTable: "user",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_space_user_owner_user_id",
                table: "space",
                column: "owner_user_id",
                principalTable: "user",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_tag_space_space_id",
                table: "tag",
                column: "space_id",
                principalTable: "space",
                principalColumn: "id");
        }
    }
}
