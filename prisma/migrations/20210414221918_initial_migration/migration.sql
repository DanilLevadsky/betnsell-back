-- CreateEnum
CREATE TYPE "_Status" AS ENUM ('started', 'waiting', 'expired', 'finished');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_pic" TEXT,
    "mobile_number" TEXT,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "sum" INTEGER NOT NULL,
    "auctionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auction" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "_Status" NOT NULL DEFAULT E'started',
    "updated_at" TIMESTAMP(3) NOT NULL,
    "lot_finish_date" TIMESTAMP(3) NOT NULL,
    "lot_expire_date" TIMESTAMP(3) NOT NULL,
    "productId" INTEGER NOT NULL,
    "owner" INTEGER NOT NULL,
    "winner" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT,
    "photo" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.username_unique" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User.mobile_number_unique" ON "User"("mobile_number");

-- CreateIndex
CREATE UNIQUE INDEX "Auction_productId_unique" ON "Auction"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Auction_owner_unique" ON "Auction"("owner");

-- CreateIndex
CREATE UNIQUE INDEX "Auction_winner_unique" ON "Auction"("winner");

-- AddForeignKey
ALTER TABLE "Customer" ADD FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auction" ADD FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auction" ADD FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auction" ADD FOREIGN KEY ("winner") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
