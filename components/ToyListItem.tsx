import { css } from '@emotion/css';
import React from 'react';
import BatteryGauge from 'react-battery-gauge'
import Button from './Button';
import type { Toy } from '../hooks/toy-control'

import arrayToSentence from 'array-to-sentence';
import { Icon } from '@iconify/react';

type Props = {
  toy: Toy,
}

const ToyListItem = ({toy}: Props) => {
  function getToyDescription(toy: Toy) {
    const features = []
    const {vibrationMotors, linearActuators, rotationalMotors} = toy.features
    if (vibrationMotors) {
      features.push(`${vibrationMotors} motor${vibrationMotors > 1 ? 's' : ''} for vibration`)
    }
    if (linearActuators) {
      features.push(`${linearActuators} linear actuator${linearActuators > 1 ? 's' : ''}`)
    }
    if (rotationalMotors) {
      features.push(`${rotationalMotors} motor${rotationalMotors > 1 ? 's' : ''} for rotation`)
    }

    return `This toy has ${arrayToSentence(features)}.`
  }
  
  const batteryLevel = toy.batteryLevel && toy.batteryLevel * 100
  return (
    <details className={style}>
      <summary>
          <div>
            <Icon className="toggleExpansionIndicator" icon="ep:arrow-right" />
            {toy.name}
          </div>
          <div>
            {batteryLevel !== null && 
              <span title={`Battery level: ${batteryLevel}%`}>
                <BatteryGauge
                  className="batteryGauge"
                  value={batteryLevel}
                  size={40}
                  customization={{
                    batteryBody: {
                      strokeWidth: 8,
                      strokeColor: 'var(--colour-text-main)',
                    },
                    batteryCap: {
                      strokeWidth: 8,
                      strokeColor: 'var(--colour-text-main)',
                      capToBodyRatio: 0.5
                    },
                    batteryMeter: {
                      outerGap: 3,
                    },
                    readingText: {
                      fontSize: 0
                    }
                  }}
                ></BatteryGauge>
              </span>
            }
          </div>
      </summary>
      <p>{getToyDescription(toy)}</p>
      <div className='controls'>
        <Button onClick={() => toy.activate(1)}>
          Turn on
        </Button>
        <Button onClick={() => toy.device.stop()}>
          Turn off
        </Button>
        <Button
          onClick={() => toy.activate(1, 500)}
        >
          Pulse
        </Button>
      </div>
    </details>
  )
}

export default ToyListItem

const style = css`
  &[open] summary {
    .toggleExpansionIndicator {
      transform: translateY(-0.05em) rotate(90deg);
    }
  }

  summary {
    display: flex;
    justify-content: space-between;
    font-weight: bold;

    .toggleExpansionIndicator {
      transition: color, transform 0.3s;
      margin-right: 0.3em;
    }

    &:hover {
      color: var(--colour-accent);
    }

    svg {
      vertical-align: middle;
    }
    .batteryGauge {
      height: 2ex;
      display: inline-block;
    }
  }

  .controls {
    display: flex;
    gap: 0.3em;
  }
`