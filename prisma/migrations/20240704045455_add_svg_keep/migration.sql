/*
  Warnings:

  - Added the required column `svg` to the `Keep` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `keep` ADD COLUMN `svg` VARCHAR(191) NOT NULL;
