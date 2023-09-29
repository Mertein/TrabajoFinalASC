import React from 'react'
import PieChart from '@/app/components/Graphs/PieChart';
import getCategories from '@/app/actions/getCategories';
export default async function() {
  const data = await getCategories();
  return (
    <div>
      <PieChart categories={data} />

    </div>
  )
}
