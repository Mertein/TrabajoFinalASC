-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_course_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
