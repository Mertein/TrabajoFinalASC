import getCurrentUser from '@/app/actions/getCurrentUser'
import getMySignature from '@/app/actions/getMySignature';
import Signature from '@/app/components/Signature/signature'
import React from 'react'

async function SignaturePage() {
  const user = await getCurrentUser();
  const signature = await getMySignature()
  return (
    <Signature user={user} signature={signature}/>
  )
}

export default SignaturePage