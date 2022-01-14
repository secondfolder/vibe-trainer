import React, {HTMLAttributes, ReactNode} from "react";
import { cx, css, ClassNamesArg } from "@emotion/css";
import Button from "./Button";

type Props = {
    className?: string | ClassNamesArg,
    children: ReactNode
} & HTMLAttributes<HTMLButtonElement>

const LargeButton = ({
    className,
    children,
    ...buttonProps
}: Props) => (
  <Button {...buttonProps} className={cx(style, className)}>
    {children}
  </Button>
);
export default LargeButton;

const style = css`
  font-size: clamp(1em, 5vw, 2em);
  padding: 0.1em 0.3em;
  border: 0.1em var(--colour-accent) solid;
  color: var(--colour-accent);
  background: transparent;
  border-radius: 0.4em;
`