import React from "react";
import { useStyle } from "./style";

type IAnswerProps = {
  id: number;
  children: React.ReactNode;
  userAnswersHandler: (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    id: number
  ) => void;
};

export const Answer: React.FC<IAnswerProps> = ({
  id,
  children,
  userAnswersHandler,
}) => {
  const classes = useStyle();
  return (
    <li
      id={id.toString()}
      className={classes.answerItem}
      onClick={(event) => userAnswersHandler(event, id)}
    >
      {children}
    </li>
  );
};
