import React from 'react'
import CertificateValidate from '../components/CertificateValidate'
import getCertificateValidate from '@/app/actions/getCertificateValidate';

export default async function ({params}: any)  {
  const certificateStudent = await getCertificateValidate(params.id);
  return (
    <div>
      <CertificateValidate data={certificateStudent} />
    </div>
  )
}
