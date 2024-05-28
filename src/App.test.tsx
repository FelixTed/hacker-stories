import { render, screen } from '@testing-library/react';
import App from './App.tsx';

describe("Something thruty and falsy", () => {
  it("true to be true", () =>{
    expect(true).toBeTruthy();
  });

  it("false to be false", () => {
    expect(false).toBeFalsy();
  });
});