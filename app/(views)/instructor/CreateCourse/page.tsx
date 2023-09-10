import getBranchOffices from '@/app/actions/getBranchOffices';
import getCategories from '@/app/actions/getCategories';
import getCourses from '@/app/actions/getCourses';
import CourseForm from '@/app/components/CreateCourse/CourseForm';

export default async function CreateCourse() {
  const categories = await getCategories();
  const branch = await getBranchOffices();
  const class_course = await getCourses();
  return (
      <div>
        <CourseForm categories={categories} branchOffices={branch} class_course={class_course}/>
      </div>
  );
}

