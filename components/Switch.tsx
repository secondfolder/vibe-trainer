import React from "react";
import { cx, css, ClassNamesArg } from "@emotion/css";
import ReactSwitch from "react-switch";

type Props = {
  checked: boolean,
  onChange: (newIsOn: boolean) => void,
  className?: string | ClassNamesArg,
} & React.ComponentProps<typeof ReactSwitch>

const Switch = ({
  checked,
  onChange,
  className,
  children,
  ...reactSwitchProps
}: Props) => (
  <ReactSwitch 
    checkedIcon={<span className="icon">On</span>}
    uncheckedIcon={<span className="icon">Off</span>}
    height={20}
    width={53}
    handleDiameter={18}
    {...reactSwitchProps}
    className={cx(style, className, checked ? 'on' : 'off')}
    onChange={onChange}
    checked={checked} 
  />
);
export default Switch;

const style = css`
  margin: 0 0.3em;

  .icon {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--colour-background);
  }

  &.on {
    .icon {
      padding-left: 0.2em;
    }
  }

  &.off {
    .icon {
      padding-right: 0.3em;
    }
  }
`