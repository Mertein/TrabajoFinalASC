import getMyCoursesByID from '@/app/actions/getMyCoursesByID';
import ViewCourse from '../../../../components/ViewCourses/viewCourse/viewCourse';
import React from 'react'
import getMySchedulesByID from '@/app/actions/getMySchedulesByID';
import getStudentEnrollment from '@/app/actions/getStudentEnrollment';
import getEnrollmentCourse from '@/app/actions/getEnrollmentCourse';
export default  async function ({params}: any) {
  const courses = await getMyCoursesByID(params.id);
  const schedules = await getMySchedulesByID(params.id);
  const studentEnrollment = await getStudentEnrollment(params.id);
  const studentsCourseEnrollments = await getEnrollmentCourse()
  return (
    
    <ViewCourse courses={courses} params={params} schedules={schedules} studentEnrollment={studentEnrollment} studentsCourseEnrollments={studentsCourseEnrollments} />
  )
}
