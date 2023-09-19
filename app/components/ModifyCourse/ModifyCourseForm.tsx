'use client'
import React, {useEffect, useState } from "react";
import {
  FormControlLabel,
  Box,
  Button,
  FormControl,
  InputLabel,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  IconButton,
  InputAdornment,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import Header from "../Header/header";
import { Close as CloseIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

interface ModifyCourseFormProps {
  initialCourseData: any;
  categories: any[];
  branchOffices: any[];
}

interface CourseFormValues {
  course_name: string;
  description_course: string;
  price_course: number;
  isFree: boolean 
  category_id: any;
  id_branch: any;
  start_date: string; 
  description: string[];
  end_date: string 
  schedule: ScheduleType[] 
  scheduleLength: number;
  course_id: number;
}

interface ScheduleType {
  shedule_id?: number;
  date: string;
  start_time: string;
  end_time: string;
  class_id?: number;
}

const ModifyCourseForm: React.FC<ModifyCourseFormProps> = ({
  initialCourseData,
  categories,
  branchOffices,
}) => {
  const [descriptionFields, setDescriptionFields] = useState<string[]>([]);
  const route = useRouter();
  const [schedule, setSchedule] = useState<ScheduleType[]>([]);
  
  const isNonMobile = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    const classes = initialCourseData.class_course;
    const schedulesArray = [];

    for (const classData of classes) {
      const schedules = classData.schedules;
      for (const scheduleData of schedules) {
        // Agregar cada horario al array
        schedulesArray.push({
          class_id: classData.class_id,
          date: scheduleData.date,
          start_time: scheduleData.start_time,
          end_time: scheduleData.end_time,
          schedule_id: scheduleData.shedule_id,
        });
      }
    }

    setSchedule(schedulesArray);

    if (initialCourseData && initialCourseData.description) {
      setDescriptionFields(initialCourseData.description);
    }
  }, []);

  const handleFormSubmit = async (data : CourseFormValues) => {  

    if(data.isFree === false && data.price_course === 0){
      return toast.error('El precio del curso no puede ser 0 si no es gratuito.');
    }

    const courseStartDate = new Date(data.start_date);
    const courseEndDate = new Date(data.end_date);

    for (const scheduleEntry of schedule) {
      const classDate = new Date(scheduleEntry.date);
  
      // Verificamos si la fecha de la clase está fuera del rango del curso
      if (classDate < courseStartDate || classDate > courseEndDate) {
        return toast.error('Una o más fechas de clase están fuera del rango del curso.');
      }
    }

    const startDate = new Date(data.start_date).getTime();
    const endDate = new Date(data.end_date).getTime();
    const durationInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    if (schedule.length > durationInDays) {
      return toast.error('No se pueden crear más horarios que la duración del curso.');
    }
    const startAndEnd = schedule.map((schedule) => {
      return {
        date: schedule.date,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
      };
    });
    
    for (let i = 0; i < startAndEnd.length; i++) {
      const newScheduleStartTime = startAndEnd[i].start_time;
      const newScheduleEndTime = startAndEnd[i].end_time;
      const newScheduleDate = new Date(startAndEnd[i].date); // Convertir la fecha a un objeto Date
    
      for (let j = 0; j < startAndEnd.length; j++) {
        if (i !== j) {
          const existingScheduleStartTime = startAndEnd[j].start_time;
          const existingScheduleEndTime = startAndEnd[j].end_time;
          const existingScheduleDate = new Date(startAndEnd[j].date); // Convertir la fecha a un objeto Date
    
          // Comprobar que las fechas coinciden
          if (newScheduleDate.getTime() === existingScheduleDate.getTime()) {
            if (
              (newScheduleStartTime >= existingScheduleStartTime &&
                newScheduleStartTime < existingScheduleEndTime) ||
              (newScheduleEndTime > existingScheduleStartTime &&
                newScheduleEndTime <= existingScheduleEndTime)
            ) {
              return toast.error('El horario de una clase coincide con otra en la misma fecha.');
            }
          }
        }
      }
    }

    let error = 0;
    schedule.map((schedule) => {
      if(schedule.date === '' || schedule.start_time === ''  || schedule.end_time === ''){
        error =+ 1;
      };
    },
    )
  
    if (error > 0) {
      error = 0;
      return toast.error('Debe completar todos los Campos de fecha y horarios de las Clase.');
    }

    descriptionFields.map((description) => {
      if(description === ''){
        error =+ 1;
      }
    },
    )

    if (error > 0) {
      error = 0;
      return toast.error('Debe completar todos los campos requeridos de "Que vas a Aprender en este curso" Minimo 4 campos a rellenar');
    }

    data.schedule = schedule;
    data.scheduleLength = schedule.length;
    data.description = descriptionFields;
    data.course_id = initialCourseData.course_id;
    try {
      const responseCreateCourse = await axios.put('/api/createCourse', data);
      if (responseCreateCourse.status === 200) {
          const response = responseCreateCourse.data;
          if (response.error === 'Existen horarios superpuestos en la misma sucursal.') {
            toast.error('Existen horarios superpuestos en la misma sucursal.');
            return; // Detener el flujo y mostrar el mensaje de error
          }
          toast.success('Curso Actualizado con Éxito');
          const courseId = response.updateCourse[0].course_id;
          mutate(`/api/course/${courseId}`);
          route.push(`/instructor/CreateCourse/${courseId}`);
          // const classUpdatePromises = response.createdSchedules.map(async (scheduleEntry) => {
          //   try {
          //     const responseClass = await axios.put(`/api/class/${courseId}`, {
          //       schedule_id: scheduleEntry.shedule_id,
          //     });
      
          //     if (responseClass.data) {
          //       toast.success('Clase actualizada con Éxito');
          //       console.log(responseClass.data);
          //     } else {
          //       console.error('Error al actualizar la clase');
          //     }
          //   } catch (error) {
          //     console.error('Error al actualizar la clase:', error);
          //   }
          // });
      
          // // Wait for all the schedule update promises to complete
          // await Promise.all(classUpdatePromises);
      } else {
        toast.error('Error al actualizar el curso');
      }
  } catch (error) {
      console.error('Hubo un error en la solicitud:', error);
      toast.error('Error al Actualizar el curso');
  }
  };
  
  const [newScheduleIndices, setNewScheduleIndices] = useState<number[]>([]);
  const handleAddSchedule = () => {
    const newSchedules = [...schedule, { date: "", start_time: "", end_time: "" }];
    const newIndex = newSchedules.length - 1;
    setSchedule(newSchedules);
    setNewScheduleIndices([...newScheduleIndices, newIndex]);
  };
  const handleDescriptionChange = (index: number, value: string) => {
    setDescriptionFields((prevFields) => {
      const newFields = [...prevFields];
      newFields[index] = value;
      return newFields;
    });
  };

  const handleAddDescriptionField = () => {
    setDescriptionFields((prevFields) => [...prevFields, ""]);
  };

  const handleRemoveDescriptionField = (index: number) => {
    setDescriptionFields((prevFields) => {
      const newFields = [...prevFields];
      newFields.splice(index, 1);
      return newFields;
    });
  };

  const handleRemoveSchedule = async (index: number) => {
    if (newScheduleIndices.includes(index)) {
      const newSchedules = [...schedule];
      newSchedules.splice(index, 1);
      setSchedule(newSchedules);
    } else {
      if(!confirm('¿Está seguro que desea eliminar este horario?, también se eliminará la clase asociada a este horario, si das clic en Aceptar se perderá la clase y no se podrá recuperar.')) return;
      try {
        const response = await axios.delete(`/api/class/${schedule[index].class_id}`);
        if (response.status === 200) {
          toast.success('Clase eliminada con Éxito');
          const newSchedules = [...schedule];
          newSchedules.splice(index, 1);
          setSchedule(newSchedules);
        }
      } catch (error) {
        console.error('Hubo un error en la solicitud:', error);
        toast.error('Error al eliminar la Clase');
      }
    }
  };

  const handleScheduleChange = (index: any, field: any, value: any) => {
    setSchedule((prevSchedule) => {
      const newSchedule = [...prevSchedule];
      newSchedule[index] = {
        ...newSchedule[index],
        [field]: value,
      };
      console.log(newSchedule[0]);
      return newSchedule;
    });
  };

  return (
    <Box m="20px">
      <Header title="Editar un Curso" subtitle="Editar Curso" />
      <Formik
        initialValues={initialCourseData} // Use initialCourseData as initial values
        onSubmit={handleFormSubmit}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="flex"
              flexDirection="column"

              gap="50px"
              
              gridTemplateColumns="repeat(, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nombre del Curso"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.course_name}
                name="course_name"
                error={!!touched.course_name && !!errors.course_name}
                helperText={touched.course_name && errors.course_name}
                sx={{  width: '250px', gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                multiline
                rows={8}
                type="text"
                label="Descripción del Curso"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description_course}
                name="description_course"
                error={!!touched.description_course && !!errors.description_course}
                helperText={touched.description_course && errors.description_course}
                size="medium"
                sx={{ gridColumn: "span 4", width: '1000px' }}
              />
              <Box className='flex flex-row'>
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  label="Precio del Curso"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.price_course}
                  name="price_course"
                  error={!!touched.price_course && !!errors.price_course}
                  helperText={touched.price_course && errors.price_course}
                  sx={{ gridColumn: "span 2", maxWidth: "150px" }}
                  disabled={values.isFree} 
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      color="success"
                      checked={values.isFree}
                      onChange={handleChange}
                      name="isFree"
                    />
                  }
                  disabled={values.price_course > 0 ? true : false}
                  label="Es Gratis?"
                  labelPlacement="start"
                />
              </Box>
                <FormControl fullWidth sx={{ maxWidth: "200px"}} variant="filled">
                  <InputLabel id="categoria-select-label">Categoría del Curso</InputLabel>
                  <Select
                    labelId="categoria-select-label"
                    id="categoria-select"
                    value={values.category_id}
                    onChange={handleChange}
                    name="category_id"
                    error={!!touched.category_id && !!errors.category_id}
                  >
                    {categories != null ? categories.map((categoria : any) => (
                      
                      <MenuItem key={categoria.category_id} value={categoria.category_id}>
                        {categoria.category_name} 
                      </MenuItem>
                    )) : null}  
                    
                  </Select>
                  {/* {touched.category_id && !!errors.category_id && <div className="text-red-500">{errors.category_id}</div>} */}
                </FormControl> 

                <FormControl fullWidth sx={{ maxWidth: "200px"}} variant="filled">
                  <InputLabel id="demo-simple-select-label">Sucursal</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values.id_branch}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    name="id_branch"
                    error={!!touched.id_branch && !!errors.id_branch}
                  >
                      {branchOffices != null ? branchOffices.map((branch : any) => (
                        <MenuItem key={branch.branch_id} value={branch.branch_id}>
                          {branch.branch_name} 
                        </MenuItem>
                      )) : null}  
                  </Select>
                  {/* {touched.id_branch && !!errors.id_branch && <div className="text-red-500">{errors.id_branch}</div>} */}
                </FormControl>

                <Box>
                {descriptionFields.map((value, index) => (
                  <Box key={index}>
                    <FormControl fullWidth sx={{ maxWidth: "450px"}} variant="filled">
                    <TextField
                      fullWidth
                      variant="filled"
                      rows={8}
                      type="text"
                      label={`Que vas a Aprender en este curso?`}
                      onChange={(e) => handleDescriptionChange(index, e.target.value)}
                      value={value}
                      sx={{  width: '450px', gridColumn: "span 4" }}
                      onBlur={handleBlur}
                      name={`descriptionFields[${index}]`}
                      inputProps={{
                        maxLength: 70,
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {`${value.length}/${70}`} 
                          </InputAdornment>
                        ),
                      }}
                    />
                      </FormControl>
                  
                    {index >= 4 && (
                      <IconButton   color='error' onClick={() => handleRemoveDescriptionField(index)}>
                        <CloseIcon /> 
                      </IconButton>
                    )}
                  </Box>
                ))}
                <Button  variant="outlined" color='warning' sx={{ mt: 4, mr: 4 }}  onClick={handleAddDescriptionField}>Agregar otro Elemento</Button>
              </Box>
            
                <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Fecha de inicio del Curso"
                onBlur={handleBlur}
                onChange={handleChange}
                value={new Date(values.start_date).toISOString().substring(0, 10)}
                name="start_date"
                error={!!touched.start_date && !!errors.start_date}
                sx={{ gridColumn: "span 2", maxWidth: "230px" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Fecha de finalización del Curso"
                onBlur={handleBlur}
                onChange={handleChange}
                value={new Date(values.end_date).toISOString().substring(0, 10)}
                name="end_date"
                error={!!touched.end_date && !!errors.end_date}
                sx={{ gridColumn: "span 2", maxWidth: "230px" }}
              />
                
            <Box>
              {schedule.map((entry, index) => (
                <Box key={index}>
                  <FormControl fullWidth  variant="filled" sx={{  mr: 2, maxWidth: "250px" }}>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="date"
                      label="Fecha de la Clase del Curso"
                      onBlur={handleBlur}
                      onChange={(e) => {
                          if(e.target.value >= new Date(values.start_date).toISOString().substring(0, 10) && e.target.value <= new Date(values.end_date).toISOString().substring(0, 10)) {
                            const newSchedules = [...schedule];
                            newSchedules[index].date = e.target.value;
                            setSchedule(newSchedules);
                        }else {
                          toast.error('La fecha de la clase debe estar dentro del rango del curso.');
                          const newSchedules = [...schedule];
                            newSchedules[index].date = '';
                            setSchedule(newSchedules);
                        }
                      }}
                      value={entry.date ? new Date(entry.date).toISOString().substring(0, 10) : ''}
                      name="date"
                    />
                  </FormControl>
                  
                      
                  <FormControl fullWidth  variant="filled" sx={{  mr: 2, maxWidth: "200px" }}>
                  <TextField
                    label="Horario de inicio"
                    type="time"
                    variant="filled"
                    value={entry.start_time}
                    onChange={(e) => {
                      e.preventDefault();
                      const inputValue = e.target.value;
                      const isValidTimeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/.test(inputValue);
                      if (e.target.value <= schedule[index].end_time || !schedule[index].end_time) {
                        handleScheduleChange(index, 'start_time', e.target.value);
                      }
                    }}
                  />
                  </FormControl>

                  <FormControl fullWidth  variant="filled" sx={{  mr: 2, maxWidth: "200px" }}>
                  <TextField
                    label="Horario de finalización"
                    type="time"
                    variant="filled"
                    value={entry.end_time}
                    onChange={(e) => {
                      e.preventDefault();
                      const inputValue = e.target.value;
                      const isValidTimeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/.test(inputValue);
                      if (e.target.value  >= schedule[index].start_time) {
                        handleScheduleChange(index, 'end_time', e.target.value);
                      }
                    }}
                  />
                  </FormControl>
                    <IconButton color='error'  onClick={() => handleRemoveSchedule(index)} >
                      <CloseIcon />
                    </IconButton>
                </Box>
              ))}
                <Button sx={{ mt: 4, mr: 4 }}  variant="outlined" color='warning' onClick={handleAddSchedule}>Agregar horario</Button>
            </Box>        
            </Box>
            <Box display="flex" justifyContent="flex-start" mt="50px">
              <Button type="submit" variant="outlined" color="secondary">
                Actualizar Curso
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  course_name: yup.string().required("El nombre del curso es requerido").max(50, "El nombre del curso debe tener como máximo 50 caracteres"),
  description_course: yup.string().required("La descripción del curso es requerida").max(340, "La descripción debe tener como máximo 340 caracteres"),
  price_course: yup.number().required("El precio del curso es requerido"),
  category_id: yup
  .number()
  .min(1, "Debe seleccionar una categoría")
  .required("El ID de la categoría es requerido"),
  id_branch: yup
  .number()
  .min(1, "Debe seleccionar una sucursal")
  .required("El ID de la sucursal es requerido"),
  start_date: yup
  .date()
  .required("La fecha de inicio es requerida")
  .test("start-date-before-end-date", "La fecha de inicio debe ser anterior a la fecha de finalización", function (
    value
  ) {
    const end_date = this.parent.end_date;
    return !end_date || value < end_date;
  }),

end_date: yup
  .date()
  .required("La fecha de finalización es requerida")
  .test("end-date-after-start-date", "La fecha de finalización debe ser posterior a la fecha de inicio", function (
    value
  ) {
    const start_date = this.parent.start_date;
    return !start_date || value > start_date;
  }),
  user_id: yup.number().required("El ID de usuario es requerido"),
  isFree: yup.boolean().required("El estado gratuito es requerido"),
});


export default ModifyCourseForm;
