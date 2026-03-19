import { render, screen } from "@testing-library/react";
import { Avatar } from "@/components/ui/avatar";

describe("Avatar", () => {
  it("renders initials when no src", () => {
    render(<Avatar name="Jean-Michel Petit" />);
    expect(screen.getByText("JP")).toBeInTheDocument();
  });

  it("renders single letter for single name", () => {
    render(<Avatar name="Admin" />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("applies size classes", () => {
    const { container } = render(<Avatar name="Test User" size="lg" />);
    expect(container.firstChild).toHaveClass("w-14", "h-14");
  });

  it("sets aria-label", () => {
    render(<Avatar name="Sophie Laurent" />);
    expect(screen.getByLabelText("Sophie Laurent")).toBeInTheDocument();
  });

  it("renders Image when src is provided", () => {
    render(<Avatar name="Test" src="/avatar.jpg" />);
    const img = screen.getByAltText("Test");
    expect(img).toBeInTheDocument();
  });
});
