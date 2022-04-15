import React from 'react';
import { useState } from 'react';
import axios from 'axios';

const GRID_SIZE = 3;
const URL = 'http://localhost:9000/api/result';

const initialState = {
  grid: ['', '', '', '', 'B', '', '', '', ''],
  timesMoved: 0,
  message: '',
  email: ''
};

export default function AppFunctional(props) {
  // PSEUDO CODE:
  // 1. set up state
  // 2. set up helper functions to pull out information and update from state:
  //  a. the current x and y given the array
  //  b. the number of times a user has moved
  //  c. check if a user can move in a given direction
  //  d. change the active 'cell' when a user moves
  //  e. reset the board when a user clicks the 'reset' button
  //  f. submit the current board to the server when a user says so
  // 3. tie event listeners to all the buttons for movement, submission, and reset
  // 4. visually change the active cell based on state
  // 5. display a message when a user submits


  // first, we set up our necessary state
  const [gridState, setGridState] = useState(initialState);

  /* --- HELPER FUNCTIONS --- */

  // gets the index of the 'active' cell from the array in state
  const getActiveIndex = () => {
    return gridState.grid.indexOf('B');
  }

  // helper 'y' function for the function below
  const helperY = currentIndex => {
    for (let i = 1; i <= GRID_SIZE; i++) {
      if (currentIndex < GRID_SIZE * i) {
        return i;
      }
    }
  }

  // gets the current active cell's coordinates and returns them as two integers
  const getCurrentCoordinates = () => {
    const currentIndex = getActiveIndex();

    // gets the horizontal 'x' based on the size of the grid, for instance:
    // if the index is 0, our 'x' would be 1, 0 modulo 3 = 0, 0 + 1 = 1 
    // if index is 5, our 'x' would be 3, 5 modulo 3 = 2, 2 + 1 = 3
    const x = currentIndex % GRID_SIZE + 1;

    // if index less than gs * 1, return 1
    // if index less than gs * 2, return 2
    // if index less than gs * 3, return 3

    // gets the vertical 'y' using the above helper function
    const y = helperY(currentIndex);

    return [x, y];
  }

  // gets the current coordinates and outputs them in a string format for display
  const stringifyCoordinates = () => {
    const [x, y] = getCurrentCoordinates();
    return `(${x}, ${y})`;
  }

  // switches the 'active' cell from the previous index to the new index
  const flipActiveIndex = (previousIndex, newIndex, grid) => {
    grid[previousIndex] = '';
    grid[newIndex] = 'B';
    return grid;
  }

  // this monolith (TODO: BREAKDOWN) moves the 'active' cell the correct direction, or returns a specific
  // error message if the desired move is out of bounds
  const outOfBoundsHelper = direction => {
    const [x, y] = getCurrentCoordinates();
    const activeIndex = getActiveIndex();

    const newGrid = [...gridState.grid];

    switch (direction) {
      case 'left':
        if (x === 1) {
          setGridState({...gridState, message: 'You can\'t go left'})
          return;
        }
        setGridState({
          ...gridState,
          grid: flipActiveIndex(activeIndex, activeIndex - 1, newGrid),
          timesMoved: gridState.timesMoved + 1,
          message: ''
        });
        break;
      case 'right':
        if (x === GRID_SIZE) {
          setGridState({...gridState, message: 'You can\'t go right'})
          return;
        }
        setGridState({
          ...gridState,
          grid: flipActiveIndex(activeIndex, activeIndex + 1, newGrid),
          timesMoved: gridState.timesMoved + 1,
          message: ''
        });
        break;
      case 'up':
        if (y === 1) {
          setGridState({...gridState, message: 'You can\'t go up'})
          return;
        }
        setGridState({
          gridState,
          grid: flipActiveIndex(activeIndex, activeIndex - GRID_SIZE, newGrid),
          timesMoved: gridState.timesMoved + 1,
          message: ''
        });
        break;
      case 'down':
        if (y === GRID_SIZE) {
          setGridState({...gridState, message: 'You can\'t go down'})
          return;
        }
        setGridState({
          gridState,
          grid: flipActiveIndex(activeIndex, activeIndex + GRID_SIZE, newGrid),
          timesMoved: gridState.timesMoved + 1,
          message: ''
        });
        break;
    }
  }

  /* --- EVENT HANDLERS --- */

  // handles a user changing their email
  const handleInputChange = evt => {
    setGridState({...gridState, email: evt.target.value});
  }

  // handles when a user clicks on a direction
  const handleMovement = evt => {
    outOfBoundsHelper(evt.target.id);
  }

  // handles when a user wants to reset their board
  const handleReset = () => {
    setGridState(initialState);
  }

  // makes a post request when a user submits their info, giving them a success or fail message
  const handleSubmit = evt => {
    evt.preventDefault();
    const [x, y] = getCurrentCoordinates();

    axios.post(URL, { x: x, y: y, steps: gridState.timesMoved, email: gridState.email })
      .then(res => setGridState({...gridState, message: res.data.message, email: ''}))
      .catch(err => {
        setGridState({...gridState, message: err.response.data.message})
      });
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        {/* change the coordinates and number of times moved based on information from state */}
        <h3 id="coordinates">Coordinates {stringifyCoordinates()}</h3>
        <h3 id="steps">You moved {gridState.timesMoved} {gridState.timesMoved === 1 ? "time" : "times"}</h3>
      </div>
      <div id="grid">
        {/* dynamically render the various squares based on whether or not the given square is 'active' (either '' or 'B') */}
        {gridState.grid.map(square => {
            return <div className={square ? "square active" : "square"}>{square}</div>
        })}
      </div>
      <div className="info">
        <h3 id="message">{gridState.message}</h3>
      </div>
      <div id="keypad">
          <button id="left" onClick={handleMovement}>LEFT</button>
          <button id="up" onClick={handleMovement}>UP</button>
          <button id="right" onClick={handleMovement}>RIGHT</button>
          <button id="down" onClick={handleMovement}>DOWN</button>
          <button id="reset" onClick={handleReset}>reset</button>
        </div>
        <form onSubmit={handleSubmit}>
          <input id="email" type="email" placeholder="type email" value={gridState.email} onChange={handleInputChange}></input>
          <input id="submit" type="submit"></input>
        </form>
    </div>
  )
}
