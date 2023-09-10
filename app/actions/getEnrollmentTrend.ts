import prisma from "../../lib/prismadb";

const getEnrollmentTrend = async () => {
  try {
    const enrollments = await prisma.enrollment_course.findMany();

    const enrollmentData = enrollments.reduce((accumulator, enrollment) => {
      const month = enrollment.created_at.getMonth(); // Months are zero-based
      const year = enrollment.created_at.getFullYear();
      const key = `${year}-${month}`;

      if (!accumulator[key]) {
        accumulator[key] = {
          date: new Date(year, month, 1), // First day of the month
          count: 0,
        };
      }
      accumulator[key].count++;

      return accumulator;
    }, {});

    const enrollmentTrend = Object.values(enrollmentData);

    // Sort the data by date in ascending order
    enrollmentTrend.sort((a, b) => a.date - b.date);

    return enrollmentTrend;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getEnrollmentTrend;
