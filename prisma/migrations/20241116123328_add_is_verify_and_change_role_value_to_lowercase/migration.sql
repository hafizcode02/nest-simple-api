/*
  Warnings:

  - You are about to alter the column `role` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `role` ENUM('Admin', 'User') NOT NULL DEFAULT 'User',
    MODIFY `isActive` BOOLEAN NOT NULL DEFAULT true;
