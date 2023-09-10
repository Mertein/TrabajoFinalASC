
import getMyCoursesByID from '@/app/actions/getMyCoursesByID';
import ViewCourse from '../../../../components/ViewCourses/viewCourse/viewCourse';
import React from 'react'
import getMySchedules from '@/app/actions/getMySchedulesByID';
export default  async function ({params}: any) {
  const courses = await getMyCoursesByID(params.id);
  const schedules = await getMySchedules(params.id);
  return (
    <ViewCourse courses={courses} params={params} schedules={schedules}/>
  )
}
