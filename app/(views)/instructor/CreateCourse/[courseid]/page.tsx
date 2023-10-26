'use client'
import Header from '@/app/components/Header/header';
import { Box, Button } from '@mui/material'
import React, { ChangeEvent, FormEvent, use, useEffect, useState } from 'react'
import Image from 'next/image'
import { toast } from 'react-hot-toast';
import useSWR, { mutate } from 'swr';
import { useRouter } from 'next/navigation';

  function CourseUploadImage({params} : any) {
  const [file, setFile] = useState<File | undefined>();
  const [image, setImage] = useState<File | undefined>();
  const [loading, setLoading] = useState(false);
  const route = useRouter();
  const {courseid} = params
  const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = useSWR(`/api/createCourse/${courseid}`, fetcher );

  useEffect(() => {
    if (!data) return;
    setImage(data);
  }, [data]);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    if(image) {
      try {
        const data = new FormData();
        data.set("file", file);

        const res = await fetch(`/api/createCourse/${courseid}`, {
          method: "PUT",
          body: data,
        });

        if (res.ok) {
          toast.success('Imagen del Curso Actualizada correctamente');
          mutate(`/api/createCourse/${courseid}`);
          route.push(`/instructor/MyCourses`);
          console.log("File uploaded successfully");
        }
      } catch (error) {
        toast.error('Error al actualizar la imagen del curso');
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else if (!image) {
      try {
        const data = new FormData();
        data.set("file", file);

        const res = await fetch(`/api/createCourse/${courseid}`, {
          method: "POST",
          body: data,
        });
        console.log(res);

        if (res.ok) {
          toast.success('Imagen del Curso Subida correctamente');
          route.push(`/instructor/MyCourses`);
        }
      } catch (error) {
        toast.error('Error al subir la imagen del curso');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setFile(e.target.files?.[0]);
  };


  return (
    <Box m="20px">
      <Header
        title="Imagen del Curso"
        subtitle="Subir imagen del curso"
      />
      <div>
      <form onSubmit={handleSubmit}>
      <input
            type="file"
            className="bg-zinc-900 text-zinc-100 p-2 rounded block mb-2"
            onChange={handleFileChange}
          />
          <button
            className="bg-green-900 text-zinc-100 p-2 rounded block w-full disabled:opacity-50"
            disabled={!file || loading}
          >
            {image ? "Cambiar Imagen" : "Subir Imagen"}
          </button>
      </form>
      {file ? (
          <Image
            src={URL.createObjectURL(file)}
            alt="Uploaded Certificate"
            className="w-64 h-64 object-contain mx-auto"
            width={2000}
            height={500}
          />
       ) : image && (
        <Image
        src={`${process.env.NEXT_PUBLIC_CDN}/Course/${data.name}`}
        alt="Imagen Curso"
        className="w-64 h-64 object-contain mx-auto"
        width={2000}
        height={500}
      />
        )}
     
    </div>
    </Box>
  )
}


export default CourseUploadImage


