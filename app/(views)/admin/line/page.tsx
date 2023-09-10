import React from 'react'
import LineChart from '@/app/components/Graphs/LineChart';
import getEnrollmentTrend from '@/app/actions/getEnrollmentTrend';
export default async function() {
  const data = await getEnrollmentTrend();
  return (
    <div>
      <LineChart enrollmentData={data} />
    </div>
  )
}
