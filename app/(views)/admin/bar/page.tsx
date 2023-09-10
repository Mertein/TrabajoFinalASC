import React from 'react'
import BarChart from '../../../components/Graphs/BarChart';
import getCategoryDistribution from '@/app/actions/getCategoryDistribution';
export default async function() {
  const data = await getCategoryDistribution();
  return (
    <div>
      <BarChart categoryDistribution={data}/>
    </div>
  )
}
