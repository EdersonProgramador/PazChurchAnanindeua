-- AlterTable
ALTER TABLE "ChurchEvent" ADD COLUMN "locationId" TEXT;

-- CreateTable
CREATE TABLE "ChurchLocation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'regional',
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'PA',
    "cep" TEXT,
    "schedule" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChurchLocation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Sermon" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Cultos',
    "speaker" TEXT,
    "summary" TEXT,
    "imageUrl" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sermon_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LifeGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "leaderName" TEXT NOT NULL,
    "leaderPhone" TEXT,
    "leaderEmail" TEXT,
    "address" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT 'Ananindeua',
    "dayOfWeek" TEXT NOT NULL,
    "meetingTime" TEXT NOT NULL,
    "ageGroup" TEXT NOT NULL DEFAULT 'adultos',
    "capacity" INTEGER NOT NULL DEFAULT 12,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "locationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LifeGroup_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LifeGroupSignup" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "neighborhood" TEXT,
    "ageGroup" TEXT NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "lifeGroupId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LifeGroupSignup_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LifeGroupReport" (
    "id" TEXT NOT NULL,
    "lifeGroupId" TEXT NOT NULL,
    "weekDate" TIMESTAMP(3) NOT NULL,
    "attendance" INTEGER NOT NULL DEFAULT 0,
    "visitors" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "testimony" TEXT,
    "authorName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LifeGroupReport_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ChurchLocation_slug_key" ON "ChurchLocation"("slug");

ALTER TABLE "ChurchEvent" ADD CONSTRAINT "ChurchEvent_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "ChurchLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "LifeGroup" ADD CONSTRAINT "LifeGroup_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "ChurchLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "LifeGroupSignup" ADD CONSTRAINT "LifeGroupSignup_lifeGroupId_fkey" FOREIGN KEY ("lifeGroupId") REFERENCES "LifeGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "LifeGroupReport" ADD CONSTRAINT "LifeGroupReport_lifeGroupId_fkey" FOREIGN KEY ("lifeGroupId") REFERENCES "LifeGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
