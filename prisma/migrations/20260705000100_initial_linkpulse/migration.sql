CREATE TYPE "LinkStatus" AS ENUM ('active', 'disabled', 'deleted');

CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password_hash" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "links" (
  "id" TEXT NOT NULL,
  "user_id" TEXT,
  "original_url" TEXT NOT NULL,
  "short_code" TEXT NOT NULL,
  "custom_alias" TEXT,
  "status" "LinkStatus" NOT NULL DEFAULT 'active',
  "click_count" INTEGER NOT NULL DEFAULT 0,
  "expires_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3),
  CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "click_events" (
  "id" TEXT NOT NULL,
  "link_id" TEXT NOT NULL,
  "ip_hash" TEXT,
  "visitor_hash" TEXT,
  "user_agent" TEXT,
  "referrer" TEXT,
  "country" TEXT,
  "device_type" TEXT,
  "browser" TEXT,
  "operating_system" TEXT,
  "clicked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "click_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "refresh_sessions" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "token_hash" TEXT NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "revoked_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "refresh_sessions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "links_short_code_key" ON "links"("short_code");
CREATE UNIQUE INDEX "links_custom_alias_key" ON "links"("custom_alias");
CREATE UNIQUE INDEX "refresh_sessions_token_hash_key" ON "refresh_sessions"("token_hash");
CREATE INDEX "links_user_id_idx" ON "links"("user_id");
CREATE INDEX "links_short_code_idx" ON "links"("short_code");
CREATE INDEX "links_status_idx" ON "links"("status");
CREATE INDEX "links_created_at_idx" ON "links"("created_at");
CREATE INDEX "links_expires_at_idx" ON "links"("expires_at");
CREATE INDEX "links_click_count_idx" ON "links"("click_count");
CREATE INDEX "click_events_link_id_clicked_at_idx" ON "click_events"("link_id", "clicked_at");
CREATE INDEX "click_events_link_id_visitor_hash_idx" ON "click_events"("link_id", "visitor_hash");
CREATE INDEX "click_events_browser_idx" ON "click_events"("browser");
CREATE INDEX "click_events_operating_system_idx" ON "click_events"("operating_system");
CREATE INDEX "click_events_device_type_idx" ON "click_events"("device_type");
CREATE INDEX "click_events_country_idx" ON "click_events"("country");
CREATE INDEX "refresh_sessions_user_id_idx" ON "refresh_sessions"("user_id");
CREATE INDEX "refresh_sessions_expires_at_idx" ON "refresh_sessions"("expires_at");
CREATE INDEX "refresh_sessions_revoked_at_idx" ON "refresh_sessions"("revoked_at");

ALTER TABLE "links" ADD CONSTRAINT "links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "click_events" ADD CONSTRAINT "click_events_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "refresh_sessions" ADD CONSTRAINT "refresh_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
