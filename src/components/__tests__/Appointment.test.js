import React from "react";
import { render } from "@testing-library/react";
import Application from "../Application";
import Appointment from "components/Appointment";

describe("Appointment", () => {
  it("Renders without crashing", () => {
    render(<Appointment />);
  });
});
