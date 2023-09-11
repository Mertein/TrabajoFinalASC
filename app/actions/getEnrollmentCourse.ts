async function getEnrollmentCourse() {
  try {
    const res = await fetch('http://localhost:3000/api/enrollmentCourse', {
      cache: 'reload',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch Data');
    }

    return res.json();
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    throw error; // Re-lanzar el error para que se maneje en otro lugar si es necesario.
  }
}

export default getEnrollmentCourse;
