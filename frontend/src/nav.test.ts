import { describe, it, expect } from "vitest";
import { NAV } from "./nav";

describe("Navigation Configuration", () => {
  it("should contain all 22 defined operational pages", () => {
    expect(NAV.length).toBe(22);
  });

  it("should have valid routes starting with /", () => {
    NAV.forEach((item) => {
      expect(item.path.startsWith("/")).toBe(true);
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.icon).toBeDefined();
    });
  });

  it("should include the 5 Core Operational SOC Dashboards", () => {
    const paths = NAV.map((n) => n.path);
    expect(paths).toContain("/");
    expect(paths).toContain("/incidents");
    expect(paths).toContain("/threat-intel");
    expect(paths).toContain("/alerts");
    expect(paths).toContain("/attack-graph");
  });

  it("should group routes logically into categories", () => {
    const groups = [...new Set(NAV.map((n) => n.group))];
    expect(groups).toContain("Monitor");
    expect(groups).toContain("Investigate");
    expect(groups).toContain("Environment");
    expect(groups).toContain("Respond");
    expect(groups).toContain("Workspace");
    expect(groups).toContain("Platform");
    expect(groups).toContain("Admin");
  });
});
