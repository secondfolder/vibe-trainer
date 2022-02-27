import React from "react";
import { css } from "@emotion/css";

type Props = {
  percentFull: number
}

const VerticalBar = ({percentFull}: Props) => {
  return <div className={style}>
    <div className="bar" style={{height: percentFull + '%'}}></div>
  </div>;
};
export default VerticalBar;

const style = css`
  height: 100%;
  width: 1em;
  position: relative;
  border-radius: 1em;
  overflow: hidden;    
  background-color: transparent;
  border: 1px var(--colour-neutral) solid;

  .bar {
    background-color: var(--colour-success);
    width: 100%;
    position: absolute;
    bottom: 0;
    transition: height 500ms;
    border-radius: 0 0 1em 1em;
  }
`;
