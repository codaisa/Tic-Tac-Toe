import React from "react";
import StyledInput from "./styles";

type Props = {
  readonly onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input: React.FC<Props> = (props: Props) => {
  return <StyledInput {...props} />;
};

export default Input;
