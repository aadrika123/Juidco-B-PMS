-- CreateTable
CREATE TABLE "da_service_req_inbox" (
    "id" TEXT NOT NULL,
    "service_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "da_service_req_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "da_service_req_outbox" (
    "id" TEXT NOT NULL,
    "service_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "da_service_req_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "da_service_req_inbox_service_no_key" ON "da_service_req_inbox"("service_no");

-- CreateIndex
CREATE UNIQUE INDEX "da_service_req_outbox_service_no_key" ON "da_service_req_outbox"("service_no");

-- AddForeignKey
ALTER TABLE "da_service_req_inbox" ADD CONSTRAINT "da_service_req_inbox_service_no_fkey" FOREIGN KEY ("service_no") REFERENCES "service_request"("service_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_service_req_outbox" ADD CONSTRAINT "da_service_req_outbox_service_no_fkey" FOREIGN KEY ("service_no") REFERENCES "service_request"("service_no") ON DELETE RESTRICT ON UPDATE CASCADE;
