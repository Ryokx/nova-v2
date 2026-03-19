import { render, screen, fireEvent } from "@testing-library/react";
import { Input, Textarea, Select } from "@/components/ui/input";

describe("Input", () => {
  it("renders with placeholder", () => {
    render(<Input placeholder="Email" />);
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<Input label="Email" error="Champ requis" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Champ requis");
  });

  it("sets aria-invalid when error is present", () => {
    render(<Input label="Email" error="Invalid" />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
  });

  it("handles value changes", () => {
    const onChange = jest.fn();
    render(<Input placeholder="test" onChange={onChange} />);
    fireEvent.change(screen.getByPlaceholderText("test"), { target: { value: "hello" } });
    expect(onChange).toHaveBeenCalled();
  });
});

describe("Textarea", () => {
  it("renders with label", () => {
    render(<Textarea label="Description" />);
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
  });

  it("shows error", () => {
    render(<Textarea label="Desc" error="Too short" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Too short");
  });
});

describe("Select", () => {
  const options = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];

  it("renders options", () => {
    render(<Select options={options} label="Choose" />);
    expect(screen.getByLabelText("Choose")).toBeInTheDocument();
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
  });

  it("renders placeholder", () => {
    render(<Select options={options} placeholder="Select..." />);
    expect(screen.getByText("Select...")).toBeInTheDocument();
  });
});
