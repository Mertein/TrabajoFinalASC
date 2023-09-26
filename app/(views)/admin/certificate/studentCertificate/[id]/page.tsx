'use client'
import { useReducer, useState, useEffect, useRef } from 'react'
import Modal from '../../../components/Modal/modal'
import useSWR from "swr";
import styles from '../../../styles/certificateGenerator.module.scss'
import Certificate from '../../../views/Certificate';
import { Button } from '@mui/material';
import  QRCode  from "qrcode";
import Image from 'next/image';

const CertificateGenerator = ({params}: any) => {
  const [formData, setFormData] = useState({
    name: '',
    dni: '',
    course: '',
    category: '',
    dateOfConductStart: null || new Date(),
    dateOfConductEnd: null || new Date(),
    signatureDetails: 'Academia A.L',
    instructor: '',
  });
  const [url, setUrl] = useState("");
  const [src, setSrc] = useState<string>("");
  const fetcher = (arg: any, ...args: any) => fetch(arg, ...args).then(res => res.json())
  const { data, error, isLoading } = useSWR(`/api/enrollmentCourseID/${params.id}`, fetcher)
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (data && data.course.usser.files[0]?.path !== '') {
        const pathWithoutPublic = data.course.usser.files[0]?.path.replace('public', '');
        // Mostrar la imagen utilizando la función Image de Next.js
        setUrl(pathWithoutPublic + data.course.usser.files[0]?.name);
        const { usser, course } = data;
        setFormData({
          name: usser?.first_name + ' ' + usser?.last_name,
          dni: usser?.dni,
          course: course?.course_name,
          category: course?.category_course.category_name,
          dateOfConductStart: new Date(course?.start_date),
          dateOfConductEnd: new Date(course?.end_date),
          signatureDetails: 'Academia A.L',
          instructor: course.usser.first_name + ' ' + course.usser.last_name,
        });
    }
}, [data]);
  console.log(data);

  const generate = () => {
    QRCode.toDataURL(`${process.env.NEXTAUTH_URL}/certificateValidate/` + params.id).then(setSrc)
  }
  const startDateTimestamp = data?.course?.start_date;
  const startDate = new Date(startDateTimestamp);
  const endDateTimestamp = data?.course?.end_date;
  const endDate = new Date(endDateTimestamp);
  const month = endDate.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por eso sumamos 1
  const year = endDate.getFullYear();

  const [isOpenModal, setIsOpenModal] = useState(false)

  const handleSubmitForm = (e : any) => {
    e.preventDefault()
    const { name, course, dateOfConductStart, dateOfConductEnd, signatureDetails } = formData

    if (name && course && dateOfConductStart && dateOfConductEnd  && signatureDetails) {
      setIsOpenModal(true)
    } else {
      alert('Please fill all details')
    }
  }

  const handleTextChange = (e: any) => {
    const value = e.target.value;
    const name = e.target.name;

    if (name === 'dateOfConductStart' || name === 'dateOfConductEnd') {
      const dateValue = value ? new Date(value) : null;
      setFormData({ ...formData, [name]: dateValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  console.log(data);
  return (
    <>
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <form onSubmit={handleSubmitForm}>
          <div className={styles.inputGroup}>
            <label htmlFor='user-name'>Nombre</label>
            <input type='text' name='name' value={formData.name} disabled={true} onChange={handleTextChange} id='user-name' />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor='course'>Curso</label>
            <input type='text' name='course' value={formData.course} disabled={true} onChange={handleTextChange} id='course' />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor='category'>Categoria</label>
            <input type='text' name='category' value={formData.category} disabled={true} onChange={handleTextChange} id='category' />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor='dateOfConductStart'>Inicio del Curso</label>
            <input
              type='date'
              disabled={true}
              value={formData.dateOfConductStart ? formData.dateOfConductStart.toISOString().slice(0, 10) : ''}
              onChange={handleTextChange}
              name='dateOfConductStart'
              id='dateOfConductStart'
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor='dateOfConductEnd'>Fin del Curso</label>
            <input
              type='date'
              disabled={true}
              value={formData.dateOfConductEnd ? formData.dateOfConductEnd.toISOString().slice(0, 10) : ''}
              onChange={handleTextChange}
              name='dateOfConductEnd'
              id='dateOfConductEnd'
            />
          </div>


          <div className={styles.inputGroup}>
            <label htmlFor='signatureDetails'>Detalles Firma</label>
            <input
              disabled={true}
              type='text'
              name='signatureDetails'
              value={formData.signatureDetails}
              onChange={handleTextChange}
              id='signatureDetails'
            />
          </div>
          <Button  variant='outlined' color='info' className='border-2 border-blue  mb-2 p-2 shadow-md cursor-pointer w-full' type='button' onClick={generate} disabled={data?.files.length < 0} >Generar QR</Button>

          <Button variant='text' color='success' className={`border-2 border-black  w-full outline-none bg-black p-4 shadow-md transition-all duration-300 cursor-pointer`} type='submit' disabled={!src || data?.files.length < 0}>Generar Certificado</Button>
        </form>
          {src &&
            <Image className='mt-2 ' src={src} alt="QR" width={100} height={100} />
          } 
          {data?.files.length > 0  &&
            <Image className='mt-2 ' src={`/Users/Certificates/${data?.files[0]?.name}`} alt="Certificado Estudiante" width={500} height={100} />
          }
          
      </div>
    </div>

    <Modal isOpen={isOpenModal} handleClose={() => setIsOpenModal(false)}>
      <Certificate {...formData} url={url} enrollmentId={data?.enrollment_id} src={src} />
    </Modal>
  </>
  )
}

export default CertificateGenerator