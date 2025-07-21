import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi, beforeEach } from "vitest";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { routes } from "../router/Router";
import * as authStore from "../store/authStore";
import { characterMockResponses, mockData } from "../constants/mocks";
import { URL_CHARACTER } from "../constants/URL";
import type { Character } from "../constants/types";

const mockedUserId = "user-123";

vi.mock("../store/authStore", async () => {
  const actual = await import("../store/authStore");
  return {
    ...actual,
    useAuthStore: vi.fn(),
  };
});

beforeEach(() => {
  localStorage.clear();

  // Мокаем fetch
  global.fetch = vi.fn((url: unknown) => {
    if (typeof url !== "string") return Promise.reject("Invalid URL");

    const ids = url.startsWith(URL_CHARACTER) && url.replace(URL_CHARACTER, "");
    if (ids && /^\d+(,\d+)*$/.test(ids)) {
      const selectedIds = ids.split(",").map(Number);
      const result = (mockData["details_Characters"] as Character[]).filter(
        (char) => selectedIds.includes(char.id)
      );
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(result.length === 1 ? result[0] : result),
      } as Response);
    }

    const key = characterMockResponses[url];
    if (key && mockData[key]) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData[key]),
      } as Response);
    }

    return Promise.reject(new Error("Unhandled request: " + url));
  });

  //@ts-expect-error
  authStore.useAuthStore.mockImplementation((selector) =>
    selector({
      userId: mockedUserId,
      setUserId: vi.fn(),
      login: vi.fn(),
    })
  );
});

describe("History interaction flow", () => {
  it("registers, views characters and sees them in history", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/signup"],
    });

    render(<RouterProvider router={router} />);

    // Регистрация
    await userEvent.type(screen.getByPlaceholderText(/name/i), "TestUser");
    await userEvent.type(
      screen.getByPlaceholderText(/email/i),
      "test@example.com"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/^password$/i),
      "Test123!"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/confirmation/i),
      "Test123!"
    );
    await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Переход в History — должно быть пусто
    await userEvent.click(screen.getByRole("link", { name: /history/i }));
    await screen.findByText(/History is empty/i);

    // Переход на главную
    await userEvent.click(screen.getByRole("link", { name: /rick & morty/i }));

    // Ждём карточки
    const cards = await screen.findAllByTestId("character-card");
    expect(cards.length).toBeGreaterThanOrEqual(3);

    // Нажимаем на "Read more" у первых 3 карточек
    const readMoreLinks = await screen.findAllByRole("link", {
      name: /read more/i,
    });
    await userEvent.click(readMoreLinks[0]);
    await screen.findByText(/location/i);

    await userEvent.click(screen.getByRole("link", { name: /rick & morty/i }));
    await userEvent.click(
      (
        await screen.findAllByRole("link", { name: /read more/i })
      )[1]
    );
    await screen.findByText(/location/i);

    await userEvent.click(screen.getByRole("link", { name: /rick & morty/i }));
    await userEvent.click(
      (
        await screen.findAllByRole("link", { name: /read more/i })
      )[2]
    );
    await screen.findByText(/location/i);

    await userEvent.click(screen.getByRole("link", { name: /history/i }));

    await waitFor(() => {
      const historyCards = screen.getAllByTestId("character-card");
      expect(historyCards.length).toBe(3);
    });
  });
});
