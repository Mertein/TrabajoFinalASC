'use client'
import React, {useEffect, useState } from 'react'
import { Grid, Paper, Typography, Box, Card, CardContent, Button, Alert } from '@mui/material';
import './styles.scss';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { format, parseISO, isBefore, isAfter} from 'date-fns';
import { es } from 'date-fns/locale'; 
import { AttachMoney, CheckCircle, DesktopMac, Email, Facebook, Instagram, LocationOn, Schedule, WhatsApp } from '@mui/icons-material';
import { initMercadoPago } from '@mercadopago/sdk-react'
import { MercadoPagoButton } from '../../MercadoPagoButton/mercadoPagoButton';
import axios from 'axios';
import { useSession } from "next-auth/react";
import useSWR, { mutate } from "swr";
import OmeCertificate from '../../../../public/certificates-logos/Ome.jpg';
import SevillaCertificate from '../../../../public/certificates-logos/Sevilla.jpg';

interface NotificationType {
  isOpen: boolean;
  type: "approved" | "failure" | null;
  content: string;
}

function ViewCourse({courses, params, schedules} : any) {
  const [userId, setUserId] = useState<string>('');
  const { data: session, status } = useSession() 
  const CDNURL = 'https://dqppsiohkcussxaivbqa.supabase.co/storage/v1/object/public/files/UsersProfilePicture/';
  const CDNCourseURL = 'https://dqppsiohkcussxaivbqa.supabase.co/storage/v1/object/public/files/Course/';
  if (status === "unauthenticated") {
    alert("No has iniciado sesión");
    // router.push('/')
  }
  
  useEffect(() => {
    if(session) {
      setUserId(session?.user?.user_id)
    }
  }, [session])

  const fetcher = (arg: any, ...args: any) => fetch(arg, ...args).then(res => res.json())
  const { data: studentEnrollment, error, isLoading } = useSWR(`/api/getMyCoursesStudent/${courses.course_id}` , fetcher)
  const { data: studentCourseEnrollments } = useSWR(`/api/enrollmentCourse/${courses.course_id}` , fetcher)
  
  const [notification, setNotification] = useState<NotificationType>({
    isOpen: false,
    type: null,
    content: "",
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
      setMounted(true)
  }, [])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");
    if (status === "approved") {
      setNotification({
        content: "Pago aprobado!",
        isOpen: true,
        type: "approved",
      });
      toast.success('Pago aprobado con exito! Bienvenido al curso')
    } else if (status === "failure") {
      setNotification({
        content: "Pago fallido!",
        isOpen: true,
        type: "failure",
      });
      toast.error('Pago fallido, intente nuevamente')
    } else if (status === "rejected") {
      setNotification({
        content: "Pago rechazado!",
        isOpen: true,
        type: "failure",
      });
      toast.error('Pago rechazado, intente nuevamente')
    }

    setTimeout(() => {
      setNotification({
        isOpen: false,
        type: null,
        content: "",
      });
    }, 5000);
  }, []);

  const handleCourseFree = async () => {
    if (session?.user?.user_id === courses.user_id) {
      toast.error('No puedes inscribirte a tu propio curso')
      return;
    }

    if(courses.branch_offices.people_capacity <= studentCourseEnrollments.length ) {
      toast.error('No hay cupos disponibles')
      return;
    }
    
    const request = await axios.post('/api/enrollmentCourse', {
        course_id: courses.course_id,
        user_id: session?.user?.user_id,
        enrollment_date: new Date(),
        isFree: true,

    })

    console.log(await request.data)
    if (!request) {
      console.log('Error al inscribirse al curso')
      return;
    }
    toast.success('Inscripción exitosa')
    mutate(`/api/getMyCoursesStudent/${courses.course_id}`)
  }
    initMercadoPago(process.env.MERCADOPAGO_API_KEY!)
    //Destructuracion de datos
    const {course_name, description_course, price_course, user_id, start_date, end_date, description, isFree, isVirtual, usser, files} = courses;
    console.log(files);

    const {branch_name, people_capacity, branch_address} = courses.branch_offices;
    const {files: fileUser} = usser;
    const {category_name, file_category} = courses.category_course;
    const {day_of_week, start_time, end_time} = schedules;
    const {first_name, last_name} = usser;

    const startDate = parseISO(start_date);
    const endDate = parseISO(end_date);
    
    const formattedStartDate = format(startDate, "'Comienza el' d 'de' MMMM", { locale: es });
    const formattedEndDate = format(endDate, "' - Finaliza el' d  MMMM", { locale: es });
    const date = `${formattedStartDate} ${formattedEndDate}`;
    const currentDate = new Date();

    const discountedPrice =
  courses.discount_percentage > 0 &&
  isAfter(currentDate, new Date(courses.start_date_discount)) &&
  isBefore(currentDate, new Date(courses.end_date_discount))
    ? price_course - (price_course * courses.discount_percentage) / 100
    : price_course;

    return   (
      <div>
      {mounted &&
      <Grid container spacing={4} className="flex course-container shadow-2xl rounded-lg p-8">
          <Grid item xs={12} md={8}>
          {
        courses.branch_offices?.people_capacity <= studentCourseEnrollments?.length ? (
          <Alert variant="filled" severity="info">Curso lleno</Alert>
      ) : (
        null
      )}
            <Paper className="p-4">
              <Box className="relative">
                <Typography variant="h2" className="text-4xl font-bold mb-8 relative text-white">
                  {/* <span className="absolute bg-white bottom-0 left-0 h-px w-full"></span> */}
                  <span>Nombre: {course_name}</span>
                </Typography>
                <Typography variant="h3" className="text-xl font-bold mb-4 text-white ">
                  Categoría: {category_name}
                </Typography>
                <Box className="mt-8">
                  <Typography variant="h3" className="text-2xl font-bold mb-4 text-white">
                    Modalidad del cursado:
                  </Typography>
                  <Card className="flex items-center p-4 border">
                    {isVirtual ? (
                      <DesktopMac className="text-white h-8 w-8 mr-2" />
                    ) : (
                      <LocationOn className="text-white h-8 w-8 mr-2" />
                    )}
                    <Typography className="text-white">
                      {isVirtual ? ' Virtual' : 'Presencial'}
                    </Typography>
                  </Card>
                </Box>
              </Box>
              <Typography variant="h4" className="text-lg font-bold mb-2 py-2 text-white">
                Descripción del curso:
              </Typography>
              <Typography className="border border-white p-4 text-white">
                {description_course}
              </Typography>
              <Box className="mt-8">
                <Typography variant="h3" className="text-2xl font-bold mb-4 text-white">
                  Lo que vas a aprender en este curso:
                </Typography>
                <Card className="border border-white p-4">
                  <CardContent>
                    <ul className="list-disc list-inside text-white">
                      {description? description.map((item: any, index: any) => (
                        <li key={index} className="text-lg">
                          {item}
                        </li>
                      )): null}
                    </ul>
                  </CardContent>
                </Card>
              </Box>
              <Box className="mt-8">
                <Typography variant="h3" className="text-2xl font-bold mb-4 text-white">
                  Certificados ofrecidos:
                </Typography>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <Card className="flex flex-col items-center justify-center p-4">
                      <Image src={OmeCertificate} alt="Logo 1" width={100} height={100} />
                      <Typography className="text-white">Certificado Internacional OME</Typography>
                      <Typography className="text-gray-300 text-sm">
                      OMEE es una organización internacional que se concibe, nace y desarrolla desde una perspectiva de gestión global en Argentina, se expandió a Latinoamérica y creció en el mundo. Cubrió desde sus inicios el vacio de una base y registro de profesionales del mundo de la Belleza. Estudiantes y profesionales corporizan los valores y la excelencia académica impartida que día a día trabajamos por brindar. OMEE esta conformada por personal Academico internacional, la cual imparten las tendencias para competir en el mercado
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card className="flex flex-col items-center justify-center p-4">
                      <Image src={SevillaCertificate} alt="Logo 3" width={100} height={100} />
                      <Typography className="text-white">Certificado Grupo Sevilla</Typography>
                      <Typography className="text-gray-300 text-sm">
                      Asociación Civil Argentina GRUPO SEVILLA, autorizada a funcionar como Persona Jurídica, según Resol.: 950/2019 (Dirección de Personas Jurídica y Registro Público de la Provincia de Mendoza).
                      Es una Entidad Educativa, que nuclea a instituciones educativas privadas, tanto argentinas como extranjeras, asentadas en una base de datos general de toda la red que la compone, brindando acompañamiento institucional y otorgando formales CERTIFICACIONES ACREDITANTES, siendo estas de alcance Nacional o Internacional, según sea el caso. 
                      </Typography>
                    </Card>
                  </Grid>
                  
                </Grid>
              </Box>
              <Box className="mt-8">
                <Typography variant="h3" className="text-2xl font-bold mb-4 text-white">
                  Duración del curso:
                </Typography>
                <Card className="flex items-center p-4">
                  <Schedule className="text-white h-8 w-8 mr-2" />
                  <Typography className="text-white">{date}</Typography>
                </Card>
              </Box>
              {/* <Box className="mt-8">
                <Typography variant="h3" className="text-2xl font-bold mb-4 text-white">
                  Horarios de la cursada:
                </Typography>
                <Grid container spacing={4}>
                  {schedules? schedules.map((item: any, index: any) => (
                    <Grid key={index} item xs={12} sm={4}>
                      <Card className="flex items-center p-4">
                        <Schedule className="text-white h-8 w-8 mr-2" />
                        <Typography className="text-white">{item.day_of_week}: {item.start_time} - {item.end_time}</Typography>
                      </Card>
                    </Grid>
                  )): null}
                </Grid>
              </Box> */}
              <Box className="mt-8">
                <Typography variant="h3" className="text-2xl font-bold mb-4 text-white">
                  Información de contacto:
                </Typography>
                <Grid container spacing={4}>
                  <Grid item xs={6} sm={3}>
                    <Card className="flex flex-col items-center justify-center p-4">
                      <WhatsApp className="text-white h-12 w-12" />
                      <Typography className="text-white">WhatsApp: +3764117177</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card className="flex flex-col items-center justify-center p-4">
                      <Email className="text-white h-12 w-12" />
                      <Typography className="text-white">Email: academiaal@gmail.com</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card className="flex flex-col items-center justify-center p-4">
                      <Instagram className="text-white h-12 w-12" />
                      <Typography className="text-white">Instagram: @academia_AL_instagram</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card className="flex flex-col items-center justify-center p-4">
                      <Facebook className="text-white h-12 w-12" />
                      <Typography className="text-white">Facebook: @Academia_Al_facebook</Typography>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper className="p-4">
              <Box className="flex flex-col items-center">
                <Image src={fileUser[0] ?  CDNURL + fileUser[0].name : '/images/defaultProfile.jpg'} alt="Instructor" width={200} height={200} className="rounded-full" />
                <Typography variant="h3" className="text-2xl font-bold mt-4 mb-2 text-white">
                  Instructor: {first_name} {last_name}
                </Typography>
                <Typography className="text-white text-center">{}</Typography>
              </Box>
              <Image
                  src={files ? CDNCourseURL + files.name: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Q3Vyc28lMjBkZWZhdWx0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'}
                  alt="img"
                  width={800}
                  height={800}
                />
            </Paper>
          <Box className="mt-8">
            <Typography variant="h3" className="text-2xl font-bold mb-4 text-white">
            {courses.discount_percentage > 0 && isAfter(currentDate, new Date(courses.start_date_discount)) && isBefore(currentDate, new Date(courses.end_date_discount)) ? (
              <Typography variant="h3" className="text-2xl font-bold mb-4 text-white">
              <span className="text-gray-300 line-through pr-2">
                Precio: {price_course}$ ARS
              </span>
              Precio con descuento: {(
                price_course - (price_course * courses.discount_percentage) / 100
              ).toFixed(2)}$ ARS
            </Typography>
            ) : (
              <Typography variant="h3" className="text-2xl font-bold mb-4 text-white">
              Precio: {price_course}$ ARS
            </Typography>
            )}
            </Typography> 
          {courses.isFree ? (
            <Card className="flex items-center p-4">
              <CheckCircle className="text-white h-8 w-8 mr-2" />
              <Typography className="text-white">Curso gratuito</Typography>
            </Card>
          ) : (
            <Card className="flex items-center p-4">
              <AttachMoney className="text-white h-8 w-8 mr-2" />
              {courses.discount_percentage > 0 &&
              isAfter(currentDate, new Date(courses.start_date_discount)) &&
              isBefore(currentDate, new Date(courses.end_date_discount)) ? (
                <Typography className="text-white">
                  <span className="text-gray-300 line-through pr-2">
                    Precio: {price_course}$ ARS
                  </span>
                  Precio con descuento: {(
                    price_course - (price_course * courses.discount_percentage) / 100
                  ).toFixed(2)}$ ARS
                </Typography>
              ) : (
                <Typography className="text-white">
                  Precio: {price_course}$ ARS
                </Typography>
              )}
            </Card>
          )}
        </Box>
            <Box className="mt-8">
              {isFree === true ? (
                <Button
                  variant="outlined"
                  color="success"
                  className="py-2 px-4 rounded-full text-green-300 font-bold  "
                  onClick={handleCourseFree}
                  disabled={studentEnrollment}
                >
                  {studentEnrollment ? "Ya estas Inscripto" : "¡Inscríbete ahora!"}
                  
                </Button>
              ) : userId !== '' ? (
                <div id="wallet_container">
                  <MercadoPagoButton course={courses} studentEnrollment={studentEnrollment} user_id={userId} discountedPrice={discountedPrice}/>
                </div>
              ): (
                'cargando...'
              )}
          </Box>
          {notification.isOpen && (
        <div className="notification">
          <div
            className="iconContainer" 
            style={{
              backgroundColor:
                notification.type === "approved" ? "#00cc99" : "#ee4646",
            }}
          >
            <Image
              src={`/assets/${notification.type}.svg`}
              alt={notification.type!}
              width={25}
              height={25}
            />
          </div>
          <p>{notification.content}</p>
        </div>
      )}
        </Grid>
      </Grid>
      }
      </div>
    );
    
}
export default ViewCourse


