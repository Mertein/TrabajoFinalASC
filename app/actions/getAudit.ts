import prisma from "../../lib/prismadb";

const getAudit = async () => {
  try {
    const [
      branchOfficeHist,
      categoryHist,
      courseHist,
      enrollmentHist,
      fileHist,
      gradeHist,
      paymentHist,
      schedulesHist,
      userRolHist,
    ] = await Promise.all([
      prisma.branch_offices_hist.findMany(),
      prisma.category_course_hist.findMany(),
      prisma.course_hist.findMany(),
      prisma.enrollment_course_hist.findMany(),
      prisma.files_hist.findMany(),
      prisma.grade_hist.findMany(),
      prisma.payment_hist.findMany(),
      prisma.schedules_hist.findMany(),
      prisma.user_rol_hist.findMany(),
    ]);

    const fields = {
      branchOfficeHist,
      categoryHist,
      courseHist,
      enrollmentHist,
      fileHist,
      gradeHist,
      paymentHist,
      schedulesHist,
      userRolHist,
    };

    console.log('fields', fields);
    return fields;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getAudit;
