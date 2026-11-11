IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE TABLE [user] (
        [id] bigint NOT NULL IDENTITY,
        [active] bit NOT NULL DEFAULT CAST(1 AS bit),
        [name] varchar(100) NOT NULL,
        [email] varchar(255) NOT NULL,
        [password_hash] varchar(255) NOT NULL,
        [phone] varchar(20) NULL,
        [avatar_url] varchar(1000) NULL,
        [created_at] datetime2 NOT NULL,
        [updated_at] datetime2 NOT NULL,
        CONSTRAINT [PK_user] PRIMARY KEY ([id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE TABLE [space] (
        [id] bigint NOT NULL IDENTITY,
        [owner_user_id] bigint NOT NULL,
        [name] varchar(100) NOT NULL,
        [description] varchar(500) NULL,
        [image_url] varchar(1000) NULL,
        [created_at] datetime2 NOT NULL,
        [updated_at] datetime2 NOT NULL,
        CONSTRAINT [PK_space] PRIMARY KEY ([id]),
        CONSTRAINT [FK_space_user_owner_user_id] FOREIGN KEY ([owner_user_id]) REFERENCES [user] ([id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE TABLE [activity] (
        [id] bigint NOT NULL IDENTITY,
        [space_id] bigint NOT NULL,
        [user_id] bigint NULL,
        [action] varchar(50) NOT NULL,
        [entity_type] varchar(30) NOT NULL,
        [entity_id] bigint NULL,
        [metadata] nvarchar(max) NULL,
        [created_at] datetime2 NOT NULL,
        CONSTRAINT [PK_activity] PRIMARY KEY ([id]),
        CONSTRAINT [FK_activity_space_space_id] FOREIGN KEY ([space_id]) REFERENCES [space] ([id]),
        CONSTRAINT [FK_activity_user_user_id] FOREIGN KEY ([user_id]) REFERENCES [user] ([id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE TABLE [category] (
        [id] bigint NOT NULL IDENTITY,
        [space_id] bigint NULL,
        [name] varchar(50) NOT NULL,
        [icon] varchar(100) NULL,
        [color] varchar(20) NULL,
        [position] int NOT NULL DEFAULT 0,
        [created_at] datetime2 NOT NULL,
        [updated_at] datetime2 NOT NULL,
        CONSTRAINT [PK_category] PRIMARY KEY ([id]),
        CONSTRAINT [FK_category_space_space_id] FOREIGN KEY ([space_id]) REFERENCES [space] ([id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE TABLE [invitation] (
        [id] bigint NOT NULL IDENTITY,
        [space_id] bigint NOT NULL,
        [invited_by_user_id] bigint NOT NULL,
        [email] varchar(255) NULL,
        [token] varchar(255) NOT NULL,
        [role] varchar(20) NOT NULL,
        [status] varchar(20) NOT NULL DEFAULT 'PENDING',
        [expires_at] datetime2 NOT NULL,
        [accepted_at] datetime2 NULL,
        [created_at] datetime2 NOT NULL,
        [updated_at] datetime2 NOT NULL,
        CONSTRAINT [PK_invitation] PRIMARY KEY ([id]),
        CONSTRAINT [FK_invitation_space_space_id] FOREIGN KEY ([space_id]) REFERENCES [space] ([id]),
        CONSTRAINT [FK_invitation_user_invited_by_user_id] FOREIGN KEY ([invited_by_user_id]) REFERENCES [user] ([id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE TABLE [location] (
        [id] bigint NOT NULL IDENTITY,
        [space_id] bigint NOT NULL,
        [parent_location_id] bigint NULL,
        [created_by_user_id] bigint NULL,
        [name] varchar(100) NOT NULL,
        [type] varchar(30) NOT NULL,
        [description] varchar(500) NULL,
        [icon] varchar(100) NULL,
        [color] varchar(20) NULL,
        [position] int NOT NULL DEFAULT 0,
        [qr_code] varchar(255) NULL,
        [created_at] datetime2 NOT NULL,
        [updated_at] datetime2 NOT NULL,
        CONSTRAINT [PK_location] PRIMARY KEY ([id]),
        CONSTRAINT [FK_location_location_parent_location_id] FOREIGN KEY ([parent_location_id]) REFERENCES [location] ([id]),
        CONSTRAINT [FK_location_space_space_id] FOREIGN KEY ([space_id]) REFERENCES [space] ([id]),
        CONSTRAINT [FK_location_user_created_by_user_id] FOREIGN KEY ([created_by_user_id]) REFERENCES [user] ([id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE TABLE [member] (
        [id] bigint NOT NULL IDENTITY,
        [space_id] bigint NOT NULL,
        [user_id] bigint NOT NULL,
        [role] varchar(20) NOT NULL,
        [joined_at] datetime2 NULL,
        [created_at] datetime2 NOT NULL,
        [updated_at] datetime2 NOT NULL,
        CONSTRAINT [PK_member] PRIMARY KEY ([id]),
        CONSTRAINT [FK_member_space_space_id] FOREIGN KEY ([space_id]) REFERENCES [space] ([id]),
        CONSTRAINT [FK_member_user_user_id] FOREIGN KEY ([user_id]) REFERENCES [user] ([id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE TABLE [tag] (
        [id] bigint NOT NULL IDENTITY,
        [space_id] bigint NOT NULL,
        [name] varchar(50) NOT NULL,
        [color] varchar(20) NULL,
        [created_at] datetime2 NOT NULL,
        CONSTRAINT [PK_tag] PRIMARY KEY ([id]),
        CONSTRAINT [FK_tag_space_space_id] FOREIGN KEY ([space_id]) REFERENCES [space] ([id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE TABLE [item] (
        [id] bigint NOT NULL IDENTITY,
        [location_id] bigint NOT NULL,
        [category_id] bigint NULL,
        [created_by_user_id] bigint NULL,
        [name] varchar(150) NOT NULL,
        [description] varchar(1000) NULL,
        [quantity] int NOT NULL DEFAULT 1,
        [notes] varchar(1000) NULL,
        [created_at] datetime2 NOT NULL,
        [updated_at] datetime2 NOT NULL,
        CONSTRAINT [PK_item] PRIMARY KEY ([id]),
        CONSTRAINT [FK_item_category_category_id] FOREIGN KEY ([category_id]) REFERENCES [category] ([id]),
        CONSTRAINT [FK_item_location_location_id] FOREIGN KEY ([location_id]) REFERENCES [location] ([id]),
        CONSTRAINT [FK_item_user_created_by_user_id] FOREIGN KEY ([created_by_user_id]) REFERENCES [user] ([id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE TABLE [location_image] (
        [id] bigint NOT NULL IDENTITY,
        [location_id] bigint NOT NULL,
        [url] varchar(1000) NOT NULL,
        [position] int NOT NULL DEFAULT 0,
        [created_at] datetime2 NOT NULL,
        CONSTRAINT [PK_location_image] PRIMARY KEY ([id]),
        CONSTRAINT [FK_location_image_location_location_id] FOREIGN KEY ([location_id]) REFERENCES [location] ([id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE TABLE [favorite] (
        [user_id] bigint NOT NULL,
        [item_id] bigint NOT NULL,
        [created_at] datetime2 NOT NULL,
        CONSTRAINT [PK_favorite] PRIMARY KEY ([user_id], [item_id]),
        CONSTRAINT [FK_favorite_item_item_id] FOREIGN KEY ([item_id]) REFERENCES [item] ([id]),
        CONSTRAINT [FK_favorite_user_user_id] FOREIGN KEY ([user_id]) REFERENCES [user] ([id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE TABLE [item_image] (
        [id] bigint NOT NULL IDENTITY,
        [item_id] bigint NOT NULL,
        [url] varchar(1000) NOT NULL,
        [position] int NOT NULL DEFAULT 0,
        [created_at] datetime2 NOT NULL,
        CONSTRAINT [PK_item_image] PRIMARY KEY ([id]),
        CONSTRAINT [FK_item_image_item_item_id] FOREIGN KEY ([item_id]) REFERENCES [item] ([id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE TABLE [item_tag] (
        [item_id] bigint NOT NULL,
        [tag_id] bigint NOT NULL,
        [created_at] datetime2 NOT NULL,
        CONSTRAINT [PK_item_tag] PRIMARY KEY ([item_id], [tag_id]),
        CONSTRAINT [FK_item_tag_item_item_id] FOREIGN KEY ([item_id]) REFERENCES [item] ([id]),
        CONSTRAINT [FK_item_tag_tag_tag_id] FOREIGN KEY ([tag_id]) REFERENCES [tag] ([id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_activity_space_id] ON [activity] ([space_id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_activity_space_id_created_at] ON [activity] ([space_id], [created_at]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_activity_user_id] ON [activity] ([user_id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_category_space_id] ON [category] ([space_id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_favorite_item_id] ON [favorite] ([item_id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_invitation_invited_by_user_id] ON [invitation] ([invited_by_user_id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_invitation_space_id_email] ON [invitation] ([space_id], [email]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_invitation_token] ON [invitation] ([token]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_item_category_id] ON [item] ([category_id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_item_created_by_user_id] ON [item] ([created_by_user_id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_item_location_id] ON [item] ([location_id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_item_name] ON [item] ([name]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_item_image_item_id] ON [item_image] ([item_id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_item_tag_tag_id] ON [item_tag] ([tag_id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_location_created_by_user_id] ON [location] ([created_by_user_id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_location_parent_location_id] ON [location] ([parent_location_id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [IX_location_qr_code] ON [location] ([qr_code]) WHERE [qr_code] IS NOT NULL');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_location_space_id] ON [location] ([space_id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_location_space_id_parent_location_id] ON [location] ([space_id], [parent_location_id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_location_image_location_id] ON [location_image] ([location_id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_member_space_id_user_id] ON [member] ([space_id], [user_id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_member_user_id] ON [member] ([user_id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_space_owner_user_id] ON [space] ([owner_user_id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_tag_space_id_name] ON [tag] ([space_id], [name]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_user_email] ON [user] ([email]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103195144_InitialCreate'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20261103195144_InitialCreate', N'9.0.20');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [activity] DROP CONSTRAINT [FK_activity_space_space_id];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [activity] DROP CONSTRAINT [FK_activity_user_user_id];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [category] DROP CONSTRAINT [FK_category_space_space_id];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [favorite] DROP CONSTRAINT [FK_favorite_item_item_id];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [favorite] DROP CONSTRAINT [FK_favorite_user_user_id];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [invitation] DROP CONSTRAINT [FK_invitation_space_space_id];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [invitation] DROP CONSTRAINT [FK_invitation_user_invited_by_user_id];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [item] DROP CONSTRAINT [FK_item_category_category_id];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [item] DROP CONSTRAINT [FK_item_location_location_id];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [item] DROP CONSTRAINT [FK_item_user_created_by_user_id];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [item_image] DROP CONSTRAINT [FK_item_image_item_item_id];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [item_tag] DROP CONSTRAINT [FK_item_tag_item_item_id];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [item_tag] DROP CONSTRAINT [FK_item_tag_tag_tag_id];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [location] DROP CONSTRAINT [FK_location_location_parent_location_id];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [location] DROP CONSTRAINT [FK_location_space_space_id];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [location] DROP CONSTRAINT [FK_location_user_created_by_user_id];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [location_image] DROP CONSTRAINT [FK_location_image_location_location_id];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [member] DROP CONSTRAINT [FK_member_space_space_id];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [member] DROP CONSTRAINT [FK_member_user_user_id];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [space] DROP CONSTRAINT [FK_space_user_owner_user_id];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tag] DROP CONSTRAINT [FK_tag_space_space_id];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [user] DROP CONSTRAINT [PK_user];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tag] DROP CONSTRAINT [PK_tag];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [space] DROP CONSTRAINT [PK_space];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [member] DROP CONSTRAINT [PK_member];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [location_image] DROP CONSTRAINT [PK_location_image];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [location] DROP CONSTRAINT [PK_location];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [item_tag] DROP CONSTRAINT [PK_item_tag];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [item_image] DROP CONSTRAINT [PK_item_image];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [item] DROP CONSTRAINT [PK_item];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [invitation] DROP CONSTRAINT [PK_invitation];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [favorite] DROP CONSTRAINT [PK_favorite];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [category] DROP CONSTRAINT [PK_category];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [activity] DROP CONSTRAINT [PK_activity];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[user]', N'tbl_user', 'OBJECT';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[tag]', N'tbl_tag', 'OBJECT';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[space]', N'tbl_space', 'OBJECT';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[member]', N'tbl_member', 'OBJECT';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[location_image]', N'tbl_location_image', 'OBJECT';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[location]', N'tbl_location', 'OBJECT';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[item_tag]', N'tbl_item_tag', 'OBJECT';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[item_image]', N'tbl_item_image', 'OBJECT';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[item]', N'tbl_item', 'OBJECT';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[invitation]', N'tbl_invitation', 'OBJECT';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[favorite]', N'tbl_favorite', 'OBJECT';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[category]', N'tbl_category', 'OBJECT';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[activity]', N'tbl_activity', 'OBJECT';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[tbl_user].[IX_user_email]', N'IX_tbl_user_email', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[tbl_tag].[IX_tag_space_id_name]', N'IX_tbl_tag_space_id_name', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[tbl_space].[IX_space_owner_user_id]', N'IX_tbl_space_owner_user_id', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[tbl_member].[IX_member_user_id]', N'IX_tbl_member_user_id', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[tbl_member].[IX_member_space_id_user_id]', N'IX_tbl_member_space_id_user_id', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[tbl_location_image].[IX_location_image_location_id]', N'IX_tbl_location_image_location_id', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[tbl_location].[IX_location_space_id_parent_location_id]', N'IX_tbl_location_space_id_parent_location_id', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[tbl_location].[IX_location_space_id]', N'IX_tbl_location_space_id', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[tbl_location].[IX_location_qr_code]', N'IX_tbl_location_qr_code', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[tbl_location].[IX_location_parent_location_id]', N'IX_tbl_location_parent_location_id', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[tbl_location].[IX_location_created_by_user_id]', N'IX_tbl_location_created_by_user_id', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[tbl_item_tag].[IX_item_tag_tag_id]', N'IX_tbl_item_tag_tag_id', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[tbl_item_image].[IX_item_image_item_id]', N'IX_tbl_item_image_item_id', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[tbl_item].[IX_item_name]', N'IX_tbl_item_name', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[tbl_item].[IX_item_location_id]', N'IX_tbl_item_location_id', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[tbl_item].[IX_item_created_by_user_id]', N'IX_tbl_item_created_by_user_id', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[tbl_item].[IX_item_category_id]', N'IX_tbl_item_category_id', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[tbl_invitation].[IX_invitation_token]', N'IX_tbl_invitation_token', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[tbl_invitation].[IX_invitation_space_id_email]', N'IX_tbl_invitation_space_id_email', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[tbl_invitation].[IX_invitation_invited_by_user_id]', N'IX_tbl_invitation_invited_by_user_id', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[tbl_favorite].[IX_favorite_item_id]', N'IX_tbl_favorite_item_id', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[tbl_category].[IX_category_space_id]', N'IX_tbl_category_space_id', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[tbl_activity].[IX_activity_user_id]', N'IX_tbl_activity_user_id', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[tbl_activity].[IX_activity_space_id_created_at]', N'IX_tbl_activity_space_id_created_at', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    EXEC sp_rename N'[tbl_activity].[IX_activity_space_id]', N'IX_tbl_activity_space_id', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_user] ADD CONSTRAINT [PK_tbl_user] PRIMARY KEY ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_tag] ADD CONSTRAINT [PK_tbl_tag] PRIMARY KEY ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_space] ADD CONSTRAINT [PK_tbl_space] PRIMARY KEY ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_member] ADD CONSTRAINT [PK_tbl_member] PRIMARY KEY ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_location_image] ADD CONSTRAINT [PK_tbl_location_image] PRIMARY KEY ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_location] ADD CONSTRAINT [PK_tbl_location] PRIMARY KEY ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_item_tag] ADD CONSTRAINT [PK_tbl_item_tag] PRIMARY KEY ([item_id], [tag_id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_item_image] ADD CONSTRAINT [PK_tbl_item_image] PRIMARY KEY ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_item] ADD CONSTRAINT [PK_tbl_item] PRIMARY KEY ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_invitation] ADD CONSTRAINT [PK_tbl_invitation] PRIMARY KEY ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_favorite] ADD CONSTRAINT [PK_tbl_favorite] PRIMARY KEY ([user_id], [item_id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_category] ADD CONSTRAINT [PK_tbl_category] PRIMARY KEY ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_activity] ADD CONSTRAINT [PK_tbl_activity] PRIMARY KEY ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_activity] ADD CONSTRAINT [FK_tbl_activity_tbl_space_space_id] FOREIGN KEY ([space_id]) REFERENCES [tbl_space] ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_activity] ADD CONSTRAINT [FK_tbl_activity_tbl_user_user_id] FOREIGN KEY ([user_id]) REFERENCES [tbl_user] ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_category] ADD CONSTRAINT [FK_tbl_category_tbl_space_space_id] FOREIGN KEY ([space_id]) REFERENCES [tbl_space] ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_favorite] ADD CONSTRAINT [FK_tbl_favorite_tbl_item_item_id] FOREIGN KEY ([item_id]) REFERENCES [tbl_item] ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_favorite] ADD CONSTRAINT [FK_tbl_favorite_tbl_user_user_id] FOREIGN KEY ([user_id]) REFERENCES [tbl_user] ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_invitation] ADD CONSTRAINT [FK_tbl_invitation_tbl_space_space_id] FOREIGN KEY ([space_id]) REFERENCES [tbl_space] ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_invitation] ADD CONSTRAINT [FK_tbl_invitation_tbl_user_invited_by_user_id] FOREIGN KEY ([invited_by_user_id]) REFERENCES [tbl_user] ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_item] ADD CONSTRAINT [FK_tbl_item_tbl_category_category_id] FOREIGN KEY ([category_id]) REFERENCES [tbl_category] ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_item] ADD CONSTRAINT [FK_tbl_item_tbl_location_location_id] FOREIGN KEY ([location_id]) REFERENCES [tbl_location] ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_item] ADD CONSTRAINT [FK_tbl_item_tbl_user_created_by_user_id] FOREIGN KEY ([created_by_user_id]) REFERENCES [tbl_user] ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_item_image] ADD CONSTRAINT [FK_tbl_item_image_tbl_item_item_id] FOREIGN KEY ([item_id]) REFERENCES [tbl_item] ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_item_tag] ADD CONSTRAINT [FK_tbl_item_tag_tbl_item_item_id] FOREIGN KEY ([item_id]) REFERENCES [tbl_item] ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_item_tag] ADD CONSTRAINT [FK_tbl_item_tag_tbl_tag_tag_id] FOREIGN KEY ([tag_id]) REFERENCES [tbl_tag] ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_location] ADD CONSTRAINT [FK_tbl_location_tbl_location_parent_location_id] FOREIGN KEY ([parent_location_id]) REFERENCES [tbl_location] ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_location] ADD CONSTRAINT [FK_tbl_location_tbl_space_space_id] FOREIGN KEY ([space_id]) REFERENCES [tbl_space] ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_location] ADD CONSTRAINT [FK_tbl_location_tbl_user_created_by_user_id] FOREIGN KEY ([created_by_user_id]) REFERENCES [tbl_user] ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_location_image] ADD CONSTRAINT [FK_tbl_location_image_tbl_location_location_id] FOREIGN KEY ([location_id]) REFERENCES [tbl_location] ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_member] ADD CONSTRAINT [FK_tbl_member_tbl_space_space_id] FOREIGN KEY ([space_id]) REFERENCES [tbl_space] ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_member] ADD CONSTRAINT [FK_tbl_member_tbl_user_user_id] FOREIGN KEY ([user_id]) REFERENCES [tbl_user] ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_space] ADD CONSTRAINT [FK_tbl_space_tbl_user_owner_user_id] FOREIGN KEY ([owner_user_id]) REFERENCES [tbl_user] ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    ALTER TABLE [tbl_tag] ADD CONSTRAINT [FK_tbl_tag_tbl_space_space_id] FOREIGN KEY ([space_id]) REFERENCES [tbl_space] ([id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103203024_AddTablePrefix'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20261103203024_AddTablePrefix', N'9.0.20');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111172501_UpdateActivityDeleteBehavior'
)
BEGIN
    ALTER TABLE [tbl_activity] DROP CONSTRAINT [FK_tbl_activity_tbl_space_space_id];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111172501_UpdateActivityDeleteBehavior'
)
BEGIN
    ALTER TABLE [tbl_activity] DROP CONSTRAINT [FK_tbl_activity_tbl_user_user_id];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111172501_UpdateActivityDeleteBehavior'
)
BEGIN
    ALTER TABLE [tbl_activity] ADD CONSTRAINT [FK_tbl_activity_tbl_space_space_id] FOREIGN KEY ([space_id]) REFERENCES [tbl_space] ([id]) ON DELETE CASCADE;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111172501_UpdateActivityDeleteBehavior'
)
BEGIN
    ALTER TABLE [tbl_activity] ADD CONSTRAINT [FK_tbl_activity_tbl_user_user_id] FOREIGN KEY ([user_id]) REFERENCES [tbl_user] ([id]) ON DELETE SET NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111172501_UpdateActivityDeleteBehavior'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20261111172501_UpdateActivityDeleteBehavior', N'9.0.20');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111183511_AddSystemLogs'
)
BEGIN
    CREATE TABLE [tbl_system_log] (
        [id] bigint NOT NULL IDENTITY,
        [level] varchar(20) NOT NULL,
        [category] nvarchar(256) NOT NULL,
        [event_id] int NOT NULL,
        [message] nvarchar(4000) NOT NULL,
        [exception] nvarchar(max) NULL,
        [trace_id] varchar(32) NULL,
        [created_at] datetime2 NOT NULL,
        CONSTRAINT [PK_tbl_system_log] PRIMARY KEY ([id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111183511_AddSystemLogs'
)
BEGIN
    CREATE INDEX [IX_tbl_system_log_created_at] ON [tbl_system_log] ([created_at]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111183511_AddSystemLogs'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20261111183511_AddSystemLogs', N'9.0.20');
END;

COMMIT;
GO

