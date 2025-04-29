-- CreateTable
CREATE TABLE "TaskInterest" (
    "id" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,
    "interestId" INTEGER NOT NULL,

    CONSTRAINT "TaskInterest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaskInterest_taskId_interestId_key" ON "TaskInterest"("taskId", "interestId");

-- AddForeignKey
ALTER TABLE "TaskInterest" ADD CONSTRAINT "TaskInterest_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskInterest" ADD CONSTRAINT "TaskInterest_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
