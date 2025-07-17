import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Tag from "./Tag";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

describe("Tag component", () => {
  it("presence of a reset button ", () => {
    render(<Tag />);
    expect(screen.getByText("Reset")).toBeInTheDocument();
  });

  it("presence of cell 1", () => {
    render(<Tag />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("Score movments change", async () => {
    render(<Tag tagSize={3} />);
    expect(screen.getByText(/moves: 0/i)).toBeInTheDocument();

    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{ArrowLeft}");
    const updatedMoves = await screen.findByText(/moves: 2/i);
    expect(updatedMoves).toBeInTheDocument();
  });

  it("Check win", async () => {
    render(<Tag tagSize={2} />);

    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{ArrowLeft}");
    const updatedMoves = await screen.findByText(/moves: 2/i);
    expect(updatedMoves).toBeInTheDocument();
  });
});
