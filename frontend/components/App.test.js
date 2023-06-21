import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AppClass from './AppClass';
import AppFunctional from './AppFunctional';

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

test('Render Components', () => {
    render(<AppFunctional />);
    expect(AppClass).toBeTruthy();
    render(<AppClass />);
    expect(AppClass).toBeTruthy();
})

test('AppFunctional Buttons Work', () => {
    render(<AppFunctional />);
    fireEvent.click(up);
    fireEvent.click(left);
    fireEvent.click(reset);
    fireEvent.click(right);
    fireEvent.click(down);
    expect(coordinates.textContent).toContain('Coordinates (3, 3)');
})

test('AppClass Buttons Work', () => {
    render(<AppClass />);
    fireEvent.click(up);
    fireEvent.click(left);
    fireEvent.click(reset);
    fireEvent.click(right);
    fireEvent.click(down);
    expect(coordinates.textContent).toContain('Coordinates (3, 3)');
})

test('AppFunctional Steps Count Correctly', () => {
    render(<AppFunctional />);
    fireEvent.click(up);
    fireEvent.click(up);
    fireEvent.click(left);
    fireEvent.click(right);
    fireEvent.click(right);
    fireEvent.click(right);
    fireEvent.click(right);
    fireEvent.click(down);
    fireEvent.click(up);
    expect(steps.textContent).toMatch("You moved 6 times");
})

test('AppClass Steps Count Correctly', () => {
    render(<AppClass />);
    fireEvent.click(up);
    fireEvent.click(up);
    fireEvent.click(left);
    fireEvent.click(right);
    fireEvent.click(right);
    fireEvent.click(right);
    fireEvent.click(right);
    fireEvent.click(down);
    fireEvent.click(up);
    expect(steps.textContent).toMatch("You moved 6 times");
})