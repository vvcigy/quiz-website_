import React from "react";

import { Quiz } from "./containers";
import { Layout } from "./components";
import { IQuestion } from "./interfaces";

export const App: React.FC = () => {
  /*
    NOTE: Array<T> = T[]                (это одно и то же, только второй вариант короче)
          const quiz: IQuestion[] = []; (поэтому можешь сделать так)
  */
  const quiz: Array<IQuestion> = [
    {
      title: "В каком году основали Санкт-Петербург?",
      answers: [
        { text: "1700", id: 1 },
        { text: "1701", id: 2 },
        { text: "1702", id: 3 },
        { text: "1703", id: 4 },
      ],
      rightAnswerId: 4,
    },

    {
      title: "В каком году основали отменили крепостное право?",
      answers: [
        { text: "1860", id: 1 },
        { text: "1861", id: 2 },
        { text: "1862", id: 3 },
        { text: "1863", id: 4 },
      ],
      rightAnswerId: 2,
    },
  ];

  return (
    <Layout>
      <Quiz quiz={quiz} />
    </Layout>
  );
};
