/*
  Warnings:

  - You are about to drop the column `owner` on the `Auction` table. All the data in the column will be lost.
  - Added the required column `owner` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Auction" DROP CONSTRAINT "Auction_owner_fkey";

-- DropIndex
DROP INDEX "Auction_owner_unique";

-- AlterTable
ALTER TABLE "Auction" DROP COLUMN "owner";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "owner" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "isWinning" BOOLEAN NOT NULL DEFAULT false,
    "auctionId" INTEGER NOT NULL,
    "owner" INTEGER,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ticket" ADD FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD FOREIGN KEY ("owner") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
