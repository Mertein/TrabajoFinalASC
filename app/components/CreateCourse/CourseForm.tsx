'use client'
import {FormControlLabel,  Box, Button, FormControl, InputLabel, TextField, Select, MenuItem, Checkbox,IconButton, Tooltip} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import {Formik } from "formik";
import {useState} from "react";
import * as yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import Header from "../Header/header";
import { useSession } from "next-auth/react";
import {Close as CloseIcon} from '@mui/icons-material';
import { useRouter } from "next/navigation"
import './style.css'


interface CreateCourse {  
  course_name: string;
  description_course: string;
  price_course: number;
  category_id: number;
  id_branch: number,
  start_date: string,
  end_date: string;
  user_id: number; 
  isFree: boolean;     
  isVirtual: boolean;
  discount_percentage: number;
  apply_discount: boolean;
  start_date_discount: string;
  end_date_discount: string;
  description: string[];
  schedule: schedules[];
}

interface schedules {
  date: '';
  start_time: '';
  end_time: '';
}





const CourseForm =  ({categories, branchOffices, class_course}  : any) => {
  const route = useRouter();
  const { data: session } = useSession();
  const [descriptionFields, setDescriptionFields] = useState<string[]>(["", "", "", ""]);
  
  
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
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [schedule, setSchedule] = useState<schedules[]>([{
    date: '',
    start_time: '',
    end_time : '',
  }]);

  const handleFormSubmit = async (data: any)   => {
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
    // Validación de horarios
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
    
    for(let i = 0; i < startAndEnd.length; i++) {
      const newScheduleStartTime = startAndEnd[i].start_time
      const newScheduleEndTime = startAndEnd[i].end_time
      for(let j = 0; j < startAndEnd.length; j++) {
        if (i !== j) {
          const existingScheduleStartTime = startAndEnd[j].start_time
          const existingScheduleEndTime = startAndEnd[j].end_time
          if (newScheduleStartTime >= existingScheduleStartTime && newScheduleStartTime < existingScheduleEndTime) {
            return toast.error('El horario de inicio de una clase no puede estar dentro del horario de otra clase.');
          }
          if (newScheduleEndTime > existingScheduleStartTime && newScheduleEndTime <= existingScheduleEndTime) {
            return toast.error('El Horario de Finalización de una Clase no puede estar dentro del horario de otra Clase que vas a crear.');
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
    // try {
      const responseCreateCourse = await axios.post('/api/createCourse', data);
      console.log(responseCreateCourse.data)
      if (responseCreateCourse.status === 200) {
        const response = responseCreateCourse.data;
        if (response.error === 'Existen horarios superpuestos en la misma sucursal.') {
          toast.error('Existen horarios superpuestos en la misma sucursal.');
          return; // Detener el flujo y mostrar el mensaje de error
      }
          toast.success('Curso Creado con Éxito');
          const courseId = response.createCourse.course_id;
          console.log(response);
          route.push(`/instructor/CreateCourse/${courseId}`);
      } else {
          console.log('hola',responseCreateCourse)
          toast.error('Error al crear el curso');
          throw new Error('Error al crear el curso');

      }
  // } catch (error) {
      // console.error('Hubo un error en la solicitud:', error);
      // toast.error('Error al crear el curso');
  // }
  };

  const handleScheduleChange = (index: any, field: any, value: any) => {
    setSchedule((prevSchedule) => {
      const newSchedule = [...prevSchedule];
      newSchedule[index] = {
        ...newSchedule[index],
        [field]: value,
      };
      return newSchedule;
    });
  };
  const handleAddSchedule = () => {
    setSchedule([...schedule, { date: '' , start_time: '', end_time: '' }]);
  };

  const handleRemoveSchedule = (index: number) => {
    setSchedule((prevSchedule) => {
      const newSchedule = [...prevSchedule];
      newSchedule.splice(index, 1); // Elimina el elemento del array usando splice
      return newSchedule;
    });
  };

const initialValues: CreateCourse = {
  course_name: "",
  description_course: "",
  price_course: 1,
  category_id: 1,
  id_branch: 1,
  start_date: '',
  end_date: '',
  user_id: Number(session?.user?.user_id) || 0,
  isFree: true,
  isVirtual: false,
  description: ['','','',''],
  discount_percentage: 0,
  start_date_discount: '',
  end_date_discount: '',
  apply_discount: false,
  schedule: [
    {
      date: '',
      start_time: '',
      end_time: '',
    }
  ]
};

const isScheduleAvailable = (scheduleDate: any, startTime: any, endTime: any) => {
  const schedules = class_course.map((classData: any) => classData.schedules[0]);
  
  const matchingClasses = schedules.filter((schedule: any) => {
    const scheduleStartHour = parseInt(schedule.start_time.split(':')[0]);
    const scheduleStartMinute = parseInt(schedule.start_time.split(':')[1]);

    const scheduleEndHour = parseInt(schedule.end_time.split(':')[0]);
    const scheduleEndMinute = parseInt(schedule.end_time.split(':')[1]);

    const inputStartHour = parseInt(startTime.split(':')[0]);
    const inputStartMinute = parseInt(startTime.split(':')[1]);

    const inputEndHour = parseInt(endTime.split(':')[0]);
    const inputEndMinute = parseInt(endTime.split(':')[1]);

    const scheduleDateTime = new Date(schedule.date);
    scheduleDateTime.setHours(scheduleStartHour, scheduleStartMinute);

    return (
      scheduleDateTime <= new Date(scheduleDate) &&
      scheduleDateTime >= new Date(scheduleDate) &&
      (
        (inputStartHour < scheduleEndHour) ||
        (inputStartHour === scheduleEndHour && inputStartMinute <= scheduleEndMinute)
      ) &&
      (
        (inputEndHour > scheduleStartHour) ||
        (inputEndHour === scheduleStartHour && inputEndMinute >= scheduleStartMinute)
      )
    );
  });
  console.log(matchingClasses)
  return matchingClasses.length > 0;
};



  return (
    <Box m="20px" >
      <Header title="Crear Curso" subtitle="Cree un nuevo Curso" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
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
                  value={values.isFree ? values.price_course = 0 : values.price_course}
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
                  label="Es Gratis?"
                  labelPlacement="start"
                />
              </Box>
              <Box className='flex flex-row'>
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  label="Porcentaje de Descuento"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={!values.apply_discount || values.price_course === 0  ? true : false}
                  value={values.apply_discount ? values.discount_percentage : 0}
                  name="discount_percentage"
                  error={!!touched.discount_percentage && !!errors.discount_percentage}
                  helperText={touched.discount_percentage && errors.discount_percentage}
                  sx={{ gridColumn: "span 2", maxWidth: "150px" }} 
                />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Fecha de inicio del Descuento"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.apply_discount ? values.start_date_discount : ''}
                disabled={!values.apply_discount || values.price_course === 0  ? true : false}
                name="start_date_discount"
                error={!!touched.start_date_discount && !!errors.start_date_discount}
                helperText={touched.start_date_discount && errors.start_date_discount}
                sx={{ gridColumn: "span 2", maxWidth: "230px", ml: 1}}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Fecha de finalización de la oferta"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.apply_discount ? values.end_date_discount : ''}
                disabled={!values.apply_discount || values.price_course === 0  ? true : false}
                name="end_date_discount"
                error={!!touched.end_date_discount && !!errors.end_date_discount}
                helperText={touched.end_date_discount && errors.end_date_discount}
                sx={{ gridColumn: "span 2", maxWidth: "230px", ml: 0.5 }}
              />
                <Tooltip
                  title="Aplicara un descuento al precio del curso, unos dias antes de que inicie el curso, segun los dias que seleccione en el campo 'Dias antes del curso para aplicar el descuento' y el porcentaje que seleccione en el campo 'Porcentaje de Descuento'"
                >
                <FormControlLabel
                  control={
                    <Checkbox
                      color="success"
                      checked={values.isFree ?  values.apply_discount = false : values.apply_discount}
                      onChange={handleChange}
                      name="apply_discount"
                     
                    />
                  }
                  disabled={values.price_course === 0  ? true : false}
                  label="Aplicar Descuento"
                  labelPlacement="start"
                
                />
                </Tooltip>
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
                  {touched.category_id && !!errors.category_id && <div className="text-red-500">{errors.category_id}</div>}
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
                  {touched.id_branch && !!errors.id_branch && <div className="text-red-500">{errors.id_branch}</div>}
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
                        maxLength: 100,
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
                value={values.start_date}
                name="start_date"
                error={!!touched.start_date && !!errors.start_date}
                helperText={touched.start_date && errors.start_date}
                sx={{ gridColumn: "span 2", maxWidth: "230px" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Fecha de finalización del Curso"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.end_date}
                name="end_date"
                error={!!touched.end_date && !!errors.end_date}
                helperText={touched.end_date && errors.end_date}
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
                      onChange={(e) =>  {
                        if(e.target.value >= values.start_date && e.target.value <= values.end_date) {
                          handleScheduleChange(index, 'date', e.target.value)}
                        }
                      }
                      value={entry.date}
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
                      if (e.target.value <= schedule[index].end_time || !schedule[index].end_time) {
                        handleScheduleChange(index, 'start_time', e.target.value);
                      }
                    }}
                    className={!isScheduleAvailable(entry.date, entry.start_time, entry.end_time) ? "gray-text" : ""}
                    />

                  
                  </FormControl>

                  <FormControl fullWidth  variant="filled" sx={{  mr: 2, maxWidth: "200px" }}>
                  <TextField
                      label="Horario de finalización"
                      type="time"
                      variant="filled"
                      value={entry.end_time}
                      onChange={(e) => {
                        if (e.target.value  >= schedule[index].start_time) {
                          handleScheduleChange(index, 'end_time', e.target.value);
                        }
                      }}
                      className={!isScheduleAvailable(entry.date, entry.start_time, entry.end_time) ? "gray-text" : ""}
                    />   
                  </FormControl>
                  {index !== 0 && (
                    <IconButton color='error'  onClick={() => handleRemoveSchedule(index)} >
                      <CloseIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
                <Button sx={{ mt: 4, mr: 4 }}  variant="outlined" color='warning' onClick={handleAddSchedule}>Agregar horario</Button>
            </Box>        
            </Box>
            <Box display="flex" justifyContent="flex-start" mt="50px">
              <Button  type="submit" color="secondary"   >
                Crear nuevo curso
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
  price_course: yup.number().min(0, "El Precio del Curso debe ser mayor 0").required("El precio del curso es requerido"),
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
  discount_percentage: yup.number()
  .min(0, "El porcentaje de descuento debe ser mínimo 0")
  .max(100, "El porcentaje de descuento debe ser máximo 100"),
  start_date_discount: yup
  .date()
  .test('start-date-discount-validation', 'La fecha de inicio del descuento debe ser anterior a la fecha de finalización del descuento', function (value) {
    if (this.parent.apply_discount) {
      const end_date_discount = this.parent.end_date_discount;
      return !end_date_discount || value < end_date_discount;
    }
    return true;
  })
  .test('start-date-discount-range', 'La fecha de inicio del descuento debe estar entre una fecha menor a la fecha de inicio del Curso', function (value) {
    if (this.parent.apply_discount) {
      const start_date = this.parent.start_date;
      return !start_date || value < start_date;
    }
    return true;
  }),

end_date_discount: yup
  .date()
  .test('end-date-discount-validation', 'La fecha de finalización del descuento debe ser posterior a la fecha de inicio del descuento', function (value) {
    if (this.parent.apply_discount) {
      const start_date_discount = this.parent.start_date_discount;
      return !start_date_discount || value > start_date_discount;
    }
    return true;
  })
  .test('end-date-discount-range', 'La fecha finalización del descuento debe estar antes de la fecha de inicio del Curso y posterior a la fecha del descuento', function (value) {
    if (this.parent.apply_discount) {
      const start_date = this.parent.start_date;
      return !start_date || value < start_date;
    }
    return true;
  }),
});

export default CourseForm;

function async(arg0: any, any: unknown) {
  throw new Error("Function not implemented.");
}
