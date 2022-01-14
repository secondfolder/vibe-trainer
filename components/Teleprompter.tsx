import React, {useEffect, useState} from "react";
import { cx, css } from "@emotion/css";
import type {PromptInfoType} from '../hooks/speech-manager'
import PromptLine from './PromptLine'
import Spinner from "./Spinner";
import Button from "./Button";

type Props = {
  promptInfo: PromptInfoType,
  onSkipWordRequest: (cords: WordCoordinates) => void
}

export type WordCoordinates = [number, number]

const Teleprompter = ({
  promptInfo,
  onSkipWordRequest
}: Props) => {
  const [transitioningPrompt, setTransitioningPrompt] = useState(true)
  const [showSpinner, setShowSpinner] = useState(false)
  const [showIncorrectResponse, setShowIncorrectResponse] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showSkipWord, setShowSkipWord] = useState(false)

  useEffect(() => {
    setTransitioningPrompt(true)
    const timerId = setTimeout(() => setTransitioningPrompt(false), 1000)

    return () => {
      clearTimeout(timerId)
    }
  }, [promptInfo.currentLine.lineNumber])

  useEffect(() => {
    let spinnerShowTimerId: NodeJS.Timeout | null = null
    let incorrectResponseShowTimerId: NodeJS.Timeout | null = null
    let hintShowTimerId: NodeJS.Timeout | null = null
    let skipWordShowTimerId: NodeJS.Timeout | null = null

    if (promptInfo.currentLine.failedToMatch) {
      spinnerShowTimerId = setTimeout(() => setShowSpinner(true), 200)
      incorrectResponseShowTimerId = setTimeout(() => setShowIncorrectResponse(true), 1000)
      hintShowTimerId = setTimeout(() => setShowHint(true), 5000)
      skipWordShowTimerId = setTimeout(() => setShowSkipWord(true), 15000)
    } else {
      spinnerShowTimerId && clearTimeout(spinnerShowTimerId)
      incorrectResponseShowTimerId && clearTimeout(incorrectResponseShowTimerId)
      hintShowTimerId && clearTimeout(hintShowTimerId)
      skipWordShowTimerId && clearTimeout(skipWordShowTimerId)
  
      showSpinner && setShowSpinner(false)
      showIncorrectResponse && setShowIncorrectResponse(false)
      showHint && setShowHint(false)
      showSkipWord && setShowSkipWord(false)
    }

    return () => {
      spinnerShowTimerId && clearTimeout(spinnerShowTimerId)
      incorrectResponseShowTimerId && clearTimeout(incorrectResponseShowTimerId)
      hintShowTimerId && clearTimeout(hintShowTimerId)
      skipWordShowTimerId && clearTimeout(skipWordShowTimerId)
  
      showSpinner && setShowSpinner(false)
      showIncorrectResponse && setShowIncorrectResponse(false)
      showHint && setShowHint(false)
      showSkipWord && setShowSkipWord(false)
    }
  }, [!!promptInfo.currentLine.failedToMatch, promptInfo.currentLine.currentWordNumber])

  function skipWord() {
    const lineIndex = promptInfo.currentLine.lineNumber
    const wordIndex = promptInfo.currentLine.currentWordNumber
    const wordCoordinates: WordCoordinates = [lineIndex, wordIndex]
    onSkipWordRequest(wordCoordinates)
  }

  return (
    <div className={style}>
      <div className="prompts">
        {promptInfo.currentLine.lineNumber === 1 && promptInfo.currentLine.matched === '' && 
          <p>Say the following words aloud:</p>
        }
        {promptInfo.previousLine && transitioningPrompt && 
          <PromptLine 
            promptInfo={promptInfo.previousLine} 
            className={cx('previous', 'slide-out')}
            showIncorrectWords={showIncorrectResponse}
          />
        }
        <PromptLine 
          promptInfo={promptInfo.currentLine}
          className={cx({'slide-in': transitioningPrompt})}
          showIncorrectWords={showIncorrectResponse}
        />
      </div>
      <div className="transcriptContainer">
        {showSpinner && !showIncorrectResponse && <Spinner className="spinner" />}
        {showIncorrectResponse && <p className="transcript">
          {promptInfo.currentLine.unmatchedTranscript}</p>
        }
        {showHint && <p className="hint">
          (try repeating the whole sentence slowly and like you mean it)
        </p>}
        {showSkipWord && <Button className="skipWord" onClick={skipWord}>Skip word</Button>}
      </div>
    </div>
  )
};
export default Teleprompter;

const style = css`
  width: 100%;

  display: grid; 
  grid-template-rows: 1fr 1fr; 
  gap: 0px 0px; 
  align-content: center;
  text-align: center;

  .prompts {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: end;
  }

  .prompt.previous {
    position: absolute;
  }

  .transcriptContainer {
    display: flex;
    flex-direction: column;
    align-items: center;

    .spinner {
      transform: scale(0.4);
    }

    .transcript {
      text-align: center;
      color: var(--colour-issue);
    }

    .skipWord {
      margin: 1em;
    }
  }

  .slide-in {
    animation: slideIn 500ms ease-in;
  }
  .slide-out {
    animation: slideOut 500ms ease-in forwards;
  }

  @keyframes slideIn {
    0% {
      transform: translate(0, 100%);
      opacity: 0;
    }
    100% {
      transform: translate(0, 0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    0% {
      transform: translate(0, 0);
      opacity: 1;
    }
    100% {
      transform: translate(0, -100%);
      opacity: 0;
    }
  }
`;
