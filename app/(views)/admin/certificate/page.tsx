import React from 'react'
import Link from 'next/link'

function CertificatePage() {
  return (
    <div>
      <h1>Certificados</h1>
      <div>
        <Link  href='/admin/certificate/add'>Agregar Certificado</Link>
      </div>
      <div>
      <Link  href='/admin/certificate/grant'>Otorgar Certificado</Link>
      </div>
    </div>
  )
}

export default CertificatePage