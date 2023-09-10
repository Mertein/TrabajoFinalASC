import getMyEnrollments from '@/app/actions/getMyEnrollments'
import React from 'react'
import CertificateStudent from '../components/Certificates/certificates';

export default async function page() {
  const enrollments = await getMyEnrollments();
  return (
    <CertificateStudent enrollments={enrollments} />
  )
}
