import getEnrollmentCourse from "@/app/actions/getEnrollmentCourse";
import StudentCertificate from "../../components/StudentCertificate/studentCertificate";


async function  studentCertificatePage() {
  const data = await getEnrollmentCourse();
  return (
    <StudentCertificate data={data}/>
  )
}

export default studentCertificatePage;