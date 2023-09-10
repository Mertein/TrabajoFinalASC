import React from 'react'
import getCategoryDistribution from '@/app/actions/getCategoryDistribution';
import PieChart from '@/app/components/Graphs/PieChart';
export default async function() {
  const data = await getCategoryDistribution();
  return (
    <div>
      <PieChart data={data} />

    </div>
  )
}
