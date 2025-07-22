// src/pages/__tests__/Home.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import Home from "./Home";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { characterMockResponses, mockData } from "../constants/mocks";
import {
  MemoryRouter,
  RouterProvider,
  createMemoryRouter,
} from "react-router-dom";
import { routes } from "../router/Router";
import userEvent from "@testing-library/user-event";

beforeEach(() => {
  vi.stubGlobal("fetch", (input: RequestInfo) => {
    const url = typeof input === "string" ? input : input.url;

    const key = Object.keys(characterMockResponses).find(
      (endpoint) => url == endpoint
    );

    const responseKey = key ? characterMockResponses[key] : null;
    const mockResponse = responseKey ? mockData[responseKey] : null;

    if (!mockResponse) {
      return Promise.resolve(
        new Response(JSON.stringify({ error: "Not found" }), { status: 404 })
      );
    }

    return Promise.resolve(
      new Response(JSON.stringify(mockResponse), { status: 200 })
    );
  });
});

describe("Home page", () => {
  it("renders default character list", async () => {
    const memoryRouter = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });

    render(<RouterProvider router={memoryRouter} />);

    await waitFor(() => {
      expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
    });

    expect(screen.getByTestId("character-list").children.length).toBe(20);
  });

  it("renders filtered character list: name=Memory", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const input = screen.getByPlaceholderText(/Search.../i);
    await userEvent.type(input, "Memory");
    await waitFor(() => {
      expect(screen.getByTestId("character-list").children.length).toBe(6);
    });
    expect(screen.getByText("Memory Geardude")).toBeInTheDocument();
  });

  it("renders filtered character list: name=Memory&status=alive", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Search.../i);
    await userEvent.type(input, "Memory");
    await waitFor(() => {
      expect(screen.getByTestId("character-list").children.length).toBe(6);
    });
    expect(screen.getByText("Memory Geardude")).toBeInTheDocument();

    const statusSelect = screen.getAllByRole("combobox")[0];
    await userEvent.selectOptions(statusSelect, "alive");
    await waitFor(() => {
      expect(screen.getByTestId("character-list").children.length).toBe(1);
    });
    expect(screen.getByText("Young Memory Rick")).toBeInTheDocument();
  });

  it("renders filtered character list: name=Memory&status=dead&gender=female", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Search.../i);
    await userEvent.type(input, "Memory");
    await waitFor(() => {
      expect(screen.getByTestId("character-list").children.length).toBe(6);
    });
    expect(screen.getByText("Memory Geardude")).toBeInTheDocument();

    const [statusSelect, genderSelect] = screen.getAllByRole("combobox");
    await userEvent.selectOptions(genderSelect, "female");
    await userEvent.selectOptions(statusSelect, "dead");
    await waitFor(() => {
      expect(screen.getByTestId("character-list").children.length).toBe(1);
    });
    expect(screen.getByText("Memory Tammy")).toBeInTheDocument();
  });

  it("Wrong filter: name=qwewrqwrqwr", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const input = screen.getByPlaceholderText(/Search.../i);
    await userEvent.type(input, "qwewrqwrqwr");
    await waitFor(() => {
      expect(
        screen.getByText("Sorry... We found nothing. :(")
      ).toBeInTheDocument();
    });

    expect(screen.getByTestId("character-list").children.length).toBe(0);
  });
});
