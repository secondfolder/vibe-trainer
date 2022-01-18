import React, { useEffect, useRef} from "react";
import { cx, css, ClassNamesArg } from "@emotion/css";
import ColorScale from "color-scales"
import useDarkMode from "../hooks/dark-mode";
import useDevicePixelRatio from "../hooks/device-pixel-ratio";
import useTypefaceLoaded from "../hooks/typeface-loaded";

type Props = {
    className?: string | ClassNamesArg
}

const canvasHeight = 400     
const canvasWidth = 600

const SiteTitle = ({
    className,
}: Props) => {
  const requestRef = useRef<number | null>()
  const previousTimeRef = useRef<number>()
  const maxTravelDistance = 200
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentlyHoveringRef = useRef<boolean>();
  const lineOffsets = useRef<number[]>([]);

  const darkMode = useDarkMode()
  const devicePixelRatio = useDevicePixelRatio()
  const typefaceLoaded = useTypefaceLoaded('Lemon')

  function getColours() {
    const background = getComputedStyle(document.documentElement)
      .getPropertyValue('--colour-background').trim();
    const line = getComputedStyle(document.documentElement)
      .getPropertyValue('--colour-background-tone').trim();
    const lineScale =  new ColorScale(
      0,
      maxTravelDistance,
      [line, background]
    );
    return {background, line, lineScale}
  }

  const {current: colours} = useRef(getColours())

  useEffect(() => {
    const newColours = getColours()
    colours.background = newColours.background
    colours.line = newColours.line
    colours.lineScale = newColours.lineScale
  }, [darkMode])

  useEffect(() => {
    if (!requestRef.current) {
      requestRef.current = requestAnimationFrame(drawFrame);
    }
  }, [typefaceLoaded])

  useEffect(() => {
    const canvasElm = canvasRef.current;
    if (!canvasElm) {
      return
    }
    const canvasContext = canvasElm.getContext("2d");
    if (!canvasContext) {
      return
    }

    if(devicePixelRatio !== 1 ){
      canvasContext.resetTransform()
      canvasContext.scale(devicePixelRatio, devicePixelRatio)
    }
  }, [devicePixelRatio])
  
  const drawFrame = (time: number) => {
    const lineWidth = 20

    const timeSinceLastFrame = time - (previousTimeRef.current || time)
    const lifeTimeOfLine = 3 * 1000
    const additionalOffset = (maxTravelDistance / lifeTimeOfLine) * timeSinceLastFrame
    const additionalOffsetRounded = Math.round(additionalOffset * 2) / 2
    
    
    if (typeof previousTimeRef.current !== 'undefined' && !additionalOffsetRounded) {
      // No changes, nothing to draw, so skip this frame
      requestRef.current = requestAnimationFrame(drawFrame)
      return
    }

    previousTimeRef.current = time

    const canvasElm = canvasRef.current;
    if (!canvasElm) {
      return
    }

    const canvasContext = canvasElm.getContext("2d");
    const ctx = canvasContext

    if (!canvasContext) {
      return
    }

    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);


    // If the title is being hovered over and there's enough of a gap between the 
    // title and the closest line then start a new line
    const smallestLineOffset = lineOffsets.current[lineOffsets.current.length - 1]
    if (
      currentlyHoveringRef.current && 
      (typeof smallestLineOffset === 'undefined' || smallestLineOffset > (lineWidth * 2))
    ) {
      lineOffsets.current.push(1)
    }


    canvasContext.font = "bold 5rem Lemon, sans-serif";
    canvasContext.textAlign = "center";

    const linesToDraw = lineOffsets.current.length > 0

    const line1Height = (canvasHeight / 2) - 45
    const line2Height = (canvasHeight / 2) + 60
    
    if (linesToDraw) {
      // Due to the fact that we can't actually draw stroke lines offset we cheat
      // by drawing increasingly wider stroke lines with the thinner lines stacked
      // on top of the wider lines. For that to work we need to make we draw the
      // widest lines first.
      lineOffsets.current = lineOffsets.current.sort((a, b) => b - a)
  
      for (const lineOffset of lineOffsets.current) {
        paintLine(canvasContext, lineOffset, colours.lineScale.getColor(lineOffset).toHexString())
        paintLine(canvasContext, lineOffset - lineWidth, colours.background)
      }
      lineOffsets.current = lineOffsets.current
        .map(lineOffset => lineOffset + additionalOffset)
        .filter(lineOffset => lineOffset <= maxTravelDistance)
    }

    function paintLine(
      canvasContext: CanvasRenderingContext2D,
      offset: number,
      colour: string
    ) {
      if (offset <= 0) {
        return
      }
      canvasContext.strokeStyle = colour
      canvasContext.lineWidth = offset
      canvasContext.strokeText("Vibe", canvasWidth / 2, line1Height);
      canvasContext.strokeText("Trainer", canvasWidth / 2, line2Height);
    }

    // Draw actual title itself
    canvasContext.fillStyle = getComputedStyle(document.documentElement)
      .getPropertyValue('--colour-accent').trim()
    canvasContext.fillText("Vibe", canvasWidth / 2, line1Height);
    canvasContext.fillText("Trainer", canvasWidth / 2, line2Height);

    if (linesToDraw) {
      requestRef.current = requestAnimationFrame(drawFrame)
    } else {
      previousTimeRef.current = undefined
      requestRef.current && cancelAnimationFrame(requestRef.current)
      requestRef.current = null
    }
  }

  useEffect(() => {
    // we need to draw at least 1 frame on mount so title is visible
    requestRef.current = requestAnimationFrame(drawFrame);
    return () => {
      requestRef.current && cancelAnimationFrame(requestRef.current);
    }
  }, []);

  function startAnimation() {
    currentlyHoveringRef.current = true
    if (!requestRef.current) {
      requestRef.current = requestAnimationFrame(drawFrame);
    }
  }

  function stopAnimation() {
    currentlyHoveringRef.current = false
  }

  return (
    <div className={cx(className, style)}>
      <h1 
        onPointerEnter={startAnimation}
        onPointerLeave={stopAnimation}
      >
        Vibe Trainer
      </h1>
      <canvas 
        ref={canvasRef}
        width={canvasWidth * devicePixelRatio}
        height={canvasHeight * devicePixelRatio}
      ></canvas>
    </div>
  )

};
export default SiteTitle;

const style = css`
  position: relative;
  z-index: 0;

  h1 {
    font-size: 5rem;
    font-size: 80px;
    color: transparent;
    margin: 0;
    font-family: Lemon;
    width: min-content;
    text-align: center;
    z-index: 1;
    position: relative;
    margin-bottom: 0.5em;
  }

  canvas {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: ${canvasWidth}px;
    height: ${canvasHeight}px;
  }
`