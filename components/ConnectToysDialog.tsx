import { css } from '@emotion/css';
import React from 'react';
import Button from './Button';
import Dialog from './Dialog';
import Spinner from './Spinner';
import ToyListItem from './ToyListItem';
import useToyControl from '../hooks/toy-control'

type Props = {
  open: boolean,
  onCloseRequest: () => void,
}

const ConnectToysDialog = ({
  open,
  onCloseRequest,
}: Props) => {
  const {
    buttplugScan,
    connectedToys,
    buttplugClientStatus,
  } = useToyControl()

  function renderInitialScreen() {
    return <div className="initialScreen">
      <p>
        <strong>
          To connect a supported bluetooth toy first activate your toys pairing mode (consult your toy&apos;s manual if needed), hit 
          the button below and then select your toy from the list.
        </strong>
      </p>
      <p>
        Vibe Trainer uses a software library called <a href="https://buttplug.io/">Buttplug.io</a> to connect
        to most Bluetooth enabled sex toys (as well as a few non-sex toy devices). You can check if your
        devices are compatible by searching for your toy on <a href="https://iostindex.com/">iostindex.com</a>{" "}
        and checking to see if it is supported by Buttplug.io.
      </p>
      <p>
        Unfortunately connecting toys can sometimes be a fiddly process as there are lots of ways for the 
        connection to fail. Hopefully you don&apos;t run into any issues but if you do you may wish to try a different
        browser, restart your computer/try a different computer, or try a different toy if available (some toys connect
        more reliably than others).
      </p>
      <Button
        className="connectToyButton"
        onClick={buttplugScan}
      >
        Connect a Toy
      </Button>
    </div>
  }

  function renderPrimaryScreen() {
    return <div className="primaryScreen">
      <header>
        <Button
          onClick={buttplugScan}
        >
          Connect another toy
        </Button>
      </header>
      <div className="content">
        {(buttplugClientStatus === 'not loaded' || buttplugClientStatus === 'error')
          ? "An error has occurred. Please try reloading the page."
          : <>
            {buttplugClientStatus === 'scanning' && <Spinner />}
            <ul className="toys">
              {connectedToys.map((toy, i) => <li key={toy.name + i}>
                <ToyListItem toy={toy} />
              </li>)}
            </ul>
          </>
        }
      </div>
    </div>
  }
  return (
    <Dialog 
      isOpen={open}
      contentLabel="Connect Toys Dialog"
      onRequestClose={onCloseRequest}
      className={style}
    >
      {(connectedToys.length === 0 && buttplugClientStatus !== 'not loaded' && buttplugClientStatus !== 'error') 
        ? renderInitialScreen()
        : renderPrimaryScreen()
      }
    </Dialog>
  )
}

export default ConnectToysDialog

const style = css`
  .initialScreen {
    padding: 2em;

    p:first-child {
      margin-top: 0;
    }
    .connectToyButton {
      font-size: 1.2em;
      padding: 0.5em 0.7em;
      margin: 2em auto 0;
      display: block;
    }
  }

  .primaryScreen {
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-rows: max-content 1fr;
    gap: 0.2em;
    overflow: hidden;
    width: 100%;

    .content {
      overflow-y: auto;
    }

    .toys {
      padding-inline-start: 0;
      list-style-type: none;
      width: 100%;

      li {
        padding: 0.5em;

        &:nth-child(even) {
          background: var(--colour-background-tone);
        }
      }
    }
  }
`