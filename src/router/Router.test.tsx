import { describe, it, expect } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { routes } from "./Router";

describe("Router test", () => {
  it("Navigate to Sign In and Sign Up ", async () => {
    const memoryRouter = createMemoryRouter(routes, {
      initialEntries: ["/signin"],
    });

    render(<RouterProvider router={memoryRouter} />);

    expect(
      await screen.findByRole("heading", { name: /sign in/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: /Sign Up/i }));

    expect(await screen.getByPlaceholderText(/Name/i)).toBeInTheDocument();
  });

  it("Navigate to /signin, back to Home page and change filter", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/signin"],
    });

    render(<RouterProvider router={router} />);

    expect(
      await screen.findByRole("heading", { name: /sign in/i })
    ).toBeInTheDocument();

    const logo = screen.getByAltText(/icon rick & morty/i);
    await userEvent.click(logo);
    await screen.findByPlaceholderText(/search/i);

    const input = screen.getByPlaceholderText(/search/i);
    await userEvent.clear(input);
    await userEvent.type(input, "Rick");

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/");
      expect(router.state.location.search).toContain("name=Rick");
    });
  });
});
