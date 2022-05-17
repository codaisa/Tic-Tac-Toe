import styled from "styled-components";
import { color, fontSize, fontWeight, layout, space } from "styled-system";
import { Props } from "./types";

const StyledText = styled.div<Props>`
  display: inline-block;
  font-size: 16px;
  transition: all 300ms;
  font-family: "Archivo Black", sans-serif;
  ${space}
  ${layout}
  ${fontSize}
  ${fontWeight}
  ${color}
`;

export default StyledText;
