import { NextPage } from "next";
import { FormEventHandler, ReactNode } from "react";

type CardProps = {
  children: Array<ReactNode>;
  title: String;
  buttonName: String;
  handleSubmit: FormEventHandler;
};

const FormCard: NextPage<CardProps, ReactNode> = (props: CardProps) => {
  return (
    <div className="container mx-auto max-w-md border rounded-lg p-6 bg-white border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <h1 className="text-3xl">{props.title}</h1>
      {props.children.map((child, id) => (
        <div key={id} className="mt-4">
          {child}
        </div>
      ))}
      <div className="flex flex-row-reverse mt-4">
        <button className="my-btn" onClick={props.handleSubmit}>
          {props.buttonName}
        </button>
      </div>
    </div>
  );
};

export default FormCard;
