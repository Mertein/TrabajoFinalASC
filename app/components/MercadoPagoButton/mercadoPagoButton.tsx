import { useEffect, useState } from "react";
import { ICourse } from "../../mock/Course";
import { Loader } from "../Loader/loader";
import axios from "axios";

import styles from "./styles.module.css";
import { Alert, Button } from "@mui/material";

interface MercadoPagoButtonProps {
  course: ICourse;
  studentEnrollment : boolean;
  user_id : string | undefined;
  discountedPrice : number | undefined;
}

export const MercadoPagoButton = ({ course, studentEnrollment, user_id, discountedPrice }: MercadoPagoButtonProps) => {
  const [url, setUrl] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const generateLink = async () => {
      setLoading(true);

      try {
        const { data: preference } = await axios.post("/api/payment", {
          course,
          user_id,
          discountedPrice,
        });
        setUrl(preference.init_point);
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    generateLink();
  }, [course,discountedPrice,user_id]);
 
  return (
    <div>
      {studentEnrollment ? (
        <Button
          variant="contained"
          color="info"
          className="py-2 px-4 rounded-full text-green-300 font-bold  "
          disabled={studentEnrollment}
        >
          Ya estas Inscripto
        </Button>
      ) : loading ? (
        <button className={styles.button} disabled>
          <Loader />
        </button>
      ) : (
        user_id == course.user_id ? (
          <Alert>No puedes Inscribirte a tu propio Curso</Alert>
        ) : (
        <a className={styles.button} href={url!}>
            ¡Inscríbete ahora!
        </a>
        )
      )}
    </div>
  );
};