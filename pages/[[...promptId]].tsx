import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { cx, css } from "@emotion/css";
import Teleprompter from '../components/Teleprompter'
import useToyControl from '../hooks/toy-control'
import VerticalBar from '../components/VerticalBar'
import { useVibeLevel } from '../contexts/vibe-level';
import useSpeechManager from '../hooks/speech-manager';
import LargeButton from '../components/LargeButton';
import magicWandIcon from '../assets/magic-wand.svg'
import buttplugIcon from '../assets/buttplug.svg'
import soundIcon from '../assets/sound.svg'
import Switch from "react-switch";
import Spinner from '../components/Spinner';
import { useRouter } from 'next/router';
import { usePromptText } from '../hooks/prompt-text';
import Button from '../components/Button';
import EditTrainingTextDialog from '../components/EditTrainingTextDialog';

const Home: NextPage = () => {
  const router = useRouter()
  const { promptId } = router.query

  const defaultPrompt = usePromptText(
    Array.isArray(promptId) ? promptId[0] : promptId
  )

  if (!defaultPrompt) {
    window.location.assign('/')
  }

  const [editTrainingTextDialogOpen, setEditTrainingTextDialogOpen] = useState(false)

  const [vibeLevel] = useVibeLevel()

  const {
    restartSession,
    setListeningStatus,
    promptInfo,
    skipWord,
    listening,
    sessionStatus,
  } = useSpeechManager({
    promptText: defaultPrompt || ""
  })

  const {
    buttplugScan,
    connectedDevices,
    buttplugLoaded
  } = useToyControl()
  
  function renderContent() {
    if (sessionStatus === 'browser-not-supported') {
      return <span>
        Browser doesn&apos;t support speech recognition. Please use Google Chrome.
      </span>
    } else if (!buttplugLoaded) {
      return <Spinner className="spinner" />
    } else if (sessionStatus === 'not-started') {
      return <>
        <h1>Vibe Trainer</h1>
        <LargeButton 
          className="connectToy"
          onClick={buttplugScan}
        >
          Connect Toys
        </LargeButton>
        <LargeButton 
          className="beginSession"
          onClick={restartSession}
        >
          Begin Training
        </LargeButton>
      </>
    } else if (sessionStatus === 'complete') {
      return <>
        <p>
          Training complete
        </p>
        <Button onClick={restartSession}>Repeat training?</Button>
      </>
    } else if (promptInfo && sessionStatus === 'started') {
      return <Teleprompter 
        promptInfo={promptInfo}
        onSkipWordRequest={skipWord}
      />
    } else {
      return <span>Error: Unknown state &quot;{sessionStatus}&quot;</span>
    }
  }

  return (
    <div className={cx(style, `session-${sessionStatus}`)}>
      <Head>
        <title>Vibe Trainer</title>
        <meta name="description" content="Vibe Trainer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <EditTrainingTextDialog
        open={editTrainingTextDialogOpen}
        onCloseRequest={() => setEditTrainingTextDialogOpen(false)}
        promptText={defaultPrompt || ""}
      />

      <header>
        {sessionStatus === 'not-started' &&
          <Button onClick={() => setEditTrainingTextDialogOpen(true)}>
            Edit training text
          </Button>
        }
        {sessionStatus === 'started' && <label>
          Mic:
          <Switch 
            onChange={setListeningStatus}
            checked={listening} 
            className={cx('micSwitch', listening ? 'on' : 'off')}
            checkedIcon={<span className="icon">On</span>}
            uncheckedIcon={<span className="icon">Off</span>}
            height={20}
            width={53}
            handleDiameter={18}
          />
        </label>}
      </header>

      <div className="sidebar">
        <VerticalBar percentFull={vibeLevel} />
      </div>
      <main className="content">
        {renderContent()}
      </main>
    </div>
  )
}

export default Home

const style = css`
  min-height: 100vh;
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  display: grid; 
  grid-template-columns: 1fr max-content; 
  grid-template-rows: 2em 1fr; 
  gap: 0px 0px; 
  grid-template-areas: 
    "Header Header"
    "Main Sidebar"
    "Main Sidebar"; 
  overflow-x: hidden;

  h1 {
    font-size: 5em;
    color: var(--colour-accent);
    margin: 0;
  }

  header {
    grid-area: Header;

    .micSwitch {
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
    }
  }

  .sidebar {
    grid-area: Sidebar;
    height: 100%;
    transition: transform 0.5s ease-out;
    padding: 1em;
  }

  main {
    grid-area: Main;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1em;

    h1 {
      font-family: Lemon;
    }

    .spinner {
      div::after {
        background-color: var(--colour-accent);
      }
    }
  }

  &.session-not-started {
    main {
      gap: 1em;

      button.connectToy, button.beginSession {
        display: flex;
        align-items: center;

        &::before, &::after {
          content: " ";
          flex-shrink: 0;
          mask-position: center;
          mask-repeat: no-repeat;
          margin: 0.4em;
          transition: transform 0.3s ease-out;
          width: 1.5em;
          height: 1.5em;

          background-color: var(--colour-accent);
        }
      }

      button.connectToy {
        &::before {
          mask-image: url(${buttplugIcon.src});
        }
        
        &::after {
          mask-image: url(${magicWandIcon.src});
        }

        &:hover::before {
          transform: translateX(-2.7em) rotate(-90deg);
        }

        &:hover::after {
          transform: translateX(2.7em) rotate(90deg);
        }
      }

      button.beginSession {
        &::before {
          mask-image: url(${soundIcon.src});
          transform: rotate(180deg);
        }
        
        &::after {
          mask-image: url(${soundIcon.src});
        }

        &:hover::before {
          transform: translateX(-2.7em) rotate(180deg);
        }

        &:hover::after {
          transform: translateX(2.7em);
        }
      }
    }
  }

  &.session-complete {
    main {
      font-size: 3em;
      color: var(--colour-accent)
    }
  }

  &.session-not-started, &.session-complete {
    grid-template-columns: 1fr 0; 

    .sidebar {
      transform: translateX(200%);
    }
  }
`;
