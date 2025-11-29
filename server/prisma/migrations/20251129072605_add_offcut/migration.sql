-- CreateTable
CREATE TABLE "Offcut" (
    "id" SERIAL NOT NULL,
    "materialId" INTEGER NOT NULL,
    "length" DECIMAL(65,30) NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Offcut_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Offcut" ADD CONSTRAINT "Offcut_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offcut" ADD CONSTRAINT "Offcut_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
