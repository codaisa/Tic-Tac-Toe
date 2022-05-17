import React from "react";
import StyledContainer from "./styles";
import { Props } from "./types";

const Container: React.FC<Props> = (props: Props) => {
  const { children } = props;

  return (
    <StyledContainer {...props} onClick={props.onClick}>
      {children}
    </StyledContainer>
  );
};

export default Container;
