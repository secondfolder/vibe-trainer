import React, {HTMLAttributes} from "react";
import { cx, css, ClassNamesArg } from "@emotion/css";
import Button from "./Button";

type Props = {
    className?: string | ClassNamesArg,
} & HTMLAttributes<HTMLButtonElement>

const CloseButton = ({
    className,
    children,
    ...buttonProps
}: Props) => (
  <Button {...buttonProps} className={cx(style, className)}>
    ×
  </Button>
);
export default CloseButton;


const style = css`
  border: 0pc;
  color: var(--colour-accent);
  background: transparent;
  border-radius: 2em;
  transition: background-color 0.3s ease-in-out;
  font-size: 2em;
  width: 1em;
  height: 1em;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: var(--colour-accent-translucent);
  }
`