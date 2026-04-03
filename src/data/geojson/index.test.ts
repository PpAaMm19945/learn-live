import { describe, it, expect } from "vitest";
import { getChapterGeoJSON } from "./index";

describe("getChapterGeoJSON", () => {
  it("should return an object with regions, routes, and markers for valid chapters 1-9", () => {
    for (let i = 1; i <= 9; i++) {
      const result = getChapterGeoJSON(i);
      expect(result).not.toBeNull();
      expect(result).toHaveProperty("regions");
      expect(result).toHaveProperty("routes");
      expect(result).toHaveProperty("markers");
    }
  });

  it("should return correct data for Chapter 1", () => {
    const result = getChapterGeoJSON(1);
    expect(result).not.toBeNull();
    // Verify that it contains expected features
    expect(result?.regions.type).toBe("FeatureCollection");
    expect(Array.isArray(result?.regions.features)).toBe(true);

    // Check for a known property in Chapter 1 regions
    const mizraim = result?.regions.features.find((f: any) => f.properties.id === "mizraim");
    expect(mizraim).toBeDefined();
    expect(mizraim.properties.chapter).toBe(1);
  });

  it("should return null for unknown chapters", () => {
    expect(getChapterGeoJSON(0)).toBeNull();
    expect(getChapterGeoJSON(10)).toBeNull();
    expect(getChapterGeoJSON(-1)).toBeNull();
  });
});
