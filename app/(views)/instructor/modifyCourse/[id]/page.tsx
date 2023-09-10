import getBranchOffices from '@/app/actions/getBranchOffices';
import getCategories from '@/app/actions/getCategories';
import getMyCoursesByID from '@/app/actions/getMyCoursesByID';
import ModifyCourseForm from '@/app/components/ModifyCourse/ModifyCourseForm';

export default async function CreateCourse({params} : {params: {id: number}}) {
  const categories = await getCategories();
  const branch = await getBranchOffices();
  const course = await getMyCoursesByID(params.id);
  return (
      <div>
        <ModifyCourseForm categories={categories} branchOffices={branch} initialCourseData={course}/>
      </div>
  );
}