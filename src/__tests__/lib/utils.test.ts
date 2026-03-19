import { cn, getInitials, formatPrice } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("handles conditional classes", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });

  it("handles undefined/null", () => {
    expect(cn("a", undefined, null, "b")).toBe("a b");
  });
});

describe("getInitials", () => {
  it("returns two letters from two-word name", () => {
    expect(getInitials("Jean-Michel Petit")).toBe("JP");
  });

  it("returns one letter from single name", () => {
    expect(getInitials("Admin")).toBe("A");
  });

  it("uppercases initials", () => {
    expect(getInitials("sophie laurent")).toBe("SL");
  });

  it("handles three-word names", () => {
    expect(getInitials("Jean Michel Petit")).toBe("JM");
  });
});

describe("formatPrice", () => {
  it("formats amount in EUR", () => {
    const result = formatPrice(320);
    expect(result).toContain("320");
    expect(result).toContain("€");
  });

  it("formats decimal amounts", () => {
    const result = formatPrice(236.5);
    expect(result).toContain("236");
  });

  it("formats zero", () => {
    const result = formatPrice(0);
    expect(result).toContain("0");
  });
});
