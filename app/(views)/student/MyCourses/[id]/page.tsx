import React from 'react'
import CourseEnroll from '@/app/components/CourseEnroll/courseEnroll'
import getMySchedulesByID from '@/app/actions/getMySchedulesByID';
import getMyCoursesByID from '@/app/actions/getMyCoursesByID';
import getClassCourse from '@/app/actions/getClassCourse';
export default async function ({params}: any) {
  const courses = await getMyCoursesByID(params.id);
  const schedules = await getMySchedulesByID(params.id);
  return (
  <CourseEnroll courses={courses} params={params} schedules={schedules} />
  )
}




