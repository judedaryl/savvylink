USE [master]
GO
/****** Object:  Database [savvylink]    Script Date: 03/04/2018 5:45:46 AM ******/
CREATE DATABASE [savvylink]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'savvylink', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\savvylink.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'savvylink_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\savvylink_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [savvylink] SET COMPATIBILITY_LEVEL = 140
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [savvylink].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [savvylink] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [savvylink] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [savvylink] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [savvylink] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [savvylink] SET ARITHABORT OFF 
GO
ALTER DATABASE [savvylink] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [savvylink] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [savvylink] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [savvylink] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [savvylink] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [savvylink] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [savvylink] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [savvylink] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [savvylink] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [savvylink] SET  DISABLE_BROKER 
GO
ALTER DATABASE [savvylink] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [savvylink] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [savvylink] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [savvylink] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [savvylink] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [savvylink] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [savvylink] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [savvylink] SET RECOVERY FULL 
GO
ALTER DATABASE [savvylink] SET  MULTI_USER 
GO
ALTER DATABASE [savvylink] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [savvylink] SET DB_CHAINING OFF 
GO
ALTER DATABASE [savvylink] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [savvylink] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [savvylink] SET DELAYED_DURABILITY = DISABLED 
GO
EXEC sys.sp_db_vardecimal_storage_format N'savvylink', N'ON'
GO
ALTER DATABASE [savvylink] SET QUERY_STORE = OFF
GO
USE [savvylink]
GO
ALTER DATABASE SCOPED CONFIGURATION SET IDENTITY_CACHE = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION SET LEGACY_CARDINALITY_ESTIMATION = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET LEGACY_CARDINALITY_ESTIMATION = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 0;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET MAXDOP = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET PARAMETER_SNIFFING = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET QUERY_OPTIMIZER_HOTFIXES = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET QUERY_OPTIMIZER_HOTFIXES = PRIMARY;
GO
USE [savvylink]
GO
/****** Object:  User [judedaryl]    Script Date: 03/04/2018 5:45:47 AM ******/
CREATE USER [judedaryl] FOR LOGIN [judedaryl] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [judedaryl]
GO
/****** Object:  Table [dbo].[Contact]    Script Date: 03/04/2018 5:45:47 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Contact](
	[ContactID] [int] IDENTITY(1000001,1) NOT NULL,
	[ContactName] [nvarchar](255) NULL,
	[ContactPosition] [nvarchar](255) NOT NULL,
	[UserID] [int] NOT NULL,
	[OrganizationID] [int] NOT NULL,
	[DateCreated] [datetime] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[DateModified] [datetime] NOT NULL,
	[ModifiedBy] [int] NOT NULL,
 CONSTRAINT [PK_Contact] PRIMARY KEY CLUSTERED 
(
	[ContactID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Contributor]    Script Date: 03/04/2018 5:45:47 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Contributor](
	[ContributorID] [int] IDENTITY(1000001,1) NOT NULL,
	[UserID] [int] NOT NULL,
	[OrganizationID] [int] NOT NULL,
	[DateCreated] [datetime] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[DateModified] [datetime] NOT NULL,
	[ModifiedBy] [int] NOT NULL,
 CONSTRAINT [PK_Contributor] PRIMARY KEY CLUSTERED 
(
	[ContributorID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Hit]    Script Date: 03/04/2018 5:45:47 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Hit](
	[HitID] [int] IDENTITY(100001,1) NOT NULL,
	[HitIPAddress] [nvarchar](50) NULL,
	[DateCreated] [datetime] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[DateModified] [datetime] NOT NULL,
	[ModifiedBy] [int] NOT NULL,
 CONSTRAINT [PK_Hit] PRIMARY KEY CLUSTERED 
(
	[HitID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Organization]    Script Date: 03/04/2018 5:45:47 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Organization](
	[OrganizationID] [int] IDENTITY(100001,1) NOT NULL,
	[OrganizationName] [nvarchar](255) NOT NULL,
	[OrganizationType] [nvarchar](255) NULL,
	[OrganizationAddress_1] [nvarchar](255) NULL,
	[OrganizationAddress_2] [nvarchar](255) NULL,
	[OrganizationCity] [nvarchar](255) NOT NULL,
	[OrganizationProvince] [nvarchar](255) NOT NULL,
	[OrganizationCountry] [nvarchar](255) NOT NULL,
	[UserID] [int] NOT NULL,
	[DateCreated] [datetime] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[DateModified] [datetime] NOT NULL,
	[ModifiedBy] [int] NOT NULL,
 CONSTRAINT [PK_Organization] PRIMARY KEY CLUSTERED 
(
	[OrganizationID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[User]    Script Date: 03/04/2018 5:45:47 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User](
	[UserID] [int] IDENTITY(1000001,1) NOT NULL,
	[UserName] [nvarchar](255) NOT NULL,
	[UserGivenName] [nvarchar](255) NOT NULL,
	[UserFirstName] [nvarchar](255) NOT NULL,
	[UserLastName] [nvarchar](255) NOT NULL,
	[UserEmail] [nvarchar](255) NOT NULL,
	[UserPhoto] [nvarchar](255) NOT NULL,
	[Password] [nvarchar](255) NOT NULL,
	[DateCreated] [datetime] NOT NULL,
	[DateModified] [datetime] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[ModifiedBy] [int] NOT NULL,
 CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED 
(
	[UserID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UniqueEmail] UNIQUE NONCLUSTERED 
(
	[UserEmail] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UniqueUserName] UNIQUE NONCLUSTERED 
(
	[UserName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Contact]  WITH CHECK ADD  CONSTRAINT [FK_Contact_OrganizationID] FOREIGN KEY([OrganizationID])
REFERENCES [dbo].[Organization] ([OrganizationID])
GO
ALTER TABLE [dbo].[Contact] CHECK CONSTRAINT [FK_Contact_OrganizationID]
GO
ALTER TABLE [dbo].[Contact]  WITH CHECK ADD  CONSTRAINT [FK_Contact_UserID] FOREIGN KEY([UserID])
REFERENCES [dbo].[User] ([UserID])
GO
ALTER TABLE [dbo].[Contact] CHECK CONSTRAINT [FK_Contact_UserID]
GO
ALTER TABLE [dbo].[Contributor]  WITH CHECK ADD  CONSTRAINT [FK_Contributor_OrganizationID] FOREIGN KEY([OrganizationID])
REFERENCES [dbo].[Organization] ([OrganizationID])
GO
ALTER TABLE [dbo].[Contributor] CHECK CONSTRAINT [FK_Contributor_OrganizationID]
GO
ALTER TABLE [dbo].[Contributor]  WITH CHECK ADD  CONSTRAINT [FK_Contributor_UserID] FOREIGN KEY([UserID])
REFERENCES [dbo].[User] ([UserID])
GO
ALTER TABLE [dbo].[Contributor] CHECK CONSTRAINT [FK_Contributor_UserID]
GO
ALTER TABLE [dbo].[Organization]  WITH CHECK ADD  CONSTRAINT [FK_Organization_UserID] FOREIGN KEY([UserID])
REFERENCES [dbo].[User] ([UserID])
GO
ALTER TABLE [dbo].[Organization] CHECK CONSTRAINT [FK_Organization_UserID]
GO
USE [master]
GO
ALTER DATABASE [savvylink] SET  READ_WRITE 
GO
