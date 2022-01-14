import React, {useEffect, useState} from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useVibeLevel } from "../contexts/vibe-level";
import {useInterval} from './timers'
import { WordCoordinates } from "../components/Teleprompter";
import { breakIntoSentences, escapeRegExp } from "../lib/strings";

type Props = {
  promptText: string,
}

export type PromptInfoType = {
  currentLine: PromptLineType, 
  previousLine?: PromptLineType,
  numOfWordsRemaining: number,
  totalNumberOfWords: number,
  totalNumOfLines: number,
}

export type PromptLineType = {
  matched: string,
  failedToMatch: string,
  remaining: string,
  unmatchedTranscript: string,
  previousPrompt?: PromptInfoType,
  lineNumber: number,
  currentWordNumber: number,
}

export default ({
  promptText,
}: Props) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [vibeLevel, setVibeLevel] = useVibeLevel()

  type SessionStatus = 'not-started' | 'started' | 'complete' | 'browser-not-supported'

  const [sessionStatus, setSessionStatus] = useState<SessionStatus>(
    (typeof window === 'undefined') || browserSupportsSpeechRecognition 
      ? 'not-started'
      : 'browser-not-supported'
  )

  const [wordsToSkip, setWordsToSkip] = useState<WordCoordinates[]>([])

  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)

  if (!browserSupportsSpeechRecognition && (typeof window === 'undefined')) {
    return {
      restartSession: () => {},
      setListeningStatus: () => {},
      promptInfo: null,
      skipWord: () => {},
      listening: false,
      sessionStatus
    }
  }

  const promptSentences = breakIntoSentences(promptText)

  const promptSentence = promptSentences[currentSentenceIndex]

  const [promptInfo, setPromptInfo] = useState(generatePromptInfo)

  const [previousPromptLine, setPreviousPromptLine] = useState<PromptLineType>()

  function generatePromptInfo(): PromptInfoType {
    let matchedPromptWords: string[] = []
    let promptWordToMatch = ''
    let remainingPromptWords = promptSentence
      .replaceAll(/[\s\n]+/g, ' ')
      .trim()
      .split(/(?=\s+)/)

    let currentWordNumber = 0

    let transcriptWords = transcript ? transcript.split(/(?=\s)/) : []
    let incorrectTranscript = ''
  
    while (transcriptWords.length) {
      const nextTranscriptWord = transcriptWords[0]
      if (!promptWordToMatch) {
        promptWordToMatch = (remainingPromptWords.shift() as string)
      }
      if (typeof promptWordToMatch === 'undefined') {
        debugger
      }
      currentWordNumber = matchedPromptWords.length + 1
      const skipWord = wordsToSkip.some(
        coordinates => (coordinates[0] === (currentSentenceIndex + 1)) && (coordinates[1] === currentWordNumber)
      )
      const normalisedNextTranscriptWord = escapeRegExp(nextTranscriptWord.trim()).replaceAll('\\*', '.')
      const normalisedNextPromptWord = promptWordToMatch.trim()
      if (skipWord || normalisedNextPromptWord.match(new RegExp(normalisedNextTranscriptWord))) {
        matchedPromptWords.push(promptWordToMatch)
        promptWordToMatch = ''
        transcriptWords.shift()
        incorrectTranscript = ''

      } else {
        incorrectTranscript += transcriptWords.shift()
      }
    }

    const newPromptInfo = {
      currentLine: {
        matched: matchedPromptWords.join(''),
        failedToMatch: promptWordToMatch,
        remaining: remainingPromptWords.join(''),
        unmatchedTranscript: incorrectTranscript,
        lineNumber: currentSentenceIndex + 1,
        currentWordNumber,
      },
      previousLine: previousPromptLine,
      numOfWordsRemaining: remainingPromptWords.length + 
        promptSentences.slice(currentSentenceIndex + 1).reduce(
          (total, promptSentence) => total + promptSentence.split(/\s+/).length,
          0
        ),
      totalNumOfLines: promptSentences.length,
      totalNumberOfWords: promptText.trim().split(/\s+/).length,
    }
    return newPromptInfo
  }

  useEffect(() => {
    if (sessionStatus !== 'started') {
      return
    }
    let newPromptInfo = generatePromptInfo()

    // Resetting the transcript does not seem to be enough. If some audio is still being processed 
    // when the transcript is reset then after that processing is complete it will set the transcript
    // again. So instead we actually have to abort listening and processing first.
    if (!newPromptInfo.currentLine.failedToMatch && !newPromptInfo.currentLine.remaining) {
      // @ts-ignore
      SpeechRecognition.abortListening().then(
        () => {
          resetTranscript()
          setPreviousPromptLine(newPromptInfo.currentLine)
          if ((currentSentenceIndex + 1) < promptSentences.length) {
            setCurrentSentenceIndex(currentSentenceIndex+1)
          }
          newPromptInfo = generatePromptInfo()

          if (newPromptInfo.numOfWordsRemaining) {
            SpeechRecognition.startListening({ continuous: true })
          } else {
            setSessionStatus('complete')
          }
          setPromptInfo(newPromptInfo)
        }
      )
    } else {
      setPromptInfo(newPromptInfo)
    }

  }, [transcript, currentSentenceIndex, wordsToSkip, sessionStatus])
  
  useEffect(() => {
    if (promptInfo.numOfWordsRemaining !== promptInfo.totalNumberOfWords) {
      const newVibeLevel = Math.min(
        vibeLevel + (
          (100 - vibeLevel) * (1 / (promptInfo.numOfWordsRemaining + 1))
        ),
        100
      )
      setVibeLevel?.(newVibeLevel)
    } else {
      setVibeLevel?.(0)
    }
  }, [promptInfo.numOfWordsRemaining])

  useInterval(() => {
    if (sessionStatus === 'started' && promptInfo) {
      const newVibeLevel = Math.max(
        0,
        vibeLevel - ((100 * (1 / promptInfo.totalNumberOfWords) * 0.3))
      )
      setVibeLevel?.(newVibeLevel)
    }
  }, 300)

  const [resumeOnFocus, setResumeOnFocus] = useState(listening)

  useEffect(() => {
    const focusListener = () => {
      if (resumeOnFocus) {
        SpeechRecognition.startListening({ continuous: true })
      }
    }
    window.addEventListener("focus", focusListener)
    const blurListener = () => {
      setResumeOnFocus(listening)
      SpeechRecognition.stopListening()
    }
    window.addEventListener("blur", blurListener)

    return () => {
      window.removeEventListener("focus", focusListener)
      window.removeEventListener("blur", blurListener)
    }
  }, [listening, resumeOnFocus])

  function restartSession() {
    setSessionStatus('started')
    resetTranscript()
    setListeningStatus(true)
    setPreviousPromptLine(undefined)
    setCurrentSentenceIndex(0)
    setVibeLevel?.(0)
  }


  function setListeningStatus(listeningStatus: boolean) {
    if (listeningStatus) {
      SpeechRecognition.startListening({ continuous: true })
    } else {
      SpeechRecognition.stopListening()
    }
  }
  function skipWord(wordCoordinates: WordCoordinates) {
    setWordsToSkip([...wordsToSkip, wordCoordinates])
  }

  return {
    restartSession,
    setListeningStatus,
    promptInfo,
    skipWord,
    listening,
    sessionStatus
  };
};