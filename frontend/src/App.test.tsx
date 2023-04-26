import React from "react";
import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Weather header", () => {
  render(<App />);
  const linkElement = screen.getByText(/Weather App/i);
  expect(linkElement).toBeInTheDocument();
});
