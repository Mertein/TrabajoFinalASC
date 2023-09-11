import prisma from "../../lib/prismadb";

interface CourseData {
  course_name: string;
  popularity: number;
}

const getCoursePopularity = async () => {
  try {
    const enrollments = await prisma.enrollment_course.findMany({
      include: {
        course: true,
      },
    });

    const fieldsPromise = enrollments.reduce((accumulator: Record<string, CourseData>, enrollment) => {
      const key = enrollment.course.course_id.toString();

      if (!accumulator[key]) {
        accumulator[key] = {
          course_name: enrollment.course.course_name,
          popularity: 0,
        };
      }

      // Calculate popularity based on the number of enrollments
      accumulator[key].popularity += 1;

      return accumulator;
    }, {});

    const coursePopularity = Object.values(fieldsPromise);

    // Sort the data by popularity in descending order
    coursePopularity.sort((a, b) => b.popularity - a.popularity);

    return coursePopularity;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getCoursePopularity;
