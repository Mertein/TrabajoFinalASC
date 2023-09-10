import React from 'react'
import getCoursePopularity from '@/app/actions/getCoursePopularity';
import HorizontalBar from '@/app/components/Graphs/HorizontalBar';
export default async function() {
  const data = await getCoursePopularity();
  return (
    <div>
      <HorizontalBar data={data}/>
    </div>
  )
}
