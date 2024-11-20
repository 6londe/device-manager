-- CreateTable
CREATE TABLE `Device` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deviceKey` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Device_deviceKey_key`(`deviceKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Heartbeat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `appState` INTEGER NOT NULL,
    `deviceId` INTEGER NOT NULL,
    `tilt` VARCHAR(191) NOT NULL,
    `batteryPercentage` INTEGER NOT NULL,
    `isCharging` BOOLEAN NOT NULL,
    `screenImagePath` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Heartbeat` ADD CONSTRAINT `Heartbeat_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `Device`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
