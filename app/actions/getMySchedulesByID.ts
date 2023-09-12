type Schedules = {
  id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  course_id: number;
}


async function getMySchedules(id: number): Promise<Schedules[]> {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/schedules/${id}`, {
    cache: 'no-store',
  });

  if(!res.ok) {
    throw new Error('Failed to fetch Data')
  }

  return res.json();
}
export default getMySchedules;