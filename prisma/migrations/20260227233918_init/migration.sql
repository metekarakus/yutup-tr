-- CreateEnum
CREATE TYPE "LinkType" AS ENUM ('SHORTEN', 'YOUTUBE', 'SUBSCRIBE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "google_sub" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "custom_slug_quota_used" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "links" (
    "id" TEXT NOT NULL,
    "owner_user_id" TEXT,
    "guest_token_hash" TEXT,
    "creator_ip_hash" TEXT,
    "slug" TEXT NOT NULL,
    "original_url" TEXT NOT NULL,
    "resolved_url" TEXT NOT NULL,
    "link_type" "LinkType" NOT NULL DEFAULT 'SHORTEN',
    "interstitial_enabled" BOOLEAN NOT NULL DEFAULT false,
    "interstitial_message" TEXT,
    "custom_slug_used" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "click_events" (
    "id" TEXT NOT NULL,
    "link_id" TEXT NOT NULL,
    "clicked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "country" TEXT,
    "city" TEXT,
    "referrer" TEXT,
    "user_agent" TEXT,
    "ip_hash" TEXT,

    CONSTRAINT "click_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_google_sub_key" ON "users"("google_sub");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "links_slug_key" ON "links"("slug");

-- CreateIndex
CREATE INDEX "links_owner_user_id_idx" ON "links"("owner_user_id");

-- CreateIndex
CREATE INDEX "click_events_link_id_clicked_at_idx" ON "click_events"("link_id", "clicked_at");

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "click_events" ADD CONSTRAINT "click_events_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE CASCADE;
