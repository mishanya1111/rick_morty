import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi, beforeEach } from "vitest";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { characterMockResponses, mockData } from "../constants/mocks";
import * as authStore from "../store/authStore";
import { routes } from "../router/Router";

const mockedUserId = "user-123";
// Мокаем zustand store
vi.mock("../store/authStore", async () => {
  const actual = await import("../store/authStore");
  return {
    ...actual,
    useAuthStore: vi.fn(),
  };
});

beforeEach(() => {
  // Сброс localStorage
  localStorage.clear();

  // Мокаем fetch
  global.fetch = vi.fn((url: unknown) => {
    if (typeof url !== "string") {
      return Promise.reject(new Error("Invalid URL"));
    }

    const key = characterMockResponses[url];
    //
    if (key && mockData[key]) {
      return Promise.resolve({
        ok: true,
        //
        json: () => Promise.resolve(mockData[key]),
      } as Response);
    }

    return Promise.reject(new Error(`Unhandled request: ${url}`));
  });

  //@ts-expect-error idk what it is
  authStore.useAuthStore.mockImplementation((selector) =>
    selector({
      userId: mockedUserId,
      setUserId: vi.fn(),
      login: vi.fn(),
    })
  );

  localStorage.setItem("favorites", JSON.stringify({ [mockedUserId]: [] }));
});

describe("Favorites interaction flow", () => {
  it("lets user sign up, like characters and see them on Favorites page", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/signup"],
    });

    render(<RouterProvider router={router} />);

    await userEvent.type(screen.getByPlaceholderText(/name/i), "TestUser");
    await userEvent.type(
      screen.getByPlaceholderText(/email address/i),
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

    // Отправка формы
    await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Переход на главную через клик по логотипу
    const logo = await screen.findByRole("link", { name: /rick & morty/i });
    await userEvent.click(logo);

    // Ожидаем загрузки карточек
    const cards = await screen.findAllByTestId("character-card");
    expect(cards.length).toBeGreaterThanOrEqual(10); // часть из 20

    // Кликаем лайк на 3 карточках
    const likeButtons = await screen.findAllByRole("button", {
      name: /not in Favorite/i,
    });
    expect(likeButtons.length).toBeGreaterThanOrEqual(3);

    await userEvent.click(likeButtons[0]);
    await userEvent.click(likeButtons[1]);
    await userEvent.click(likeButtons[2]);

    // Переход в Favorites
    const favoritesLink = screen.getByRole("link", { name: /favorites/i });
    await userEvent.click(favoritesLink);

    // Дождаться 3 избранных карточек
    await waitFor(() => {
      const favoriteCards = screen.getAllByTestId("character-card");
      expect(favoriteCards.length).toBe(3);
    });
  });
});
