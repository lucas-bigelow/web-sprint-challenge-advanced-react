import React from 'react';
import axios from 'axios';

const GRID_SIZE = 3;
const URL = 'http://localhost:9000/api/result';

const initialState = {
  grid: ['', '', '', '', 'B', '', '', '', ''],
  timesMoved: 0,
  message: '',
  email: ''
};

export default class AppClass extends React.Component {
  // see 'AppFunctional.js' for PSEUDO CODE
  // I copy and pasted all the functions from functional into the class based component and
  // did the necessary name tweeks to make everything work

  // new state syntax without constructor
  state = initialState;

  /* --- HELPER FUNCTIONS --- */

  // gets the index of the 'active' cell from the array in state
  getActiveIndex = () => {
    return this.state.grid.indexOf('B');
  }

  // helper 'y' function for the function below
  helperY = currentIndex => {
    for (let i = 1; i <= GRID_SIZE; i++) {
      if (currentIndex < GRID_SIZE * i) {
        return i;
      }
    }
  }

  // gets the current active cell's coordinates and returns them as two integers
  getCurrentCoordinates = () => {
    const currentIndex = this.getActiveIndex();

    // gets the horizontal 'x' based on the size of the grid, for instance:
    // if the index is 0, our 'x' would be 1, 0 modulo 3 = 0, 0 + 1 = 1 
    // if index is 5, our 'x' would be 3, 5 modulo 3 = 2, 2 + 1 = 3
    const x = currentIndex % GRID_SIZE + 1;

    // if index less than gs * 1, return 1
    // if index less than gs * 2, return 2
    // if index less than gs * 3, return 3

    // gets the vertical 'y' using the above helper function because I'm bad at math:
    const y = this.helperY(currentIndex);

    return [x, y];
  }

  // gets the current coordinates and outputs them in a string format for display
  stringifyCoordinates = () => {
    const [x, y] = this.getCurrentCoordinates();
    return `(${x}, ${y})`;
  }

  // switches the 'active' cell from the previous index to the new index
  flipActiveIndex = (previousIndex, newIndex, grid) => {
    grid[previousIndex] = '';
    grid[newIndex] = 'B';
    return grid;
  }

  // this monolith (TODO: BREAKDOWN) moves the 'active' cell the correct direction, or returns a specific
  // error message if the desired move is out of bounds
  outOfBoundsHelper = direction => {
    const [x, y] = this.getCurrentCoordinates();
    const activeIndex = this.getActiveIndex();

    const newGrid = [...this.state.grid];

    switch (direction) {
      case 'left':
        if (x === 1) {
          this.setState({...this.state, message: 'You can\'t go left'})
          return;
        }
        this.setState({
          ...this.state,
          grid: this.flipActiveIndex(activeIndex, activeIndex - 1, newGrid),
          timesMoved: this.state.timesMoved + 1,
          message: ''
        });
        break;
      case 'right':
        if (x === GRID_SIZE) {
          this.setState({...this.state, message: 'You can\'t go right'})
          return;
        }
        this.setState({
          ...this.state,
          grid: this.flipActiveIndex(activeIndex, activeIndex + 1, newGrid),
          timesMoved: this.state.timesMoved + 1,
          message: ''
        });
        break;
      case 'up':
        if (y === 1) {
          this.setState({...this.state, message: 'You can\'t go up'})
          return;
        }
        this.setState({
          ...this.state,
          grid: this.flipActiveIndex(activeIndex, activeIndex - GRID_SIZE, newGrid),
          timesMoved: this.state.timesMoved + 1,
          message: ''
        });
        break;
      case 'down':
        if (y === GRID_SIZE) {
          this.setState({...this.state, message: 'You can\'t go down'})
          return;
        }
        this.setState({
          ...this.state,
          grid: this.flipActiveIndex(activeIndex, activeIndex + GRID_SIZE, newGrid),
          timesMoved: this.state.timesMoved + 1,
          message: ''
        });
        break;
    }
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates (2, 2)</h3>
          <h3 id="steps">You moved 0 times</h3>
        </div>
        <div id="grid">
          <div className="square"></div>
          <div className="square"></div>
          <div className="square"></div>
          <div className="square"></div>
          <div className="square active">B</div>
          <div className="square"></div>
          <div className="square"></div>
          <div className="square"></div>
          <div className="square"></div>
        </div>
        <div className="info">
          <h3 id="message"></h3>
        </div>
        <div id="keypad">
          <button id="left">LEFT</button>
          <button id="up">UP</button>
          <button id="right">RIGHT</button>
          <button id="down">DOWN</button>
          <button id="reset">reset</button>
        </div>
        <form>
          <input id="email" type="email" placeholder="type email"></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
