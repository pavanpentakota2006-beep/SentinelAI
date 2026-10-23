import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OverviewGauge } from "./OverviewGauge";

describe("OverviewGauge Component", () => {
  it("renders health gauge with appropriate value and status label", () => {
    const { container } = render(<OverviewGauge type="health" value={92} size={200} />);
    expect(screen.getByText("92%")).toBeInTheDocument();
    expect(screen.getByText("Overall System Status")).toBeInTheDocument();
    expect(screen.getByText("Normal")).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders threat gauge with threat level label and value", () => {
    render(<OverviewGauge type="threat" value={76} size={200} />);
    expect(screen.getByText("76%")).toBeInTheDocument();
    expect(screen.getByText("Current Threat Level")).toBeInTheDocument();
  });

  it("renders SVG circular bezel and indicator elements", () => {
    const { container } = render(<OverviewGauge type="health" value={85} size={180} />);
    expect(container.querySelectorAll("circle").length).toBeGreaterThanOrEqual(2);
    expect(container.querySelectorAll("line").length).toBeGreaterThanOrEqual(1);
  });
});
