/*
  Warnings:

  - A unique constraint covering the columns `[coin_name]` on the table `coins` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `games` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `coins_coin_name_key` ON `coins`(`coin_name`);

-- CreateIndex
CREATE UNIQUE INDEX `games_name_key` ON `games`(`name`);
