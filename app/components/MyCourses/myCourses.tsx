'use client'
import React, {useState } from 'react'
import Card from '@mui/material/Card';
import Header from '../Header/header';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Alert, Box, Button, CardActionArea, CardActions, Checkbox, FormControl, FormControlLabel, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import useSWR from 'swr';
import  { useRouter } from 'next/navigation';

const MyCourses = () => {
  const fetcherCourses = (arg: any, ...args: any) => fetch(arg, ...args).then(res => res.json())
  const { data: courses, error, isLoading } = useSWR('/api/getMyCoursesStudent',  fetcherCourses)
  const fetcherCategories = (arg: any, ...args: any) => fetch(arg, ...args).then(res => res.json())
  const { data: categories, error: errorCategoires, isLoading: isLoadingCategories } = useSWR('/api/getCategories',  fetcherCategories)
  const uniqueCategories = Array.from(
    new Set(
      courses?.map((course: any) => course.course.category_course?.category_name)
        .filter((category: string | undefined | null) => category) // Filtrar valores nulos o indefinidos
    )
  );
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]); // Initialize with an empty array
  const [showFinishedCourses, setShowFinishedCourses] = useState(false);
  const [showOngoingCourses, setShowOngoingCourses] = useState(false);
  const handleCourse= (course_id : number) => {
    router.push(`/student/MyCourses/${course_id}`)
  }
  const handleCourseInfo = (course_id : number) => {
    router.push(`/student/viewCourses/${course_id}`)
  }

  const filteredCourses = courses
  ? courses.filter((course: any) => {
      const categoryMatch = selectedCategory.includes(course.course.category_course?.category_name);
      const startDate = new Date(course.course.start_date);
      const endDate = new Date(course.course.end_date);
      const isFinished = endDate < new Date(); // Check if the course has ended
      const isOngoing = startDate <= new Date() && endDate >= new Date(); // Check if the course is ongoing

      // If no category is selected, include the course
      const categoryFilterPassed = selectedCategory.length === 0 || categoryMatch;
      // If neither showFinishedCourses nor showOngoingCourses is checked, include the course
      const statusFilterPassed = !showFinishedCourses && !showOngoingCourses;
      // If showFinishedCourses is checked and the course is finished, include the course
      const finishedFilterPassed = showFinishedCourses && isFinished;
      // If showOngoingCourses is checked and the course is ongoing, include the course
      const ongoingFilterPassed = showOngoingCourses && isOngoing;

      return categoryFilterPassed && (statusFilterPassed || finishedFilterPassed || ongoingFilterPassed);
    })
  : [];

  console.log("Filtered Courses:", filteredCourses);

const handleChange = (event: SelectChangeEvent<typeof selectedCategory>) => {
  const {
    target: { value },
  } = event;
  setSelectedCategory(
    // On autofill we get a stringified value.
    typeof value === 'string' ? value.split(',') : value,
  );
};


console.log(courses)
  return ( 
    <Box m="20px" >
      <Header title="Mis Cursos" subtitle="Ver todos mis Cursos" />
      { courses !== undefined && courses.length == 0 && <Alert sx={{width: 300}} severity="info">No estas inscripto en ningun Curso</Alert>}
      <Box
        display="flex"
        flexDirection="column"
        flexWrap="wrap"

        gap="50px"
        
        gridTemplateColumns="repeat(, minmax(0, 1fr))"
        sx={{
          "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
        }}
      >
        
        <FormControl sx={{ m: 1, width: 300}}>
        <InputLabel id="demo-multiple-checkbox-label">Filtros</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          defaultValue={[]}
          value={selectedCategory}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
          color='success'
        >
          {isLoadingCategories && <MenuItem value="">Cargando...</MenuItem>}
          {Array.isArray(uniqueCategories) &&
            uniqueCategories.map((category) => {
              if (typeof category === 'string') {
                return (
                  <MenuItem key={category} value={category}>
                    <Checkbox checked={selectedCategory.indexOf(category) > -1} />
                    <ListItemText primary={category} />
                  </MenuItem>
                );
              }
              return null;
            })}
        </Select>
        <FormControlLabel
          control={
            <Checkbox
              checked={showFinishedCourses}
              onChange={() => setShowFinishedCourses(!showFinishedCourses)}
              color='success'
            />
          }
          label="Cursos Terminados"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={showOngoingCourses}
              onChange={() => setShowOngoingCourses(!showOngoingCourses)}
              color='success'
            />
          }
          label="Cursos en Progreso"
        />
      </FormControl>
      {courses && filteredCourses.map((course: any, id: number) => (
        <Card sx={{ maxWidth: 345 }} key={id}>
        <CardActionArea>
          <Image
            src={`${process.env.NEXT_PUBLIC_CDN}/Course/${course.course.files.name}`}
            width={500}
            height={500}
            alt="Picture of the author"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {course.course.course_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {course.course.description_course}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions className="space-x-48">
          <Button size="large" color="info" onClick={() => handleCourse(course.course_id)}>
            Ver Curso
          </Button>
          <Button size="small" color="secondary" onClick={() => handleCourseInfo(course.course_id)}>
            Info del Curso
          </Button>
        </CardActions>
      </Card>
        ))}
      </Box>
    </Box>
  );
}

export default MyCourses;