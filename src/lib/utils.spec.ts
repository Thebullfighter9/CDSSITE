import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn utility", () => {
  it("merges class names", () => {
    const result = cn("p-2", { hidden: false, block: true }, "text-sm");
    expect(result).toBe("p-2 block text-sm");
  });
});
