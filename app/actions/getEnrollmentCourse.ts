async function getEnrollmentCourse() {
  const res = await fetch('http://localhost:3000/api/enrollmentCourse', {
    cache: 'no-store',
  });

  if(!res.ok) {
    throw new Error('Failed to fetch Data')
  }

  return res.json();
}
export default getEnrollmentCourse;