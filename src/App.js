import React, { useState, useEffect, useRef } from 'react';
import './App.css';


function App() {

  const defaultBreakTime = 300;
  const defaultSessionTime = 1500;

  const [secondsLeft, setSecondsLeft] = useState(defaultSessionTime);
  const [timer, setTimer] = useState();
  const [breakSecondsLeft, setBreakSecondsLeft] = useState(defaultBreakTime);
  const [breakTimer, setBreakTimer] = useState();
  const [breakLength, setBreakLength] = useState(defaultBreakTime);
  const [sessionLength, setSessionLength] = useState(defaultSessionTime);
  const [isTimerOn, setIsTimerOn] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const myAudio = useRef();


  function startTimer() {
    setIsTimerOn(true)
    const timer = setInterval(() => {
      setSecondsLeft((secondsLeft) => secondsLeft - 1)
    }, 1000);
    setTimer(timer)
  }

  function startBreakTimer() {
    console.log('isTimerOn : ', isTimerOn)
    setIsTimerOn(true)
    const breakTimer = setInterval(() => {
      setBreakSecondsLeft((breakSecondsLeft) => breakSecondsLeft - 1)
    }, 1000);
    setBreakTimer(breakTimer)
  }

  function stopTimer() {
    setIsTimerOn(false)
    clearInterval(timer)
    clearInterval(breakTimer)
  }


  function convertSecsToMins(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`
  }


  function incrementSession() {
    if (!isTimerOn) {
      setSessionLength((sessionLength) => {
        if (sessionLength < 3600) {
          return sessionLength + 60
        } else {
          return sessionLength
        }
      })

    }
  }

  function incrementBreak() {
    if (!isTimerOn) {
      setBreakLength((breakLength) => {
        if (breakLength < 3600) {
          return breakLength + 60
        } else {
          return breakLength
        }
      })

    }
  }

  function decrementSession() {
    if (!isTimerOn) {
      setSessionLength((sessionLength) => {
        if (sessionLength > 60) {
          return sessionLength - 60
        } else {
          return sessionLength
        }
      })

    }
  }

  function decrementBreak() {
    if (!isTimerOn) {
      setBreakLength((breakLength) => {
        if (breakLength > 60) {
          return breakLength - 60
        } else {
          return breakLength
        }
      })
    }
  }

  useEffect(() => {
    if (secondsLeft === 0 || breakSecondsLeft === 0) {
      myAudio.current.play()
    }

    if (secondsLeft === -1) {
      stopTimer()
      setIsOnBreak(true)
      startBreakTimer()
      setSecondsLeft(sessionLength)
    }

    if (breakSecondsLeft === -1) {
      stopTimer()
      setIsOnBreak(false)
      startTimer()
      setBreakSecondsLeft(breakLength)

    }
  }, [secondsLeft, breakSecondsLeft])

  useEffect(() => {
    setSecondsLeft(sessionLength)
    setBreakSecondsLeft(breakLength)
  }, [sessionLength, breakLength])

  function reset() {
    setSessionLength(defaultSessionTime)
    setBreakLength(defaultBreakTime)
    setSecondsLeft(defaultSessionTime)
    stopTimer()
    setIsOnBreak(false)
  }


  return (
    <div className="App">
      <h1>Pomodoro Timer</h1>
      <div id="time-settings">
        <div id="break-label">Break Length</div>
        <div id="break-length">{breakLength / 60}</div>
        <button id="break-decrement" onClick={decrementBreak}>-1 min</button>
        <button id="break-increment" onClick={incrementBreak}>+1 min</button>


        <div id="session-label">Session Length</div>
        <div id="session-length">{sessionLength / 60}</div>
        <button id="session-decrement" onClick={decrementSession}>-1 min</button>
        <button id="session-increment" onClick={incrementSession}>+1 min</button>
      </div>


      <h2 id="timer-label">{isOnBreak ? 'Break' : 'Session'}</h2>


      <div id="time-left">{convertSecsToMins(isOnBreak ? breakSecondsLeft : secondsLeft)}</div>

      <audio id="beep" ref={myAudio} src={'https://sampleswap.org/samples-ghost/SOUND%20EFFECTS%20and%20NOISES/Cheesy%20Lo-Fi%20Sound%20Effects/72[kb]Echo-Harp.aif.mp3'} type='audio' />


      <button id="start_stop" onClick={isTimerOn ? stopTimer : isOnBreak ? startBreakTimer : startTimer}>⏵⏸</button>
      <button id="reset" onClick={reset}>reset</button>

    </div>
  );
}

export default App;
