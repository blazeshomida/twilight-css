import { handlePrimitives } from "@/lib/handlePrimitives";
import { TAILWIND_PRIMITIVES } from "@/themes/tailwind";
import { describe, expect, it } from "vitest";

const baseRootCSSVariables = {
  "--clr-inherit": "inherit",
  "--clr-current": "currentColor",
  "--clr-transparent": "transparent",
  "--clr-black": "0% 0 0",
  "--clr-white": "100% 0 0",
};

describe("handlePrimitives", () => {
  it("generates CSS variables for neutral colors", () => {
    const { twPluginPrimitives } = handlePrimitives({
      neutral: TAILWIND_PRIMITIVES.neutral,
    });
    // Only assert on unique aspects of this test case to avoid duplication
    expect(twPluginPrimitives[":root"]).toMatchObject({
      ...baseRootCSSVariables,
      "--clr-neutral-50": "99% 0 0",
      // More neutral color assertions...
    });
  });

  it("includes custom black color correctly", () => {
    const customBlack = "hsl(0, 0%, 5%)";
    const { twPluginPrimitives } = handlePrimitives({
      neutral: TAILWIND_PRIMITIVES.neutral,
      black: { DEFAULT: customBlack },
    });
    // Assert only the part related to custom black
    expect(twPluginPrimitives[":root"]["--clr-black"]).toBe("16% 0 0");
  });

  it("filters out empty CSS strings", () => {
    const { twPluginPrimitives } = handlePrimitives({
      neutral: TAILWIND_PRIMITIVES.neutral,
      orange: { "50": "" },
    });
    // Assert that orange-50 does not exist
    expect(twPluginPrimitives[":root"]).not.toHaveProperty("--clr-orange-50");
  });

  it("handles invalid user colors gracefully", () => {
    const { twPluginPrimitives } = handlePrimitives({
      gray: { "50": "r(25,344,52)" }, // Invalid color
    });
    // Verify invalid colors are omitted
    expect(twPluginPrimitives[":root"]).not.toHaveProperty("--clr-gray-50");
  });

  it("returns only default values when provided with an empty configuration", () => {
    const { twPluginPrimitives } = handlePrimitives({});
    // Assert the structure for empty input matches the default values
    expect(twPluginPrimitives[":root"]).toStrictEqual(baseRootCSSVariables);
  });

  it("creates shade variables for Tailwind configuration", () => {
    const { twPresetPrimitives } = handlePrimitives({
      neutral: TAILWIND_PRIMITIVES.neutral,
    });
    // Assert only on unique outcomes of this test
    expect(twPresetPrimitives.neutral).toMatchObject({
      "50": "oklch(var(--clr-neutral-50) / <alpha-value>)",
      // More assertions on shades...
    });
  });
});