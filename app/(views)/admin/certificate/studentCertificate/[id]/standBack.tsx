// 'use client'
// import React, { useState, useRef, useEffect, ChangeEvent, MouseEvent} from "react";
// import { exportComponentAsJPEG, exportComponentAsPDF, exportComponentAsPNG } from "react-component-export-image";
// import './style.css'
// import {Staatliches} from '@next/font/google'
// import useSWR from "swr";
// import certificate from '../../../../../../public/images/certificate.jpg'
// import toast from "react-hot-toast";
// import Image from 'next/image'
// import html2canvas from "html2canvas";



// const staatliches = Staatliches({
//   subsets: ['latin'],
//   weight: ['400'],

// })
// const App = ({params} : any) => {
//   const certificateWrapperRef = useRef(null);
//   const [url, setUrl] = useState("");
//   const fetcher = (arg: any, ...args: any) => fetch(arg, ...args).then(res => res.json())
//   const { data, error, isLoading } = useSWR(`/api/enrollmentCourseID/${params.id}`, fetcher)


//   useEffect(() => {
//     if (data && data.course.usser.files[0].path !== '') {
//         const pathWithoutPublic = data.course.usser.files[0].path.replace('public', '');
//         // Mostrar la imagen utilizando la función Image de Next.js
//         setUrl(pathWithoutPublic + data.course.usser.files[0].name);
//     }
// }, [data]);
//   const endDateTimestamp = data?.course?.end_date;
//   const endDate = new Date(endDateTimestamp);
//   const month = endDate.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por eso sumamos 1
//   const year = endDate.getFullYear();

//   const generateUniqueFileName = () => {
//     const timestamp = Date.now();
//     return `certificate_${timestamp}.jpg`;
//   };


//   const handleGrant = async (e : any) => {
//     e.preventDefault();
//     try {
//       const canvas = await html2canvas(certificateWrapperRef.current, {
//         backgroundColor: null,
//       });
//       // Convert the canvas to a Blob
//       const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve));
//       const fileName = generateUniqueFileName();
//       if (!blob) {
//         return;
//       }
//       // Create a new File object from the Blob
//       const file = new File([blob], fileName, { type: "image/jpg"});
//       if (file) {
//         // Create a FormData object and append the File to it
//         const formData = new FormData();
//         formData.append("file", file);
//         formData.set('user_id', data?.user_id)

//         // Send the FormData to the backend using a POST request
//         const response = await fetch("/api/certificate/grantStudentCertificate", {
//           method: "POST",
//           body: formData,
//         });

//         if (response.ok) {
//           // Show a success notification or message here
//           toast.success('The certificate has been granted and saved successfully.');
//         } else {
//           throw new Error("Failed to save the certificate on the backend.");
//         }
//       } else {
//         throw new Error("Certificate image not available. Please generate it first.");
//       }
//     } catch (error) {
//       console.error(error);
//       // Show an error notification or message here
//       toast.error('Error granting the certificate. Please try again.');
//     }
//   };


  
  
 
  
//   return (
//     <div className="App">
//       <div className="Meta">
//         <h1>Certificados</h1>
//         <label>Nombre del Estudiante</label>
//           <input
//             type="text"
//             value={`${data?.usser?.first_name} ${data?.usser?.last_name}`}
//             disabled={true}
//           />
//         <label>DNI</label>
//           <input
//             type="text"
//             value={data?.usser?.dni}
//             disabled={true}
//           />
//         <label>Curso</label>
//           <input
//             type="text"
//             value={data?.course?.course_name}
//             disabled={true}
//           />
//         <label>Categoria</label>
//         <input
//           type="text"
//           value={data?.course?.category_course.category_name}
//           disabled={true}
//         />
//       </div>


//       <div id="downloadWrapper" ref={certificateWrapperRef}>
//         <div id="certificateWrapper">
          
//           <Image  src={certificate.src} alt="Certificate" width={2000} height={500} 
//           />
//               <div className={staatliches.className} id='name'>{data?.usser?.first_name} {data?.usser?.last_name}</div>
//           <div className={staatliches.className} id='dni'>{data?.usser?.dni}</div>
//           {/* <div className={staatliches.className} id='course'>{data?.course?.course_name}</div> */}
//           <div className={staatliches.className} id='category'>{data?.course?.category_course.category_name}</div>
//           <div className={staatliches.className} id='instructor'>{data?.course?.usser?.first_name} {data?.course?.usser?.last_name}</div>
//           <div className={staatliches.className} id='month'>{month}</div>
//           <div className={staatliches.className} id='year'>{year}</div>
//           <div className={staatliches.className} id='signature'><img src={url} alt='certificatesss'  /></div>

//         </div>
      
//       </div>

//       <div className="flex flex-1">
//       <button onClick={() => exportComponentAsJPEG(certificateWrapperRef)}>
//         Export As JPEG
//       </button>
//       <button onClick={() => exportComponentAsPDF(certificateWrapperRef)}>
//         Export As PDF
//       </button>
//       <button onClick={() => exportComponentAsPNG(certificateWrapperRef)}>
//         Export As PNG
//       </button>
//       </div>

//       <button onClick={handleGrant}>Grant Certificate</button>
//     </div>
//   );
// };

// export default App;



