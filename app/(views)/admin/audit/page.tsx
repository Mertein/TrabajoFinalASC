import getAudit from "@/app/actions/getAudit";
import Audit from "../components/Audit/Audit";

export default async function() {
  const data = await getAudit();
  return (
    <div>
     <Audit data={data} />
    </div>
  )
}