/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `game_categories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `game_categories_name_key` ON `game_categories`(`name`);
