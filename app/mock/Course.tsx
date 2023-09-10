export interface ICourse {
  user_id: string | undefined;
  course_id: string | undefined;
  id: number;
  name: string;
  price: number;
  description: string;
  start_date: string;
  end_date: string;
  start_time: string[];
  end_time: string[];
  img: string;
}

export const Course: ICourse = {
  id: 1,
  name: "Iphone 13 256gb",
  price: 4813,
  description: "Modo Cine con baja profundidad de campo y cambios de enfoque automáticos en tus videos.",
  img: "https://http2.mlstatic.com/D_NQ_NP_736168-MLA47781742030_102021-O.webp",
  start_date: "2021-10-01",
  end_date: "2021-10-31",
  start_time: ["10:00"],
  end_time: ["12:00"],
  user_id: undefined,
  course_id: undefined
};