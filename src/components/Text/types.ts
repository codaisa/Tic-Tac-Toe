import { ReactNode } from "react";
import {
  FontSizeProps,
  FontWeightProps,
  LayoutProps,
  PositionProps,
  SpaceProps,
} from "styled-system";

export type Props = {
  readonly children?: ReactNode;
  readonly color?: string;
} & SpaceProps &
  LayoutProps &
  PositionProps &
  FontSizeProps &
  FontWeightProps;
