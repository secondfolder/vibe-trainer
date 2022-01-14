import React, {HTMLAttributes, ReactNode} from "react";
import { cx, css, ClassNamesArg } from "@emotion/css";

type Props = {
    className?: string | ClassNamesArg,
    children: ReactNode
} & HTMLAttributes<HTMLButtonElement>

const Button = ({
    className,
    children,
    ...buttonProps
}: Props) => (
  <button {...buttonProps} className={cx(style, className)}>
    {children}
  </button>
);
export default Button;


const style = css`
  border: 1px var(--colour-accent) solid;
  color: var(--colour-accent);
  background: transparent;
  border-radius: 0.4em;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: var(--colour-accent-translucent);
  }
`