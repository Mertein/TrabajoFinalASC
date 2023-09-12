'use client'
import React, { useState } from 'react';
import Card from '@mui/material/Card';
import Header from '../Header/header';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, Button, CardActionArea, CardActions, CardMedia, Checkbox, FormControl, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { format, isBefore, isAfter, formatDistanceToNow } from 'date-fns';
import {MonetizationOn as MonetizationOnIcon} from '@mui/icons-material';
import { es } from 'date-fns/locale';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
function ViewCourses() {
  const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());
  const { data: courses, error, isLoading } = useSWR('/api/getCourses', fetcher );
  const { data: categories, error: errorCategories, isLoading: isLoadingCategories } = useSWR('/api/getCategories', fetcher);
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof selectedCategory>) => {
    const {
      target: { value },
    } = event;
    setSelectedCategory(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleCategoryChange = (category: any) => {
    setSelectedCategory(category);
  };

  const currentDate = new Date();

  const getCoursesStatus = (course: any) => {
    const startDate = new Date(course.start_date);
    const endDate = new Date(course.end_date);
    if (isBefore(currentDate, startDate)) {
      return 'Proximos lanzamientos';
    } else if (isBefore(currentDate, endDate) && !(course.branch_offices.people_capacity <= course.enrollment_course.length)) {
      return 'En curso';
    } else if (course.branch_offices.people_capacity <= course.enrollment_course.length ) {
      return 'Cursos agotados';
    } else {
      'return';
    }
  };

  const handleCourseClick = (id: number) => {
    const currentPath = window.location.pathname;
    let role = '';
    if (currentPath.startsWith('/student')) {
      role = 'student';
    } else if (currentPath.startsWith('/admin')) {
      role = 'admin';
    } else if (currentPath.startsWith('/instructor')) {
      role = 'instructor';
    }

    router.push(`/${role}/viewCourses/${id}`);
  };

  

  const filteredCourses = courses && selectedCategory.length > 0
  ? courses.filter((course: any) =>
      selectedCategory.includes(course.category_course?.category_name)
    )
  : courses;


  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };
  return (
    <Box m="20px">
      <Header title="Ver Cursos" subtitle="Ver todos los cursos" />
      
      {/* <Box mb="20px">
        <Typography variant="h6">Filtrar por categoría:</Typography>
        <Select
          sx={{ width: 200 }}
          variant="filled"
          color='success'
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <MenuItem defaultValue='Todas las categorias' value="Todas las categorias">Todas las categorías</MenuItem>
          {isLoadingCategories && <MenuItem value="">Cargando...</MenuItem>}
          {categories &&
            categories.map((category: any) => (
              <MenuItem key={category.category_id} value={category.category_name}>
                {category.category_name}
              </MenuItem>
            ))}
        </Select>
      </Box> */}
      
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          defaultValue={[]}
          value={selectedCategory}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
          color='success'
        >
          {isLoadingCategories && <MenuItem value="">Cargando...</MenuItem>}
          {categories &&
           categories.map((category: any) => (
            <MenuItem key={category.category_id} value={category.category_name}>
              <Checkbox checked={selectedCategory.indexOf(category.category_name) > -1} />
              <ListItemText primary={category.category_name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box border="50px inset pink" p={3} maxWidth={1500} margin={5} paddingLeft={15}>
        <Typography variant="h4" align="center" style={{ fontFamily: 'Arial, sans-serif', padding: 15 }}>
          Lanzamiento
        </Typography>
        <Carousel responsive={responsive}>
          {courses ? (
            filteredCourses 
              .filter((course: any) => getCoursesStatus(course) === 'Proximos lanzamientos')
              .map((course: any) => (
                <Card key={course.course_id} style={{margin:20, maxWidth: 350, maxHeight:500}} >
                  <CardActionArea style={{display: 'inline-block', backgroundColor: 'white', color: 'deeppink'  }}>
                    {
                      course.files !== null &&
                      <Image src={`/Course/${course.files.name}`} width={350} height={300} alt="Foto del Curso" />
                    }           
                    <CardContent>
                      <Typography gutterBottom variant="h3" style={{textAlign:'center'}} component="div">
                        {course.course_name}
                      </Typography>
                      <Box display="flex" alignItems="center">
                        
                        <Typography variant="h5" color="GrayText" style={{ marginLeft: '4px',fontSize:'20px'  }}>
                        <MonetizationOnIcon color="success" fontSize="small"/>
                        {course.discount_percentage > 0 && // Verifica si el curso tiene un descuento
                        isAfter(currentDate, new Date(course.start_date_discount)) && // Verifica si está dentro del rango de descuento
                        isBefore(currentDate, new Date(course.end_date_discount)) && (
                          <>
                            <span style={{ textDecoration: 'line-through'}}>
                              {`$${course.price_course}`}
                            </span>{' '}
                            {/* Precio original tachado */}
                            {`$${(
                              course.price_course -
                              (course.price_course * course.discount_percentage) / 100
                            ).toFixed(2)}`}{' '}
                              <Typography  color="success" style={{ fontSize: '15px'}}>
                              {`Promoción Hasta: ${format(new Date(course.end_date_discount), 'dd/MM/yyyy')}`}
                            </Typography>
                             <Typography gutterBottom style={{color: 'black', fontSize: '14px'}}>
                            {`Tiempo restante: ${formatDistanceToNow(
                              new Date(course.end_date_discount),
                              {locale: es }
                            )}`}
                            </Typography>
                          </>
                        )}
                      {(!course.discount_percentage || // Si no hay descuento
                        isBefore(currentDate, new Date(course.start_date_discount)) || // O si está fuera del rango de descuento
                        isAfter(currentDate, new Date(course.end_date_discount))) && (
                        <>
                          {course.price_course > 0 ? `$${course.price_course}` : 'Gratis'}
                        </>
                      )}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Typography gutterBottom variant="h5" color="black" style={{ marginLeft: '4px', color: 'deeppink' }}>
                          Categoría:
                        </Typography>
                        <Typography gutterBottom variant="h5" color="black" style={{ marginLeft: '4px', color: 'deeppink' }}>
                          {course.category_course?.category_name}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button size="large" color="secondary" onClick={() => handleCourseClick(course.course_id)}>
                      Ver más Información del Curso
                    </Button>
                  </CardActions>
                </Card>
              ))
          ) : (
            <Typography variant="h6">Cargando...</Typography>
          )}
        </Carousel>
      </Box>

      <Box border="50px inset white" p={3} maxWidth={1500} margin={5} paddingLeft={15}>
        <Typography variant="h4" align="center" style={{ fontFamily: 'Arial, sans-serif', padding: 15 }}>
          En curso
        </Typography>
        <Carousel responsive={responsive}>
          {courses ? (
            filteredCourses 
              .filter((course: any) => getCoursesStatus(course) === 'En curso')
              .map((course: any) => (
                <Card key={course.course_id} style={{margin:20, maxWidth: 350, maxHeight:500}} >
                  <CardActionArea style={{display: 'inline-block', backgroundColor: 'white', color: 'deeppink'  }}>
                    {
                      course.files !== null &&
                      <Image src={`/Course/${course.files.name}`} width={350} height={300} alt="Foto del Curso" />
                    }           
                    <CardContent>
                      <Typography gutterBottom variant="h3" style={{textAlign:'center'}} component="div">
                        {course.course_name}
                      </Typography>
                      <Box display="flex" alignItems="center">
                        
                        <Typography variant="h5" color="GrayText" style={{ marginLeft: '4px',fontSize:'20px'  }}>
                        <MonetizationOnIcon color="success" fontSize="small"/>
                        {course.discount_percentage > 0 && // Verifica si el curso tiene un descuento
                        isAfter(currentDate, new Date(course.start_date_discount)) && // Verifica si está dentro del rango de descuento
                        isBefore(currentDate, new Date(course.end_date_discount)) && (
                          <>
                            <span style={{ textDecoration: 'line-through'}}>
                              {`$${course.price_course}`}
                            </span>{' '}
                            {/* Precio original tachado */}
                            {`$${(
                              course.price_course -
                              (course.price_course * course.discount_percentage) / 100
                            ).toFixed(2)}`}{' '}
                             <Typography  color="success" style={{ fontSize: '15px'}}>
                              {`Promoción Hasta: ${format(new Date(course.end_date_discount), 'dd/MM/yyyy')}`}
                            </Typography>
                             <Typography gutterBottom style={{color: 'black', fontSize: '14px'}}>
                            {`Tiempo restante: ${formatDistanceToNow(
                              new Date(course.end_date_discount),
                              {locale: es }
                            )}`}
                            </Typography>
                          </>
                        )}
                      {(!course.discount_percentage || // Si no hay descuento
                        isBefore(currentDate, new Date(course.start_date_discount)) || // O si está fuera del rango de descuento
                        isAfter(currentDate, new Date(course.end_date_discount))) && (
                        <>
                          {course.price_course > 0 ? `$${course.price_course}` : 'Gratis'}
                        </>
                      )}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Typography gutterBottom variant="h5" color="black" style={{ marginLeft: '4px', color: 'deeppink' }}>
                          Categoría:
                        </Typography>
                        <Typography gutterBottom variant="h5" color="black" style={{ marginLeft: '4px', color: 'deeppink' }}>
                          {course.category_course?.category_name}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                  <Button size="large" color="secondary" onClick={() => handleCourseClick(course.course_id)}>
                      Ver más Información del Curso
                    </Button>
                </Card>
              ))
          ) : (
            <Typography variant="h6">Cargando...</Typography>
          )}
        </Carousel>
      </Box>

      <Box border="50px inset black" p={3} maxWidth={1500} margin={5} paddingLeft={15}>
        <Typography variant="h4" align="center" style={{ fontFamily: 'Arial, sans-serif', padding: 15 }}>
          Cupos Agotados
        </Typography>
        <Carousel responsive={responsive}>
          {courses ? (
            filteredCourses 
              .filter((course: any) => getCoursesStatus(course) === 'Cursos agotados')
              .map((course: any) => (
                <Card key={course.course_id} style={{margin:20, maxWidth: 350, maxHeight:500}} >
                  <CardActionArea style={{display: 'inline-block', backgroundColor: 'white', color: 'deeppink'  }}>
                    {
                      course.files !== null &&
                      <Image src={`/Course/${course.files.name}`} width={350} height={300} alt="Foto del Curso" />
                    }           
                    <CardContent>
                      <Typography gutterBottom variant="h3" style={{textAlign:'center'}} component="div">
                        {course.course_name}
                      </Typography>
                      <Box display="flex" alignItems="center">
                        
                        <Typography variant="h5" color="GrayText" style={{ marginLeft: '4px',fontSize:'20px'  }}>
                        <MonetizationOnIcon color="success" fontSize="small"/>
                        {course.discount_percentage > 0 && // Verifica si el curso tiene un descuento
                        isAfter(currentDate, new Date(course.start_date_discount)) && // Verifica si está dentro del rango de descuento
                        isBefore(currentDate, new Date(course.end_date_discount)) && (
                          <>
                            <span style={{ textDecoration: 'line-through'}}>
                              {`$${course.price_course}`}
                            </span>{' '}
                            {/* Precio original tachado */}
                            {`$${(
                              course.price_course -
                              (course.price_course * course.discount_percentage) / 100
                            ).toFixed(2)}`}{' '}
                              <Typography  color="success" style={{ fontSize: '15px'}}>
                              {`Promoción Hasta: ${format(new Date(course.end_date_discount), 'dd/MM/yyyy')}`}
                            </Typography>
                             <Typography gutterBottom style={{color: 'black', fontSize: '14px'}}>
                            {`Tiempo restante: ${formatDistanceToNow(
                              new Date(course.end_date_discount),
                              {locale: es }
                            )}`}
                            </Typography>
                          </>
                        )}
                      {(!course.discount_percentage || // Si no hay descuento
                        isBefore(currentDate, new Date(course.start_date_discount)) || // O si está fuera del rango de descuento
                        isAfter(currentDate, new Date(course.end_date_discount))) && (
                        <>
                          {course.price_course > 0 ? `$${course.price_course}` : 'Gratis'}
                        </>
                      )}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Typography gutterBottom variant="h5" color="black" style={{ marginLeft: '4px', color: 'deeppink' }}>
                          Categoría:
                        </Typography>
                        <Typography gutterBottom variant="h5" color="black" style={{ marginLeft: '4px', color: 'deeppink' }}>
                          {course.category_course?.category_name}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button size="large" color="secondary" onClick={() => handleCourseClick(course.course_id)}>
                      Ver más Información del Curso
                    </Button>
                  </CardActions>
                </Card>
              ))
          ) : (
            <Typography variant="h6">Cargando...</Typography>
          )}
        </Carousel>
      </Box>
    </Box>
  );
}

export default ViewCourses;
