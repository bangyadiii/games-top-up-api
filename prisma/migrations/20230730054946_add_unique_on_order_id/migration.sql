/*
  Warnings:

  - A unique constraint covering the columns `[order_id]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `transactions` MODIFY `status` ENUM('success', 'pending', 'failed') NOT NULL DEFAULT 'pending';

-- CreateIndex
CREATE UNIQUE INDEX `transactions_order_id_key` ON `transactions`(`order_id`);
