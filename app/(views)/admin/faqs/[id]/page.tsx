import OneFaqForm from '@/app/components/FaqManagement/OneFaqForm'
import React from 'react'

export default function Page({params}: any) {
  return (
    <OneFaqForm faqId={params} />
  )
}
