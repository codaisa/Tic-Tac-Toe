import { ReactNode } from "react";
import {
  BackgroundProps,
  BorderProps,
  BoxShadowProps,
  FlexboxProps,
  GridTemplateColumnsProps,
  LayoutProps,
  PositionProps,
  SpaceProps,
} from "styled-system";

export type Props = {
  readonly children?: ReactNode;
  gap?: string;
  transform?: string;
  readonly onClick?: () => void;
} & SpaceProps &
  LayoutProps &
  BackgroundProps &
  FlexboxProps &
  BorderProps &
  GridTemplateColumnsProps &
  BoxShadowProps &
  PositionProps;
