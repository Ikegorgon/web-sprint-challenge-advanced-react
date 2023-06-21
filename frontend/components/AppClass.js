import React from 'react';

// Suggested initial states
const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor() {
    super();
    this.state ={...initialState}
  };

  getXY = (index) => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const coordinates = ["(1, 1)", "(2, 1)", "(3, 1)", "(1, 2)", "(2, 2)", "(3, 2)", "(1, 3)", "(2, 3)", "(3, 3)"];

    return coordinates[index];
  }

  getXYMessage = (index) => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const coords = this.getXY(index);
    return 'Coordinates ' + coords;
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    document.getElementById('email').value = '';
    this.setState({...initialState});
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    let newIndex = this.state.index;
    let newMessage = this.state.message;
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
    this.setState({...this.state, 
      index: newIndex, 
      steps: (this.state.index !== newIndex ? (this.state.steps + 1) : this.state.steps), 
      message: newMessage});
  }

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    this.getNextIndex(evt.target.id);
  }

  onChange = (evt) => {
    // You will need this to update the value of the input.
    this.setState({...this.state, email: evt.target.value});
  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    console.log(this.state)
    const x = this.getXY(this.state.index).toString().charAt(1);
    const y = this.getXY(this.state.index).toString().charAt(4);
    const steps = this.state.steps;
    const email = this.state.email;
    fetch("http://localhost:9000/api/result", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "x": x, "y": y, "steps": steps, "email": email })
    })
      .then(response => response.json())
      .then(response => this.setState({...this.state, message: response.message}))
      document.getElementById('email').value = '';
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage(this.state.index)}</h3>
          <h3 id="steps">You moved {this.state.steps} time{this.state.steps === 1 ? '' : 's'}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move}>LEFT</button>
          <button id="up" onClick={this.move}>UP</button>
          <button id="right" onClick={this.move}>RIGHT</button>
          <button id="down" onClick={this.move}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form>
          <input id="email" type="email" placeholder="type email" onChange={this.onChange}></input>
          <input id="submit" type="submit" onClick={this.onSubmit}></input>
        </form>
      </div>
    )
  }
}
