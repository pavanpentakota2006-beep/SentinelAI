import React from "react";
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { StoreProvider, useStore } from "./store";

describe("StoreContext and Simulator State", () => {
  it("provides initial mock alerts and incidents", () => {
    const { result } = renderHook(() => useStore(), {
      wrapper: ({ children }) => <StoreProvider>{children}</StoreProvider>,
    });

    expect(result.current.alerts.length).toBeGreaterThan(0);
    expect(result.current.incidents.length).toBeGreaterThan(0);
    expect(result.current.isSimulatorRunning).toBe(true);
  });

  it("toggles simulator state correctly", () => {
    const { result } = renderHook(() => useStore(), {
      wrapper: ({ children }) => <StoreProvider>{children}</StoreProvider>,
    });

    act(() => {
      result.current.toggleSimulator();
    });
    expect(result.current.isSimulatorRunning).toBe(false);

    act(() => {
      result.current.toggleSimulator();
    });
    expect(result.current.isSimulatorRunning).toBe(true);
  });

  it("updates alert status upon triage action", () => {
    const { result } = renderHook(() => useStore(), {
      wrapper: ({ children }) => <StoreProvider>{children}</StoreProvider>,
    });

    const targetAlert = result.current.alerts[0];
    act(() => {
      result.current.updateAlertStatus(targetAlert.id, "investigating");
    });

    const updated = result.current.alerts.find((a) => a.id === targetAlert.id);
    expect(updated?.status).toBe("investigating");
  });
});
