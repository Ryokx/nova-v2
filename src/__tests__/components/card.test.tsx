import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("applies base styles", () => {
    render(<Card data-testid="card">Content</Card>);
    const card = screen.getByTestId("card");
    expect(card.className).toContain("bg-white");
    expect(card.className).toContain("rounded-xl");
  });

  it("applies hover styles when hover prop is true", () => {
    render(<Card hover data-testid="card">Hover</Card>);
    expect(screen.getByTestId("card").className).toContain("hover:-translate-y-0.5");
  });

  it("does not apply hover styles by default", () => {
    render(<Card data-testid="card">No hover</Card>);
    expect(screen.getByTestId("card").className).not.toContain("hover:-translate-y-0.5");
  });
});

describe("CardHeader", () => {
  it("renders", () => {
    render(<CardHeader data-testid="header">Header</CardHeader>);
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });
});

describe("CardTitle", () => {
  it("renders as h3", () => {
    render(<CardTitle>Title</CardTitle>);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Title");
  });
});

describe("CardContent", () => {
  it("renders children", () => {
    render(<CardContent>Body</CardContent>);
    expect(screen.getByText("Body")).toBeInTheDocument();
  });
});
