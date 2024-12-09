/*
  Warnings:

  - You are about to drop the column `tilt` on the `Heartbeat` table. All the data in the column will be lost.
  - Added the required column `pitch` to the `Heartbeat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roll` to the `Heartbeat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Heartbeat` DROP COLUMN `tilt`,
    ADD COLUMN `pitch` VARCHAR(191) NOT NULL,
    ADD COLUMN `roll` VARCHAR(191) NOT NULL;
