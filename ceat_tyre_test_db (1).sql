-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 24, 2021 at 03:06 PM
-- Server version: 10.4.20-MariaDB
-- PHP Version: 7.4.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ceat_tyre_test_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `archive`
--

CREATE TABLE `archive` (
  `clientId` int(11) NOT NULL,
  `createdAt` bigint(20) DEFAULT NULL,
  `fromModel` varchar(255) DEFAULT NULL,
  `originalRecord` longtext DEFAULT NULL,
  `originalRecordId` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `ceat_clients`
--

CREATE TABLE `ceat_clients` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `clientId` int(11) NOT NULL,
  `clientName` varchar(255) DEFAULT NULL,
  `clientEmail` varchar(255) DEFAULT NULL,
  `clientCategory` varchar(255) DEFAULT NULL,
  `clientAddress` varchar(255) DEFAULT NULL,
  `clientContact` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ceat_clients`
--

INSERT INTO `ceat_clients` (`createdAt`, `updatedAt`, `clientId`, `clientName`, `clientEmail`, `clientCategory`, `clientAddress`, `clientContact`) VALUES
(1639043081962, 1639043081962, 1, 'ceat', 'rutumtech@gmail.com', '1', 'vadodara', 1234567890);

-- --------------------------------------------------------

--
-- Table structure for table `ceat_projects`
--

CREATE TABLE `ceat_projects` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `projectId` int(11) NOT NULL,
  `projectName` varchar(255) DEFAULT NULL,
  `projectStatus` varchar(255) DEFAULT NULL,
  `fkClientId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ceat_projects`
--

INSERT INTO `ceat_projects` (`createdAt`, `updatedAt`, `projectId`, `projectName`, `projectStatus`, `fkClientId`) VALUES
(1640335211528, 1640335211528, 1, 'ceat', '1', 1);

-- --------------------------------------------------------

--
-- Table structure for table `ceat_project_data`
--

CREATE TABLE `ceat_project_data` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `dataId` int(11) NOT NULL,
  `dataValue` varchar(255) DEFAULT NULL,
  `dataCellNumber` varchar(255) DEFAULT NULL,
  `fkParameterId` int(11) DEFAULT NULL,
  `fkSubIterationId` int(11) DEFAULT NULL,
  `fkIterationId` int(11) DEFAULT NULL,
  `fkProjectId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ceat_project_data`
--

INSERT INTO `ceat_project_data` (`createdAt`, `updatedAt`, `dataId`, `dataValue`, `dataCellNumber`, `fkParameterId`, `fkSubIterationId`, `fkIterationId`, `fkProjectId`) VALUES
(1640338479660, 1640338479660, 1, '255/65R18', 'A1', 1, 3, 3, 1),
(1640338479660, 1640338479660, 2, 'CEAT', 'A1', 2, 3, 3, 1),
(1640338479660, 1640338479660, 3, 'CROSSDRIVEAT', 'A1', 3, 3, 3, 1),
(1640338479660, 1640338479660, 4, '3921', 'A1', 4, 3, 3, 1),
(1640338479660, 1640338479660, 5, '255', 'B1', 1, 4, 4, 1),
(1640338479660, 1640338479660, 6, 'CEAT', 'B2', 2, 4, 4, 1),
(1640338479660, 1640338479660, 7, 'CROSSDRIVE', 'D3', 3, 4, 4, 1),
(1640338479660, 1640338479660, 8, '3479', 'B5', 4, 4, 4, 1),
(1640338479660, 1640338479660, 9, '255', 'B1', 1, 5, 5, 1),
(1640338479660, 1640338479660, 10, 'CEAT', 'B2', 2, 5, 5, 1),
(1640338479660, 1640338479660, 11, 'CROSSDRIVE', 'D3', 3, 5, 5, 1),
(1640338479660, 1640338479660, 12, '3479', 'B5', 4, 5, 5, 1),
(1640338479660, 1640338479660, 13, '267', 'A2', 1, 6, 3, 1),
(1640338479660, 1640338479660, 14, 'MARUTI', 'A2', 2, 6, 3, 1),
(1640338479660, 1640338479660, 15, 'DRIVE', 'A2', 3, 6, 3, 1),
(1640338479660, 1640338479660, 16, '2598', 'A2', 4, 6, 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `ceat_project_iteration`
--

CREATE TABLE `ceat_project_iteration` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `iterationId` int(11) NOT NULL,
  `iterationName` varchar(255) DEFAULT NULL,
  `iterationType` varchar(255) DEFAULT NULL,
  `fkProjectId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ceat_project_iteration`
--

INSERT INTO `ceat_project_iteration` (`createdAt`, `updatedAt`, `iterationId`, `iterationName`, `iterationType`, `fkProjectId`) VALUES
(1640338479591, 1640338479591, 3, 'A', '1', 1),
(1640342963601, 1640342963601, 4, 'B', '2', 1),
(1640343033434, 1640343033434, 5, 'C', '2', 1);

-- --------------------------------------------------------

--
-- Table structure for table `ceat_project_parameters`
--

CREATE TABLE `ceat_project_parameters` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `parameterId` int(11) NOT NULL,
  `parameterName` varchar(255) DEFAULT NULL,
  `fkProjectId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ceat_project_parameters`
--

INSERT INTO `ceat_project_parameters` (`createdAt`, `updatedAt`, `parameterId`, `parameterName`, `fkProjectId`) VALUES
(1640335211438, 1640335211438, 1, 'Tyre Size', 1),
(1640335211438, 1640335211438, 2, 'Brand', 1),
(1640335211438, 1640335211438, 3, 'Pattern', 1),
(1640335211438, 1640335211438, 4, 'SI number', 1);

-- --------------------------------------------------------

--
-- Table structure for table `ceat_project_sub_iteration`
--

CREATE TABLE `ceat_project_sub_iteration` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `subIterationId` int(11) NOT NULL,
  `subIterationName` varchar(255) DEFAULT NULL,
  `fkIterationId` int(11) DEFAULT NULL,
  `fkProjectId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ceat_project_sub_iteration`
--

INSERT INTO `ceat_project_sub_iteration` (`createdAt`, `updatedAt`, `subIterationId`, `subIterationName`, `fkIterationId`, `fkProjectId`) VALUES
(1640338479660, 1640338479660, 3, 'A1', 3, 1),
(1640342963712, 1640342963712, 4, 'B1', 4, 1),
(1640343033533, 1640343033533, 5, 'C1', 5, 1),
(1640338479660, 1640338479660, 6, 'A2', 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `ceat_users`
--

CREATE TABLE `ceat_users` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `userId` int(11) NOT NULL,
  `userName` varchar(255) DEFAULT NULL,
  `userEmail` varchar(255) DEFAULT NULL,
  `userPassword` varchar(255) DEFAULT NULL,
  `userRole` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ceat_users`
--

INSERT INTO `ceat_users` (`createdAt`, `updatedAt`, `userId`, `userName`, `userEmail`, `userPassword`, `userRole`) VALUES
(1619159944383, 1619159944383, 1, 'ceat', 'ceat@ceat.com', '$2a$10$9TkE5t/XnuknVfr5mrctr.x5EdlBn5hlUcACC83pwE/.oQiDT8G.e', 'admin'),
(1638965867478, 1638965867478, 5, 'rutu', 'rutu@cubetechnology.in', '$2a$10$jm8pez/lRX/E7lPlXD0IKuR5P0jeWlMv5AHyspxau9YzR.MklBJuW', 'user'),
(1639032535506, 1639032535506, 6, 'test', 'test@test.com', '$2a$10$sCD1devJHzAqJPbUufgW4eDS.T.m3Wg5FiUYmTLZknpCgfa0nP4L2', 'user'),
(1639032636575, 1639032636575, 7, 'Rutu Piyush Patel', 'rutumtech@gmail.com', '$2a$10$myZs.gHrtW4OGJiKDU/YRuUH9tTiSznBcKhKUIQd3q3R8306OJ5li', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `archive`
--
ALTER TABLE `archive`
  ADD PRIMARY KEY (`clientId`),
  ADD UNIQUE KEY `clientId` (`clientId`);

--
-- Indexes for table `ceat_clients`
--
ALTER TABLE `ceat_clients`
  ADD PRIMARY KEY (`clientId`),
  ADD UNIQUE KEY `clientId` (`clientId`),
  ADD UNIQUE KEY `clientName` (`clientName`),
  ADD UNIQUE KEY `clientEmail` (`clientEmail`);

--
-- Indexes for table `ceat_projects`
--
ALTER TABLE `ceat_projects`
  ADD PRIMARY KEY (`projectId`),
  ADD UNIQUE KEY `projectId` (`projectId`),
  ADD UNIQUE KEY `projectName` (`projectName`);

--
-- Indexes for table `ceat_project_data`
--
ALTER TABLE `ceat_project_data`
  ADD PRIMARY KEY (`dataId`),
  ADD UNIQUE KEY `dataId` (`dataId`);

--
-- Indexes for table `ceat_project_iteration`
--
ALTER TABLE `ceat_project_iteration`
  ADD PRIMARY KEY (`iterationId`),
  ADD UNIQUE KEY `iterationId` (`iterationId`),
  ADD UNIQUE KEY `iterationName` (`iterationName`);

--
-- Indexes for table `ceat_project_parameters`
--
ALTER TABLE `ceat_project_parameters`
  ADD PRIMARY KEY (`parameterId`),
  ADD UNIQUE KEY `parameterId` (`parameterId`),
  ADD UNIQUE KEY `parameterName` (`parameterName`);

--
-- Indexes for table `ceat_project_sub_iteration`
--
ALTER TABLE `ceat_project_sub_iteration`
  ADD PRIMARY KEY (`subIterationId`),
  ADD UNIQUE KEY `subIterationId` (`subIterationId`),
  ADD UNIQUE KEY `subIterationName` (`subIterationName`);

--
-- Indexes for table `ceat_users`
--
ALTER TABLE `ceat_users`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `userId` (`userId`),
  ADD UNIQUE KEY `userName` (`userName`),
  ADD UNIQUE KEY `userEmail` (`userEmail`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `archive`
--
ALTER TABLE `archive`
  MODIFY `clientId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ceat_clients`
--
ALTER TABLE `ceat_clients`
  MODIFY `clientId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ceat_projects`
--
ALTER TABLE `ceat_projects`
  MODIFY `projectId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ceat_project_data`
--
ALTER TABLE `ceat_project_data`
  MODIFY `dataId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `ceat_project_iteration`
--
ALTER TABLE `ceat_project_iteration`
  MODIFY `iterationId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `ceat_project_parameters`
--
ALTER TABLE `ceat_project_parameters`
  MODIFY `parameterId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `ceat_project_sub_iteration`
--
ALTER TABLE `ceat_project_sub_iteration`
  MODIFY `subIterationId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `ceat_users`
--
ALTER TABLE `ceat_users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
