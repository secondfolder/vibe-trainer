import React from "react";
import { cx, css, ClassNamesArg } from "@emotion/css";
import type {PromptLineType} from '../hooks/speech-manager'

type Props = {
  promptInfo: PromptLineType,
  showIncorrectWords: boolean,
  className: string | ClassNamesArg
}

const PromptLine = ({
  promptInfo,
  className,
  showIncorrectWords
}: Props) => {
  if ('complete' in promptInfo) {
    return null
  }
  return <p className={cx(style, className)}>
    <span className="matched">{promptInfo.matched}</span>
    <span className="incorrect">{showIncorrectWords ? promptInfo.failedToMatch : ''}</span>
    <span className="remaining">{(showIncorrectWords ? '' : promptInfo.failedToMatch) + promptInfo.remaining}</span>
  </p>
}

export default PromptLine;

const style = css`
  font-size: 5em;
  text-align: center;
  color: var(--colour-neutral);
  width: 100%;
  margin: 0;
  

  &.previous {
    position: absolute;
  }

  .matched {
    color: var(--colour-success);
  }

  .incorrect {
    color: var(--colour-issue);
  }
`;