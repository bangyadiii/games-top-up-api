/*
  Warnings:

  - You are about to drop the column `product_type_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `product_types` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `coin_id` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_product_type_id_fkey`;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `product_type_id`,
    ADD COLUMN `coin_id` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `product_types`;

-- CreateTable
CREATE TABLE `coins` (
    `id` VARCHAR(191) NOT NULL,
    `coin_name` VARCHAR(191) NOT NULL,
    `game_id` VARCHAR(191) NOT NULL,
    `coin_icon_url` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_coin_id_fkey` FOREIGN KEY (`coin_id`) REFERENCES `coins`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coins` ADD CONSTRAINT `coins_game_id_fkey` FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
