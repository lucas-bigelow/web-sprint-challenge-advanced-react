import React from 'react';
import AppClass from './AppClass';
import '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';

describe('Testing AppClass component', () => {
  test('header coordinate info renders', () => {
    render(<AppClass />)

    const coordinateInfo = screen.queryByText(/Coordinates \([123], [123]\)/);
    expect(coordinateInfo).toBeInTheDocument();
  })

  test('right button renders with text', () => {
    render(<AppClass />)
  
    const rightButton = screen.queryByText('RIGHT');
    expect(rightButton).toBeInTheDocument();
  })

  test('email should be empty to start and change when a user types', () => {
    render(<AppClass />)

    const input = screen.getByPlaceholderText('type email');
    fireEvent.change(input, {target: {value: 'rob@gmail.com'}})
    expect(input.value).toBe('rob@gmail.com');
  })

  test('message content should say you cannot go up if going up too many times', () => {
    render (<AppClass />)

    const upButton = screen.queryByText('UP');
    fireEvent.click(upButton);
    fireEvent.click(upButton);

    const messageContent = screen.queryByText('You can\'t go up');
    expect(messageContent).toBeInTheDocument();
  })

  test('message content should say you cannot go down if going down too many times', () => {
    render(<AppClass />)

    const downButton = screen.queryByText('DOWN');
    fireEvent.click(downButton);
    fireEvent.click(downButton);

    const messageContent = screen.queryByText('You can\'t go down');
    expect(messageContent).toBeInTheDocument();
  })
})
