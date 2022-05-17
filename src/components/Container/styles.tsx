import styled from "styled-components";
import {
  background,
  border,
  boxShadow,
  flexbox,
  grid,
  gridGap,
  layout,
  position,
  space,
} from "styled-system";
import { Props } from "./types";

const StyledContainer = styled.div<Props>`
  display: flex;
  gap: ${(props) => props.gap};
  transform: ${(props) => props.transform};
  transition: 300ms all;
  ${space}
  ${layout}
  ${background}
  ${flexbox}
  ${border}
  ${grid}
  ${gridGap}
  ${boxShadow}
  ${position}

  &:hover {
    ${(props) => props.onClick && "filter: brightness(0.9); cursor: pointer"};
  }
`;

export default StyledContainer;
