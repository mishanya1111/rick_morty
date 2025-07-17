import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TagPage from "./TagPage";
import "@testing-library/jest-dom";

describe("TagPage  component", () => {
  it("presence of a reset button ", () => {
    render(<TagPage />);
    expect(
      screen.getByRole("button", { name: /Apply length/i })
    ).toBeInTheDocument();
  });

  it("changes size of tags and the presence of corresponding tiles", () => {
    render(<TagPage />);
    let length = 5;
    const input = screen.getByLabelText(/Tag length:/i);
    const applyB = screen.getByRole("button", { name: /Apply length/i });

    fireEvent.change(input, { target: { value: length } });
    fireEvent.click(applyB);
    expect(screen.getByText(length * length - 1)).toBeInTheDocument();

    length = 6;
    fireEvent.change(input, { target: { value: length } });
    fireEvent.click(applyB);
    expect(screen.getByText(length * length - 1)).toBeInTheDocument();
  });

  it("changes size of tags and the unpresence tiles", () => {
    render(<TagPage />);
    const length = 5;
    const input = screen.getByLabelText(/Tag length:/i);
    const applyB = screen.getByRole("button", { name: /Apply length/i });

    fireEvent.change(input, { target: { value: length } });
    fireEvent.click(applyB);
    expect(screen.queryByText(length * length)).not.toBeInTheDocument();
  });
});
