import React from 'react'
import StudentsCourses from '../../components/StudentsCourse/studentsCourse'

 export default function MyStudentsCoursesPage({params}: any)  {
  const {id} = params;
  return (
    <StudentsCourses params={id}/>
  )
}
