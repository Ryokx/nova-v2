import { render, screen, fireEvent } from "@testing-library/react";
import { StarRating } from "@/components/features/star-rating";

describe("StarRating", () => {
  it("renders 5 stars", () => {
    render(<StarRating value={3} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(5);
  });

  it("fills stars up to value", () => {
    const { container } = render(<StarRating value={3} readonly />);
    const filled = container.querySelectorAll(".fill-gold");
    expect(filled).toHaveLength(3);
  });

  it("calls onChange when star is clicked", () => {
    const onChange = jest.fn();
    render(<StarRating value={0} onChange={onChange} />);
    fireEvent.click(screen.getAllByRole("button")[2]!);
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("disables buttons when readonly", () => {
    render(<StarRating value={4} readonly />);
    screen.getAllByRole("button").forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it("has accessible labels", () => {
    render(<StarRating value={2} />);
    expect(screen.getByLabelText("1 étoile")).toBeInTheDocument();
    expect(screen.getByLabelText("3 étoiles")).toBeInTheDocument();
  });
});
