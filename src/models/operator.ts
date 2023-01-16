export interface Operator {
  _id: string;
  name: string;
  surname: string;
  email: string;
}

export const isOperator = (operator: any): operator is Operator => {
  const unsafeCast = operator as Operator;

  return (
    unsafeCast._id !== undefined &&
    unsafeCast.name !== undefined &&
    unsafeCast.surname !== undefined &&
    unsafeCast.email !== undefined
  );
};
