USE [master]
GO

IF db_id('SocialCircle') IS NULL
	CREATE DATABASE [SocialCircle]
GO

USE [SocialCircle]
GO

DROP TABLE IF EXISTS [UserProfile]
DROP TABLE IF EXISTS [Event]
DROP TABLE IF EXISTS [EventGroup]
DROP TABLE IF EXISTS [Activity]

CREATE TABLE [UserProfile] (
  [Id] integer PRIMARY KEY IDENTITY,
  [FirebaseUserId] NVARCHAR(28) NOT NULL,
  [DisplayName] nvarchar(50) NOT NULL,
  [FirstName] nvarchar(50) NOT NULL,
  [LastName] nvarchar(50) NOT NULL,
  [Email] nvarchar(555) NOT NULL,
  [CreateDateTime] datetime NOT NULL,

  CONSTRAINT UQ_FirebaseUserId UNIQUE(FirebaseUserId)
)
GO

CREATE TABLE [Event] (
  [Id] integer PRIMARY KEY identity NOT NULL,
  [UserId] integer NOT NULL,
  [Name] nvarchar (255) NOT NULL,
  [Date] datetime NOT NULL,
  [Address] nvarchar(255) NOT NULL,
  [Description] nvarchar(255),
  [ActivityId] int
)
GO

CREATE TABLE [EventGroup] (
  [Id] int PRIMARY KEY identity NOT NULL,
  [UserId] int,
  [EventId] int
)
GO

CREATE TABLE [Activity] (
  [Id] int PRIMARY KEY identity NOT NULL,
  [Name] nvarchar(255)
)
GO

ALTER TABLE [Event] ADD FOREIGN KEY ([UserId]) REFERENCES [UserProfile] ([Id])
GO

ALTER TABLE [EventGroup] ADD FOREIGN KEY ([UserId]) REFERENCES [UserProfile] ([Id])
GO

ALTER TABLE [EventGroup] ADD FOREIGN KEY ([EventId]) REFERENCES [Event] ([Id])
GO

ALTER TABLE [Event] ADD FOREIGN KEY ([ActivityId]) REFERENCES [Activity] ([Id])
GO
