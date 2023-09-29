import React from 'react'
import BarChart from '../../../components/Graphs/BarChart';
import getCategories from '@/app/actions/getCategories';
export default async function() {
  const data = await getCategories();
  return (
    <div>
      <BarChart categories={data}/>
    </div>
  )
}
