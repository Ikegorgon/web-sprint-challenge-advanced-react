import React, { useState } from 'react';

// Suggested initial states
const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  const [state, setState] = useState({message: initialMessage, email: initialEmail, steps: initialSteps, index: initialIndex});

  function getXY(index) {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const coordinates = ["(1, 1)", "(2, 1)", "(3, 1)", "(1, 2)", "(2, 2)", "(3, 2)", "(1, 3)", "(2, 3)", "(3, 3)"];

    return coordinates[index];
  }

  function getXYMessage(index) {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const coords = getXY(index);
    return 'Coordinates ' + coords;
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    document.getElementById('email').value = '';
    setState({message: initialMessage, email: initialEmail, steps: initialSteps, index: initialIndex});
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    let newIndex = state.index;
    let newMessage = state.message;
    if (direction === 'left') {
      if ((newIndex) % 3 !== 0) {
        newIndex-= 1;
        newMessage = '';
      } else {
        newMessage = "You can't go left";
      }
    } else if (direction === 'right') {
      if ((newIndex + 1) % 3 !== 0) {
        newIndex+= 1;
        newMessage = '';
      } else {
        newMessage = "You can't go right";
      }
    } else if (direction === 'up') {
      if (newIndex >= 3) {
        newIndex-= 3;
        newMessage = '';
      } else {
        newMessage = "You can't go up";
      }
    } else if (direction === 'down') {
      if (newIndex < 6) {
        newIndex+= 3;
        newMessage = '';
      } else {
        newMessage = "You can't go down";
      }
    }
    setState({...state, 
      index: newIndex, 
      steps: (state.index !== newIndex ? (state.steps + 1) : state.steps), 
      message: newMessage});
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    getNextIndex(evt.target.id);
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setState({...state, email: evt.target.value});
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const x = getXY(state.index).toString().charAt(1);
    const y = getXY(state.index).toString().charAt(4);
    const steps = state.steps;
    const email = state.email;
    fetch("http://localhost:9000/api/result", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "x": x, "y": y, "steps": steps, "email": email })
    })
      .then(response => response.json())
      .then(response => {
        setState({...state, message: response.message})
      })
      document.getElementById('email').value = '';
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage(state.index)}</h3>
        <h3 id="steps">You moved {state.steps} time{state.steps === 1 ? '' : 's'}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === state.index ? ' active' : ''}`}>
              {idx === state.index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{state.message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form>
        <input id="email" type="email" placeholder="type email" onChange={onChange}></input>
        <input id="submit" type="submit" onClick={onSubmit}></input>
      </form>
    </div>
  )
}
