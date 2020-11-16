# Migration `20201116024624-initial`

This migration has been generated by Tuvshinbayar Tuvhshinzul at 11/16/2020, 10:46:24 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE `SystemUser` (
`id` varchar(191)  NOT NULL ,
`username` varchar(191)  NOT NULL ,
`email` varchar(191)  NOT NULL ,
`password` varchar(191)  NOT NULL ,
`role` ENUM('SUPER_ADMIN', 'ADMIN', 'DEVELOPER')  NOT NULL DEFAULT 'DEVELOPER',
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL ,
UNIQUE INDEX `SystemUser.username_unique`(`username`),
UNIQUE INDEX `SystemUser.email_unique`(`email`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `Organization` (
`id` varchar(191)  NOT NULL ,
`name` varchar(191)  NOT NULL ,
`url` varchar(191)  ,
`address` varchar(191)  ,
`phoneNumber` varchar(191)  ,
`systemUserId` varchar(191)  ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `UserPool` (
`id` varchar(191)  NOT NULL ,
`name` varchar(191)  NOT NULL ,
`identifier` varchar(191)  NOT NULL ,
`organizationId` varchar(191)  NOT NULL ,
UNIQUE INDEX `UserPool.identifier_unique`(`identifier`),
UNIQUE INDEX `UserPool.name_organizationId_unique`(`name`,
`organizationId`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `Role` (
`id` varchar(191)  NOT NULL ,
`name` varchar(191)  NOT NULL ,
`description` varchar(191)  ,
`userPoolId` varchar(191)  NOT NULL ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL ,
UNIQUE INDEX `Role.name_userPoolId_unique`(`name`,
`userPoolId`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `oAuthClient` (
`id` varchar(191)  NOT NULL ,
`name` varchar(191)  NOT NULL ,
`secret` varchar(191)  NOT NULL ,
`userPoolId` varchar(191)  NOT NULL ,
`refreshTokenLifetime` int  NOT NULL DEFAULT 43200,
`accessTokenLifetime` int  NOT NULL DEFAULT 60,
`idTokenLifetime` int  NOT NULL DEFAULT 5,
`logo` varchar(191)  ,
`trustedClient` boolean  NOT NULL DEFAULT false,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL ,
UNIQUE INDEX `oAuthClient.name_userPoolId_unique`(`name`,
`userPoolId`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `oAuthScope` (
`id` varchar(191)  NOT NULL ,
`name` varchar(191)  NOT NULL ,
`description` varchar(191)  ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL ,
UNIQUE INDEX `oAuthScope.name_unique`(`name`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `oAuthGrant` (
`id` varchar(191)  NOT NULL ,
`grantType` ENUM('AUTHORIZATION_CODE', 'PASSWORD', 'REFRESH_TOKEN', 'CLIENT_CREDENTIALS', 'EXTENSION')  NOT NULL ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `oAuthRedirectURI` (
`id` varchar(191)  NOT NULL ,
`oAuthClientId` varchar(191)  NOT NULL ,
`url` varchar(191)  NOT NULL ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `oAuthJavascriptOrigin` (
`id` varchar(191)  NOT NULL ,
`oAuthClientId` varchar(191)  NOT NULL ,
`uri` varchar(191)  NOT NULL ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `oAuthResourceServer` (
`id` varchar(191)  NOT NULL ,
`name` varchar(191)  NOT NULL ,
`identifier` varchar(191)  NOT NULL ,
`userPoolId` varchar(191)  NOT NULL ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL ,
UNIQUE INDEX `oAuthResourceServer.name_userPoolId_unique`(`name`,
`userPoolId`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `oAuthCustomScope` (
`id` varchar(191)  NOT NULL ,
`name` varchar(191)  NOT NULL ,
`description` varchar(191)  ,
`oAuthResourceServerId` varchar(191)  NOT NULL ,
`userPoolId` varchar(191)  NOT NULL ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `oAuthAccessToken` (
`id` varchar(191)  NOT NULL ,
`accessToken` varchar(191)  NOT NULL ,
`expirationDate` datetime(3)  NOT NULL ,
`userId` varchar(191)  ,
`oAuthClientId` varchar(191)  NOT NULL ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL ,
UNIQUE INDEX `oAuthAccessToken.accessToken_unique`(`accessToken`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `oAuthRefreshToken` (
`id` varchar(191)  NOT NULL ,
`refreshToken` varchar(191)  NOT NULL ,
`expirationDate` datetime(3)  NOT NULL ,
`userId` varchar(191)  ,
`oAuthClientId` varchar(191)  NOT NULL ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL ,
UNIQUE INDEX `oAuthRefreshToken.refreshToken_unique`(`refreshToken`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `oAuthAuthorizationCode` (
`id` varchar(191)  NOT NULL ,
`code` varchar(191)  NOT NULL ,
`expirationDate` datetime(3)  NOT NULL ,
`redirectURI` varchar(191)  NOT NULL ,
`userId` varchar(191)  NOT NULL ,
`oAuthClientId` varchar(191)  NOT NULL ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL ,
UNIQUE INDEX `oAuthAuthorizationCode.code_unique`(`code`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `Group` (
`id` varchar(191)  NOT NULL ,
`name` varchar(191)  NOT NULL ,
`description` varchar(191)  ,
`userPoolId` varchar(191)  NOT NULL ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `User` (
`id` varchar(191)  NOT NULL ,
`sub` varchar(191)  NOT NULL ,
`username` varchar(191)  NOT NULL ,
`accountStatusType` ENUM('UNCONFIRMED', 'CONFIRMED', 'ARCHIVED', 'COMPROMISED', 'UNKNOWN', 'RESET_REQUIRED', 'FORCE_CHANGE_PASSWORD')  NOT NULL DEFAULT 'UNCONFIRMED',
`isExternalProvider` boolean  NOT NULL DEFAULT false,
`email` varchar(191)  NOT NULL ,
`password` varchar(191)  NOT NULL ,
`isDisabled` boolean  NOT NULL DEFAULT false,
`userPoolId` varchar(191)  NOT NULL ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL ,
UNIQUE INDEX `User.sub_unique`(`sub`),
UNIQUE INDEX `User.email_isExternalProvider_unique`(`email`,
`isExternalProvider`),
UNIQUE INDEX `User.username_userPoolId_unique`(`username`,
`userPoolId`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `NotificationType` (
`id` varchar(191)  NOT NULL ,
`name` varchar(191)  NOT NULL ,
`description` varchar(191)  ,
`template` varchar(191)  NOT NULL ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `Notification` (
`id` varchar(191)  NOT NULL ,
`text` varchar(191)  NOT NULL ,
`isRead` boolean  NOT NULL ,
`recipentId` varchar(191)  NOT NULL ,
`senderId` varchar(191)  NOT NULL ,
`url` varchar(191)  NOT NULL ,
`isDeleted` boolean  NOT NULL ,
`oAuthClientId` varchar(191)  ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `Profile` (
`id` varchar(191)  NOT NULL ,
`userId` varchar(191)  NOT NULL ,
`firstName` varchar(191)  DEFAULT '',
`lastName` varchar(191)  DEFAULT '',
`displayName` varchar(191)  ,
`birthdate` datetime(3)  ,
`gender` ENUM('FEMALE', 'MALE', 'OTHER')  ,
`mobileNumber` varchar(191)  ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL ,
UNIQUE INDEX `Profile_userId_unique`(`userId`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `UserCustomAttribute` (
`name` varchar(191)  NOT NULL ,
`value` varchar(191)  NOT NULL ,
`profileId` varchar(191)  NOT NULL ,
PRIMARY KEY (`name`,`profileId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `Email` (
`id` varchar(191)  NOT NULL ,
`email` varchar(191)  NOT NULL ,
`isVerified` boolean  NOT NULL DEFAULT false,
`isPrimary` boolean  NOT NULL DEFAULT false,
`profileId` varchar(191)  NOT NULL ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `Photo` (
`id` varchar(191)  NOT NULL ,
`value` varchar(191)  NOT NULL ,
`isCurrentProfileImage` boolean  NOT NULL ,
`profileId` varchar(191)  NOT NULL ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `PasswordReset` (
`id` varchar(191)  NOT NULL ,
`userId` varchar(191)  NOT NULL ,
`token` varchar(191)  NOT NULL ,
`expirationDate` datetime(3)  NOT NULL ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `UserDevice` (
`id` varchar(191)  NOT NULL ,
`userId` varchar(191)  NOT NULL ,
`deviceKey` varchar(191)  NOT NULL ,
`name` varchar(191)  ,
`lastIP` varchar(191)  NOT NULL ,
`isRemembered` boolean  NOT NULL DEFAULT false,
`SDK` varchar(191)  ,
`lastSeen` datetime(3)  NOT NULL ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `_UserPoolTooAuthScope` (
`A` varchar(191)  NOT NULL ,
`B` varchar(191)  NOT NULL ,
UNIQUE INDEX `_UserPoolTooAuthScope_AB_unique`(`A`,
`B`),
INDEX `_UserPoolTooAuthScope_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `_RoleToUser` (
`A` varchar(191)  NOT NULL ,
`B` varchar(191)  NOT NULL ,
UNIQUE INDEX `_RoleToUser_AB_unique`(`A`,
`B`),
INDEX `_RoleToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `_GroupToRole` (
`A` varchar(191)  NOT NULL ,
`B` varchar(191)  NOT NULL ,
UNIQUE INDEX `_GroupToRole_AB_unique`(`A`,
`B`),
INDEX `_GroupToRole_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `_RoleTooAuthScope` (
`A` varchar(191)  NOT NULL ,
`B` varchar(191)  NOT NULL ,
UNIQUE INDEX `_RoleTooAuthScope_AB_unique`(`A`,
`B`),
INDEX `_RoleTooAuthScope_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `_RoleTooAuthCustomScope` (
`A` varchar(191)  NOT NULL ,
`B` varchar(191)  NOT NULL ,
UNIQUE INDEX `_RoleTooAuthCustomScope_AB_unique`(`A`,
`B`),
INDEX `_RoleTooAuthCustomScope_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `_oAuthClientTooAuthGrant` (
`A` varchar(191)  NOT NULL ,
`B` varchar(191)  NOT NULL ,
UNIQUE INDEX `_oAuthClientTooAuthGrant_AB_unique`(`A`,
`B`),
INDEX `_oAuthClientTooAuthGrant_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `_oAuthClientTooAuthScope` (
`A` varchar(191)  NOT NULL ,
`B` varchar(191)  NOT NULL ,
UNIQUE INDEX `_oAuthClientTooAuthScope_AB_unique`(`A`,
`B`),
INDEX `_oAuthClientTooAuthScope_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `_oAuthClientTooAuthCustomScope` (
`A` varchar(191)  NOT NULL ,
`B` varchar(191)  NOT NULL ,
UNIQUE INDEX `_oAuthClientTooAuthCustomScope_AB_unique`(`A`,
`B`),
INDEX `_oAuthClientTooAuthCustomScope_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `_oAuthAccessTokenTooAuthScope` (
`A` varchar(191)  NOT NULL ,
`B` varchar(191)  NOT NULL ,
UNIQUE INDEX `_oAuthAccessTokenTooAuthScope_AB_unique`(`A`,
`B`),
INDEX `_oAuthAccessTokenTooAuthScope_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `_oAuthAuthorizationCodeTooAuthScope` (
`A` varchar(191)  NOT NULL ,
`B` varchar(191)  NOT NULL ,
UNIQUE INDEX `_oAuthAuthorizationCodeTooAuthScope_AB_unique`(`A`,
`B`),
INDEX `_oAuthAuthorizationCodeTooAuthScope_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `_oAuthRefreshTokenTooAuthScope` (
`A` varchar(191)  NOT NULL ,
`B` varchar(191)  NOT NULL ,
UNIQUE INDEX `_oAuthRefreshTokenTooAuthScope_AB_unique`(`A`,
`B`),
INDEX `_oAuthRefreshTokenTooAuthScope_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `_oAuthAccessTokenTooAuthCustomScope` (
`A` varchar(191)  NOT NULL ,
`B` varchar(191)  NOT NULL ,
UNIQUE INDEX `_oAuthAccessTokenTooAuthCustomScope_AB_unique`(`A`,
`B`),
INDEX `_oAuthAccessTokenTooAuthCustomScope_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `_oAuthCustomScopeTooAuthRefreshToken` (
`A` varchar(191)  NOT NULL ,
`B` varchar(191)  NOT NULL ,
UNIQUE INDEX `_oAuthCustomScopeTooAuthRefreshToken_AB_unique`(`A`,
`B`),
INDEX `_oAuthCustomScopeTooAuthRefreshToken_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `_oAuthAuthorizationCodeTooAuthCustomScope` (
`A` varchar(191)  NOT NULL ,
`B` varchar(191)  NOT NULL ,
UNIQUE INDEX `_oAuthAuthorizationCodeTooAuthCustomScope_AB_unique`(`A`,
`B`),
INDEX `_oAuthAuthorizationCodeTooAuthCustomScope_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `_GroupToUser` (
`A` varchar(191)  NOT NULL ,
`B` varchar(191)  NOT NULL ,
UNIQUE INDEX `_GroupToUser_AB_unique`(`A`,
`B`),
INDEX `_GroupToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `_UserFollows` (
`A` varchar(191)  NOT NULL ,
`B` varchar(191)  NOT NULL ,
UNIQUE INDEX `_UserFollows_AB_unique`(`A`,
`B`),
INDEX `_UserFollows_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

ALTER TABLE `Organization` ADD FOREIGN KEY (`systemUserId`) REFERENCES `SystemUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE `UserPool` ADD FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `Role` ADD FOREIGN KEY (`userPoolId`) REFERENCES `UserPool`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `oAuthClient` ADD FOREIGN KEY (`userPoolId`) REFERENCES `UserPool`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `oAuthRedirectURI` ADD FOREIGN KEY (`oAuthClientId`) REFERENCES `oAuthClient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `oAuthJavascriptOrigin` ADD FOREIGN KEY (`oAuthClientId`) REFERENCES `oAuthClient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `oAuthResourceServer` ADD FOREIGN KEY (`userPoolId`) REFERENCES `UserPool`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `oAuthCustomScope` ADD FOREIGN KEY (`oAuthResourceServerId`) REFERENCES `oAuthResourceServer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `oAuthCustomScope` ADD FOREIGN KEY (`userPoolId`) REFERENCES `UserPool`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `oAuthAccessToken` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE `oAuthAccessToken` ADD FOREIGN KEY (`oAuthClientId`) REFERENCES `oAuthClient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `oAuthRefreshToken` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE `oAuthRefreshToken` ADD FOREIGN KEY (`oAuthClientId`) REFERENCES `oAuthClient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `oAuthAuthorizationCode` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `oAuthAuthorizationCode` ADD FOREIGN KEY (`oAuthClientId`) REFERENCES `oAuthClient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `Group` ADD FOREIGN KEY (`userPoolId`) REFERENCES `UserPool`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `User` ADD FOREIGN KEY (`userPoolId`) REFERENCES `UserPool`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `Notification` ADD FOREIGN KEY (`recipentId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `Notification` ADD FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `Notification` ADD FOREIGN KEY (`oAuthClientId`) REFERENCES `oAuthClient`(`id`) ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE `Profile` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `UserCustomAttribute` ADD FOREIGN KEY (`profileId`) REFERENCES `Profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `Email` ADD FOREIGN KEY (`profileId`) REFERENCES `Profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `Photo` ADD FOREIGN KEY (`profileId`) REFERENCES `Profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `PasswordReset` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `UserDevice` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_UserPoolTooAuthScope` ADD FOREIGN KEY (`A`) REFERENCES `UserPool`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_UserPoolTooAuthScope` ADD FOREIGN KEY (`B`) REFERENCES `oAuthScope`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_RoleToUser` ADD FOREIGN KEY (`A`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_RoleToUser` ADD FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_GroupToRole` ADD FOREIGN KEY (`A`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_GroupToRole` ADD FOREIGN KEY (`B`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_RoleTooAuthScope` ADD FOREIGN KEY (`A`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_RoleTooAuthScope` ADD FOREIGN KEY (`B`) REFERENCES `oAuthScope`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_RoleTooAuthCustomScope` ADD FOREIGN KEY (`A`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_RoleTooAuthCustomScope` ADD FOREIGN KEY (`B`) REFERENCES `oAuthCustomScope`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_oAuthClientTooAuthGrant` ADD FOREIGN KEY (`A`) REFERENCES `oAuthClient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_oAuthClientTooAuthGrant` ADD FOREIGN KEY (`B`) REFERENCES `oAuthGrant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_oAuthClientTooAuthScope` ADD FOREIGN KEY (`A`) REFERENCES `oAuthClient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_oAuthClientTooAuthScope` ADD FOREIGN KEY (`B`) REFERENCES `oAuthScope`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_oAuthClientTooAuthCustomScope` ADD FOREIGN KEY (`A`) REFERENCES `oAuthClient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_oAuthClientTooAuthCustomScope` ADD FOREIGN KEY (`B`) REFERENCES `oAuthCustomScope`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_oAuthAccessTokenTooAuthScope` ADD FOREIGN KEY (`A`) REFERENCES `oAuthAccessToken`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_oAuthAccessTokenTooAuthScope` ADD FOREIGN KEY (`B`) REFERENCES `oAuthScope`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_oAuthAuthorizationCodeTooAuthScope` ADD FOREIGN KEY (`A`) REFERENCES `oAuthAuthorizationCode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_oAuthAuthorizationCodeTooAuthScope` ADD FOREIGN KEY (`B`) REFERENCES `oAuthScope`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_oAuthRefreshTokenTooAuthScope` ADD FOREIGN KEY (`A`) REFERENCES `oAuthRefreshToken`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_oAuthRefreshTokenTooAuthScope` ADD FOREIGN KEY (`B`) REFERENCES `oAuthScope`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_oAuthAccessTokenTooAuthCustomScope` ADD FOREIGN KEY (`A`) REFERENCES `oAuthAccessToken`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_oAuthAccessTokenTooAuthCustomScope` ADD FOREIGN KEY (`B`) REFERENCES `oAuthCustomScope`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_oAuthCustomScopeTooAuthRefreshToken` ADD FOREIGN KEY (`A`) REFERENCES `oAuthCustomScope`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_oAuthCustomScopeTooAuthRefreshToken` ADD FOREIGN KEY (`B`) REFERENCES `oAuthRefreshToken`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_oAuthAuthorizationCodeTooAuthCustomScope` ADD FOREIGN KEY (`A`) REFERENCES `oAuthAuthorizationCode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_oAuthAuthorizationCodeTooAuthCustomScope` ADD FOREIGN KEY (`B`) REFERENCES `oAuthCustomScope`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_GroupToUser` ADD FOREIGN KEY (`A`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_GroupToUser` ADD FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_UserFollows` ADD FOREIGN KEY (`A`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_UserFollows` ADD FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20201116024624-initial
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,376 @@
+// This is your Prisma schema file,
+// learn more about it in the docs https//pris.ly/d/prisma-schema
+
+datasource db {
+  provider = "mysql"
+  url = "***"
+}
+
+generator client {
+  provider        = "prisma-client-js"
+  previewFeatures = ["transactionApi", "connectOrCreate"]
+}
+
+enum SystemRole {
+  SUPER_ADMIN
+  ADMIN
+  DEVELOPER
+}
+
+model SystemUser {
+  id            String         @id @default(uuid())
+  username      String         @unique
+  email         String         @unique
+  password      String
+  role          SystemRole     @default(DEVELOPER)
+  Organizations Organization[]
+  createdAt     DateTime       @default(now())
+  updatedAt     DateTime       @updatedAt
+}
+
+enum GrantType {
+  AUTHORIZATION_CODE
+  PASSWORD
+  REFRESH_TOKEN
+  CLIENT_CREDENTIALS
+  EXTENSION
+}
+
+model Organization {
+  id           String      @id @default(uuid())
+  name         String
+  url          String?
+  address      String?
+  phoneNumber  String?
+  UserPools    UserPool[]
+  CreatedBy    SystemUser? @relation(fields: [systemUserId], references: [id])
+  systemUserId String?
+  createdAt    DateTime    @default(now())
+  updatedAt    DateTime    @updatedAt
+}
+
+model UserPool {
+  id              String                @id @default(uuid())
+  name            String
+  identifier      String                @unique
+  Organization    Organization          @relation(fields: [organizationId], references: [id])
+  organizationId  String
+  Users           User[]
+  Groups          Group[]
+  Roles           Role[]
+  Clients         oAuthClient[]
+  Scopes          oAuthScope[]
+  CustomScopes    oAuthCustomScope[]
+  ResourceServers oAuthResourceServer[]
+
+  @@unique([name, organizationId])
+}
+
+model Role {
+  id           String             @id @default(uuid())
+  name         String
+  description  String?
+  UserPool     UserPool           @relation(fields: [userPoolId], references: [id])
+  userPoolId   String
+  Users        User[]
+  Groups       Group[]
+  Scopes       oAuthScope[]
+  CustomScopes oAuthCustomScope[]
+  createdAt    DateTime           @default(now())
+  updatedAt    DateTime           @updatedAt
+
+  @@unique([name, userPoolId])
+}
+
+model oAuthClient {
+  id                   String                   @id @default(cuid())
+  name                 String
+  secret               String                   @default(uuid())
+  UserPool             UserPool                 @relation(fields: [userPoolId], references: [id])
+  userPoolId           String
+  Grants               oAuthGrant[]
+  Notifications        Notification[]
+  RedirectUris         oAuthRedirectURI[]
+  JavascriptOrigins    oAuthJavascriptOrigin[]
+  EnabledScopes        oAuthScope[]
+  EnabledCustomScopes  oAuthCustomScope[]
+  AccessTokens         oAuthAccessToken[]
+  AuthorizationCodes   oAuthAuthorizationCode[]
+  RefreshTokens        oAuthRefreshToken[]
+  refreshTokenLifetime Int                      @default(43200)
+  accessTokenLifetime  Int                      @default(60)
+  idTokenLifetime      Int                      @default(5)
+  logo                 String?
+  trustedClient        Boolean                  @default(false)
+  createdAt            DateTime                 @default(now())
+  updatedAt            DateTime                 @updatedAt
+
+  @@unique([name, userPoolId])
+}
+
+model oAuthScope {
+  id                 String                   @id @default(uuid())
+  name               String                   @unique
+  description        String?
+  Clients            oAuthClient[]
+  AccessTokens       oAuthAccessToken[]
+  AuthorizationCodes oAuthAuthorizationCode[]
+  RefreshTokenScope  oAuthRefreshToken[]
+  Roles              Role[]
+  UserPools          UserPool[]
+  createdAt          DateTime                 @default(now())
+  updatedAt          DateTime                 @updatedAt
+}
+
+model oAuthGrant {
+  id        String        @id @default(uuid())
+  grantType GrantType
+  Clients   oAuthClient[]
+  createdAt DateTime      @default(now())
+  updatedAt DateTime      @updatedAt
+}
+
+model oAuthRedirectURI {
+  id            String      @id @default(uuid())
+  Client        oAuthClient @relation(fields: [oAuthClientId], references: [id])
+  oAuthClientId String
+  url           String
+  createdAt     DateTime    @default(now())
+  updatedAt     DateTime    @updatedAt
+}
+
+model oAuthJavascriptOrigin {
+  id            String      @id @default(uuid())
+  Client        oAuthClient @relation(fields: [oAuthClientId], references: [id])
+  oAuthClientId String
+  uri           String
+  createdAt     DateTime    @default(now())
+  updatedAt     DateTime    @updatedAt
+}
+
+model oAuthResourceServer {
+  id         String             @id @default(uuid())
+  name       String
+  identifier String
+  UserPool   UserPool           @relation(fields: [userPoolId], references: [id])
+  userPoolId String
+  Scopes     oAuthCustomScope[]
+  createdAt  DateTime           @default(now())
+  updatedAt  DateTime           @updatedAt
+
+  @@unique([name, userPoolId])
+}
+
+model oAuthCustomScope {
+  id                      String                   @id @default(uuid())
+  name                    String
+  description             String?
+  ResourceServer          oAuthResourceServer      @relation(fields: [oAuthResourceServerId], references: [id])
+  oAuthResourceServerId   String
+  Clients                 oAuthClient[]
+  Roles                   Role[]
+  UserPool                UserPool                 @relation(fields: [userPoolId], references: [id])
+  userPoolId              String
+  oAuthAccessTokens       oAuthAccessToken[]
+  oAuthRefreshTokens      oAuthRefreshToken[]
+  oAuthAuthorizationCodes oAuthAuthorizationCode[]
+  createdAt               DateTime                 @default(now())
+  updatedAt               DateTime                 @updatedAt
+}
+
+model oAuthAccessToken {
+  id             String             @id @default(uuid())
+  accessToken    String             @unique @default(uuid())
+  expirationDate DateTime
+  Scopes         oAuthScope[]
+  CustomScopes   oAuthCustomScope[]
+  User           User?              @relation(fields: [userId], references: [id])
+  userId         String?
+  Client         oAuthClient        @relation(fields: [oAuthClientId], references: [id])
+  oAuthClientId  String
+  createdAt      DateTime           @default(now())
+  updatedAt      DateTime           @updatedAt
+}
+
+model oAuthRefreshToken {
+  id             String             @id @default(uuid())
+  refreshToken   String             @unique @default(uuid())
+  expirationDate DateTime
+  Scopes         oAuthScope[]
+  CustomScopes   oAuthCustomScope[]
+  User           User?              @relation(fields: [userId], references: [id])
+  userId         String?
+  Client         oAuthClient        @relation(fields: [oAuthClientId], references: [id])
+  oAuthClientId  String
+  createdAt      DateTime           @default(now())
+  updatedAt      DateTime           @updatedAt
+}
+
+model oAuthAuthorizationCode {
+  id             String             @id @default(uuid())
+  code           String             @unique @default(cuid(16))
+  expirationDate DateTime
+  redirectURI    String
+  Scopes         oAuthScope[]
+  CustomScopes   oAuthCustomScope[]
+  User           User               @relation(fields: [userId], references: [id])
+  userId         String
+  Client         oAuthClient        @relation(fields: [oAuthClientId], references: [id])
+  oAuthClientId  String
+  createdAt      DateTime           @default(now())
+  updatedAt      DateTime           @updatedAt
+}
+
+enum Gender {
+  FEMALE
+  MALE
+  OTHER
+}
+
+model Group {
+  id          String   @id @default(uuid())
+  name        String
+  description String?
+  UserPool    UserPool @relation(fields: [userPoolId], references: [id])
+  userPoolId  String
+  Users       User[]
+  Roles       Role[]
+  createdAt   DateTime @default(now())
+  updatedAt   DateTime @updatedAt
+}
+
+enum AccountStatusType {
+  UNCONFIRMED
+  CONFIRMED
+  ARCHIVED
+  COMPROMISED
+  UNKNOWN
+  RESET_REQUIRED
+  FORCE_CHANGE_PASSWORD
+}
+
+model User {
+  id                 String                   @id @default(uuid())
+  sub                String                   @unique @default(uuid())
+  username           String
+  accountStatusType  AccountStatusType        @default(UNCONFIRMED)
+  isExternalProvider Boolean                  @default(false)
+  email              String
+  password           String
+  isDisabled         Boolean                  @default(false)
+  Profile            Profile?
+  Groups             Group[]
+  PasswordResets     PasswordReset[]
+  Roles              Role[]
+  Devices            UserDevice[]
+  AccessTokens       oAuthAccessToken[]
+  AuthorizationCodes oAuthAuthorizationCode[]
+  RefreshTokens      oAuthRefreshToken[]
+  Notifications      Notification[]           @relation("NotificationRecipent")
+  Notification       Notification[]           @relation("NotificationSender")
+  UserPool           UserPool                 @relation(fields: [userPoolId], references: [id])
+  userPoolId         String
+  FollowedBy         User[]                   @relation("UserFollows", references: [id])
+  Following          User[]                   @relation("UserFollows", references: [id])
+  createdAt          DateTime                 @default(now())
+  updatedAt          DateTime                 @updatedAt
+
+  @@unique([email, isExternalProvider])
+  @@unique([username, userPoolId])
+}
+
+model NotificationType {
+  id          String   @id @default(uuid())
+  name        String
+  description String?
+  template    String
+  createdAt   DateTime @default(now())
+  updatedAt   DateTime @updatedAt
+}
+
+model Notification {
+  id            String       @id @default(uuid())
+  text          String
+  isRead        Boolean
+  Recipent      User         @relation("NotificationRecipent", fields: [recipentId], references: [id])
+  recipentId    String
+  Sender        User         @relation("NotificationSender", fields: [senderId], references: [id])
+  senderId      String
+  url           String
+  isDeleted     Boolean
+  Client        oAuthClient? @relation(fields: [oAuthClientId], references: [id])
+  oAuthClientId String?
+  createdAt     DateTime     @default(now())
+  updatedAt     DateTime     @updatedAt
+}
+
+model Profile {
+  id                   String                @id @default(uuid())
+  User                 User                  @relation(fields: [userId], references: [id])
+  userId               String
+  Emails               Email[]
+  firstName            String?               @default("")
+  lastName             String?               @default("")
+  displayName          String?
+  birthdate            DateTime?
+  gender               Gender?
+  mobileNumber         String?
+  Photos               Photo[]
+  UserCustomAttributes UserCustomAttribute[]
+  createdAt            DateTime              @default(now())
+  updatedAt            DateTime              @updatedAt
+}
+
+model UserCustomAttribute {
+  name      String
+  value     String
+  Profile   Profile @relation(fields: [profileId], references: [id])
+  profileId String
+
+  @@id([name, profileId])
+}
+
+model Email {
+  id         String   @id @default(uuid())
+  email      String
+  isVerified Boolean  @default(false)
+  isPrimary  Boolean  @default(false)
+  Profile    Profile  @relation(fields: [profileId], references: [id])
+  profileId  String
+  createdAt  DateTime @default(now())
+  updatedAt  DateTime @updatedAt
+}
+
+model Photo {
+  id                    String   @id @default(uuid())
+  value                 String
+  isCurrentProfileImage Boolean
+  Profile               Profile  @relation(fields: [profileId], references: [id])
+  profileId             String
+  createdAt             DateTime @default(now())
+  updatedAt             DateTime @updatedAt
+}
+
+model PasswordReset {
+  id             String   @id @default(uuid())
+  User           User     @relation(fields: [userId], references: [id])
+  userId         String
+  token          String
+  expirationDate DateTime
+  createdAt      DateTime @default(now())
+  updatedAt      DateTime @updatedAt
+}
+
+model UserDevice {
+  id           String   @id @default(uuid())
+  User         User     @relation(fields: [userId], references: [id])
+  userId       String
+  deviceKey    String
+  name         String?
+  lastIP       String
+  isRemembered Boolean  @default(false)
+  SDK          String?
+  lastSeen     DateTime
+  createdAt    DateTime @default(now())
+  updatedAt    DateTime @updatedAt
+}
```

