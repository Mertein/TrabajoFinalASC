'use client'
import React, { ChangeEvent, FormEvent, use, useEffect, useState } from 'react';
import { Button, Container, Modal, Box, TextField, InputAdornment } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import useSWR, {mutate} from 'swr';
import { toast } from 'react-hot-toast';
import 'video.js/dist/video-js.css';
import FilePreview from '../FilePreview/FilePreview';
import { useSession } from 'next-auth/react';
import { format, addDays} from 'date-fns';

interface Class {
  class_id: number;
  name: string;
  description_class: string;
  files: Files[];
  isVirtual: boolean;
}

interface Files {
  class_id: number;
  id: number;
  identifier: string;
  title: string;
  name: string;
  path: string;
  size: number;
  type: string;
}

interface Note {
  grade_id: number;
  value: number;
  enrollment_id: number;
  created_at: string;
  deleted_at?: any;
  updated_at: string;
}

function ClassCourse({ courses }: any) {
  const {data: session, status} = useSession();
  const fetcher = (arg: any, ...args: any) => fetch(arg, ...args).then(res => res.json())
  const { data: Classes, error, isLoading } = useSWR(`/api/class/${courses.course_id}`,  fetcher)
  const { data: Grade, error: errorGrade, isLoading: isLoadingGrade} = useSWR(`/api/MyEnrollmentGrade/${courses.course_id}`, fetcher)
  const [expandedClassId, setExpandedClassId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInstructorMode, setIsInstructorMode] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [file, setFile] = useState<File | undefined>();
  const [fileTitle, setFileTitle] = useState('');
  const [classDescription, setClassDescription] = useState('');
  const [classCount, setClassCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const CDNURL = 'https://dqppsiohkcussxaivbqa.supabase.co/storage/v1/object/public/files/ClassesCourse/';
  useEffect(() => {
    if (Classes) {
      setClasses(Classes);
    }
    if(Grade) {
      setNotes(Grade);
    }
  }, [Classes]);
 
  const [notes, setNotes] = useState<Note>({
    grade_id: 0,
    value: 0,
    enrollment_id: 0,
    created_at: '',
    deleted_at: '',
    updated_at: '',
  });

  const router = useRouter();
  const currentPath = usePathname();

  const handleClassClick = (classId: number) => {
    if (expandedClassId === classId) {
      setExpandedClassId(null);
    } else {
      setExpandedClassId(classId);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleToggleInstructorMode = () => {
    setIsInstructorMode(!isInstructorMode);
  };

  const handleAddNewClass = async () => {
    const confirmed = window.confirm('¿Estás seguro de agregar una nueva clase?');
    if (confirmed) {
      try {
        const response = await axios.post(`/api/class/${courses.course_id}`);
        if (response.data) {
          mutate(`/api/class/${courses.course_id}`);
          const addedClass = response.data;
          const newTitle = `Clase ${classCount}`;
          addedClass.title = newTitle; // Agregar el título a la nueva clase
          console.log('addedClass', addedClass)
          setClasses((prevClasses) => [...prevClasses, addedClass]);
          setClassCount((prevCount) => prevCount + 1);
        } else {
          console.error('Error al agregar la clase');
        }
        console.log(response.data)
        
      } catch (error) {
        console.error('Error al agregar la clase:', error);
      }
    }
  };

  const handleRemoveClass = async (classId: number) => {
    const confirmed = window.confirm('¿Estás seguro de eliminar esta clase?');
    const updatedClasses = classes.filter((clase) => clase.class_id !== classId);
    if (confirmed) {
      setClasses(updatedClasses);
    }
    try {
    if (confirmed) {
    await axios.delete(`/api/class/${classId}`);
    const updatedClassesWithCoherence = updatedClasses.map((clase, index) => ({
      ...clase,
      id: index + 1,
      name: `Clase ${index + 1}`,
    }));
    setClasses(updatedClassesWithCoherence);
    }  
  } catch (error) {
      console.error('Error al eliminar la clase:', error);
    }
  };
  
  const handleClassVirtualToggle = () => {

    const updatedClasses = classes.map((clase) => {
      if (clase.class_id === expandedClassId) {
        return {
          ...clase,
          isVirtual: !clase.isVirtual,
        };
      }
      return clase;
    });

    const modifiedClass = updatedClasses.find((clase) => clase.class_id === expandedClassId);
    const class_id = modifiedClass?.class_id;
    const isVirtual = modifiedClass?.isVirtual;
    axios
      .put(`/api/class`, { class_id, isVirtual })
      .then((response) => {
        if(response) {
          mutate(`/api/class/${courses.course_id}`);
          toast.success('Cambios guardados correctamente');
          console.log('Cambios guardados correctamente');

        }
      })
      .catch((error) => {
        console.error('Error al cambiar el formato del cursado de la clase:', error);
        toast.error('Error al cambiar el formato del cursado de la clase');
      });
    setClasses(updatedClasses);
  };

  const handleFileLabelChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fileId: number) => {
    const updatedClasses = classes.map((clase) => {
      if (clase.class_id === expandedClassId) {
        const updatedFiles = clase.files.map((file) => {
          if (file.id === fileId) {
            return {
              ...file,
              title: event.target.value,
            };
          }
          return file;
        });
        return {
          ...clase,
          files: updatedFiles,
        };
      }
      return clase;
    });
    setClasses(updatedClasses);
  };

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 1 GB in bytes
  const allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'video/mp4', 'video/x-matroska'];

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) {
      setFile(undefined); // Limpiar el estado file
      return;
    }

    const selectedFile = e.target.files[0];

    if (selectedFile.size > MAX_FILE_SIZE) {
      alert('El archivo es demasiado grande. El tamaño máximo permitido es 50MB.');
      setFile(undefined); // Clear the file state
      return;
    }

    if (allowedFileTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      alert('Tipo de Archivo Invalido. Se permiten archivos de tipo: PDF, JPEG, PNG, GIF, DOC, DOCX');
      setFile(undefined); // Clear the file state
    }
  };

  const handleRemoveFile = async (classId: number, fileId: number) => {
    const confirmed = window.confirm('¿Estás seguro de eliminar este archivo?');    
    if (confirmed) {
     setLoading(true);
      try {
        const response = await axios.delete(`/api/class/${classId}/files/${fileId}`);
        if(response) {
          toast.success('Se elimino el archivo correctamente');
          mutate(`/api/class/${courses.course_id}`);
        }
      } catch (error) {
        toast.error('No se pudo Eliminar el Archivo');
        console.error('Error al eliminar el archivo:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUploadFiles = async (e: FormEvent<HTMLFormElement>, class_id: string | Blob) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    try {
      const data = new FormData();
      data.set("file", file);
      data.append("class_id", class_id);
      data.set("title", fileTitle);
      const response = await fetch("/api/class", {
        method: "POST",
        body: data,
      });
      console.log(response);
      if(response.status === 200) {
        mutate(`/api/class/${courses.course_id}`);
        toast.success('Se subio el archivo correctamente');
      }
      setFileTitle('');
    } catch (error) {
      toast.error('Error al agregar los archivos a la clase, faltan los archivos');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFileTitle = (classId: number, fileId: number, title: string) => {
    setLoading(true);      
    axios
      .put(`/api/class/`, 
      {
        classId,
        fileId,
        title,
      })
      .then((response) => {
        if(response) {
          mutate(`/api/class/${courses.course_id}`);
          toast.success('Se guardaron los cambios correctamente');
        }
      })
      .catch((error) => {
        toast.error('Error al guardar los cambios del título:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClassDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedClasses = classes.map((clase) => {
      if (clase.class_id === expandedClassId) {
        return {
          ...clase,
          description_class: event.target.value,
        };
      }
      return clase;
    });
    setClasses(updatedClasses);
    setClassDescription(event.target.value);
  };
  
  const handleSaveClassDescription = (classId: number) => {
    setLoading(true);
    axios
      .put(`/api/class`, { description_class: classDescription, classId })
      .then((response) => {
        // Realiza cualquier acción necesaria después de guardar los cambios
        toast.success('Se guardaron los cambios correctamente');
        mutate(`/api/class/${courses.course_id}`);
      })
      .catch((error) => {
        console.error('Error al guardar los cambios de la descripción:', error);
        toast.error('Error al guardar los cambios de la descripción');
      }).finally(() => {
        setLoading(false);
      });
  };

 const startDateTimestamp = courses.start_date; 
 const endDateTimestamp = courses.end_date; 

  function obtenerFechaEnEspañol(timestamp : any) {
    const fecha = new Date(timestamp);
    fecha.setDate(fecha.getDate() + 1); 
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return fecha.toLocaleDateString('es-ES', options as any);
  }

  const formattedStartDate = obtenerFechaEnEspañol(startDateTimestamp);
  const formattedEndDate = obtenerFechaEnEspañol(endDateTimestamp);
  return (
    <Box className="border border-gray-300 rounded-sm p-4 m-10">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box className="border-collapse border-gray-300 ">
          <h2 className="text-3xl font-bold text-center">Horarios de Cursada </h2>
          <ul className="text-sm text-left">
            {classes.map((clase: any) => (
              // clase.schedules.map((schedule: any) => (
              //   <li key={schedule}>{schedule.start_time} - {schedule.end_time}</li>
              // ))
              <span key={clase.schedules}>
              {clase.schedules[0].start_time} - {clase.schedules[0].end_time} <br />
              </span>
            ))}
            <>
              <li key={courses}> Inicio: {formattedStartDate}</li>
              <li> Fin: {formattedEndDate}</li>
            </>
          </ul>
        </Box>
        <Box className="mb-14">
          <h2 className="text-lg font-bold">Direccion de la Sucursal</h2>
          <p className="text-sm">Nombre: {courses.branch_offices.branch_name}</p>
          <p className="text-sm">Direccion: {courses.branch_offices.branch_address}</p>
        </Box>
      </Box>
      <Container maxWidth="lg" className="pt-40">
        <h2 className="text-3xl font-bold mb-8 text-center">{courses.course_name}</h2>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={8}>
          <h4 className="text-2xl font-bold">Clases del Curso</h4>
          {!currentPath.includes('/student') && (
          <Button
            variant="contained"
            color="secondary"
            className="bg-indigo-500 text-white px-4 py-2 rounded-md"
            onClick={handleToggleInstructorMode}
          >
            {isInstructorMode ? 'Vista Alumno' : 'Modo Instructor'}
          </Button>
          )}
        </Box>
        {classes? classes.map((clase : any, index: number) => (
          <Box key={clase.class_id} className="border border-gray-200 rounded-sm mb-6">
            <Box
              className="flex-1 justify-between items-center cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={() => handleClassClick(clase.class_id)}
            >
                {format(addDays(new Date(clase.schedules[0].date), 1), 'dd/MM/yyyy')} {clase.schedules[0].start_time} - {clase.schedules[0].end_time}

               <h6 className="text-lg font-semibold mb-2">{`Clase ${index + 1}`}</h6>
               {!isInstructorMode &&  clase.isVirtual && (
                <span className="text-xs bg-yellow-500  text-white rounded-md px-2 py-1 items-end ">Virtual</span>
              )}
                {!isInstructorMode && !clase.isVirtual && (
                <span className="text-xs bg-green-500 text-white rounded-md px-2 py-1">Presencial</span>
              )}
              {isInstructorMode &&  clase.isVirtual && (
                <span className="text-xs bg-yellow-500  text-white rounded-md px-2 py-1 items-end ">Virtual</span>
              )}
              {isInstructorMode && !clase.isVirtual && (
                <span className="text-xs bg-green-500 text-white rounded-md px-2 py-1">Presencial</span>
              )}
               {/* {isInstructorMode && (
                  <Button
                    variant="contained"
                    color="secondary"
                    className="bg-red-500 text-white px-2 py-1 rounded-md ml-2"
                    onClick={() => handleRemoveClass(clase.class_id)}
                  >
                    Eliminar Clase
                  </Button>
                )} */}
            </Box>
            {expandedClassId === clase.class_id && (
              <Box className="px-4 py-2">
                {isInstructorMode ? (
                  <>
                    <TextField
                      label="Descripción de la Clase"
                      variant="filled"
                      className="mb-4"
                      fullWidth
                      size='medium'
                      value={clase.description_class}
                      onChange={handleClassDescriptionChange}
                      multiline
                      rows={4}
                      inputProps={{
                        maxLength: 255,
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {`${clase.description_class.length}/${255}`} 
                          </InputAdornment>
                        ),
                      }}
                      
                    />
                    <Button variant='contained' disabled={!classDescription || loading} className='bg-red-500' color='info'  onClick={() => handleSaveClassDescription(clase.class_id)}>Guardar Descripcion</Button>
                     <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        checked={clase.isVirtual}
                        onChange={handleClassVirtualToggle}
                        id={`virtualToggle-${clase.class_id}`}
                        className="mr-2"
                      />
                      <label htmlFor={`virtualToggle-${clase.class_id}`} className="text-sm">
                        Clase Virtual
                      </label>
                    </div>
                    {clase.files.length > 0 && (
                      <>
                        <h6 className="text-2xl font-semibold mb-2">Archivos:</h6>
                        {clase.files.map((file: any) => (
                          <Box key={file.id} className="flex-col items-center mb-2">
                            <TextField
                              label="Título del Archivo"
                              variant="filled"
                              size="medium"
                              fullWidth
                              className="mb-1 mr-2 flex"
                              value={file.title}
                              onChange={(event) => handleFileLabelChange(event, file.id)}
                              inputProps={{
                                maxLength: 100,
                              }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position='end'>
                                    {`${file.title.length}/${100}`}
                                  </InputAdornment>
                                )
                              }}
                            />
                            <FilePreview file={file} />
                           
                            <a href={ CDNURL + file.name} className="text-blue-500" download={CDNURL + file.name}>
                               Descargar {file.name}
                            </a>
                            {file.class_id === clase.class_id && (
                              <button
                                className="bg-red-500 text-white px-2 py-1 rounded-md ml-2 hover:bg-red-700  disabled:bg-gray-400 disabled:cursor-not-allowed"
                                onClick={() => handleRemoveFile(clase.class_id, file.id)}
                                disabled={loading}
                              >
                                Eliminar
                              </button>
                            )}
                            <button
                              className="bg-indigo-500 text-white px-2 py-1 rounded-md ml-2 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                              onClick={() => handleSaveFileTitle(clase.class_id, file.id, file.title)}
                              disabled={loading}
                            >
                              Guardar
                            </button>
                          </Box>
                        ))}
                    </>
                    )}
                    <form onSubmit={(e) => handleUploadFiles(e, clase.class_id)}>
                  
                    <Box className="flex-col p-10 text-end space-y-2 ">
                    <div className="flex space-x-2 items-center">
                      <TextField
                        label="Título del Archivo"
                        variant="filled"
                        fullWidth
                        size="small"
                        value={fileTitle}
                        onChange={(e) => setFileTitle(e.target.value)}
                        className="mb-0 mr-2 flex"
                        inputProps={{
                          maxLength: 100,
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {`${fileTitle.length}/${100}`}
                            </InputAdornment>
                          ),
                        }}
                      />
                       </div>
                       <div className="flex space-x-2 items-center">
                        <input
                        type="file"
                        onChange={handleFileInputChange}
                        className="mr-2  flex"
                      />
                      <button
                        type="submit"
                        className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-400 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={!file || !fileTitle || loading}
                      >
                        Subir archivo
                      </button>
                      </div>
                    </Box>
                    </form>
                  </>
                ) : (
                  <><h1 className='text-2xl font-serif font-bold'>Descripción de la Clase:</h1>
                    <p className='text-lg break-words'>{clase.description_class}</p>
                    {clase.files.length > 0 && (
                      <>
                        <h6 className="text-2xl font-bold mt-4">Archivos:</h6>
                        {clase.files.map((file : any) => (
                          <Box key={file.id} className="flex flex-col mb-2 text-xl">
                            <span className="mb-1">{file.title}:</span>
                           
                            <FilePreview file={file} />

                            <a href={ CDNURL + file.name} className="text-blue-500" download={CDNURL + file.name}>
                               Descargar {file.name}
                            </a>
                          </Box>
                        ))}
                      </>
                    )}
                  </>
                )}
                
              </Box>
            )}
          </Box>
        )) : null}
        {/* {isInstructorMode && (
          <Button
            variant="contained"
            color="primary"
            className="bg-purple-500 text-white px-4 py-2 rounded-md"
            onClick={handleAddNewClass}
          >
            Agregar Nueva Clase
          </Button>
        )} */}
        {!currentPath.includes('/instructor') && (
        <Box mt={12}>
          <h4 className="text-2xl font-bold mb-4">Mis notas</h4>
          <Button
            variant="outlined"
            color="primary"
            className="text-white bg-pink-700"
            onClick={handleOpenModal}
          >
            Ver mi Nota
          </Button>
        </Box>
      )}
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          className="flex justify-center items-center"
        >
       
          <Box className="bg-green-200 p-4">
            <h4 className="text-xl font-bold mb-4 text-black">Nota del alumno</h4>
              <Box  className="mb-4">
                <h5 className="text-lg font-semibold text-black">{notes.value ? notes.value : 'Aun no has sido calificado'}</h5>
              </Box>
          </Box>
    
        </Modal>
      </Container>
    </Box>
  );
}

export default ClassCourse;