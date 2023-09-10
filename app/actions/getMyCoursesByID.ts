type Course = {
  course_id: number;
  course_name: string;
  price_course: number;
  description_course: string;
  start_date: string;
  end_date: string;
  category_id: number;
  id_branch: number;
  user_id: number;
}


async function getMyCourses(id: number): Promise<Course[]> {
  const res = await fetch(`http://localhost:3000/api/getMyCourses/${id}`, {
    cache: 'no-store',
  });

  if(!res.ok) {
    throw new Error('Failed to fetch Data')
  }

  return res.json();
}
export default getMyCourses;