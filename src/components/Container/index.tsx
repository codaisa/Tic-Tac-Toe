import React from "react";
import StyledButton from "./styles";
import { Props } from "./types";

const Button: React.FC<Props> = (props: Props) => {
  const { children } = props;

  return (
    <StyledButton {...props} onClick={props.onClick}>
      {children}
    </StyledButton>
  );
};

export default Button;
