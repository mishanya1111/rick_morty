// __tests__/authFlow.test.tsx
import { describe, it, expect, beforeEach } from "vitest";
import { screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { routes } from "../router/Router";

// Очищаем localStorage перед каждым тестом
beforeEach(() => {
  localStorage.clear();
});

describe("Full Auth Flow", () => {
  it("Sign up, logout and login again", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/signin"],
    });

    render(<RouterProvider router={router} />);

    await userEvent.click(screen.getByRole("link", { name: /sign up/i }));
    expect(
      await screen.findByRole("heading", { name: /sign up/i })
    ).toBeInTheDocument();

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

    // Проверка, что мы на домашней странице и кнопка Log Out доступна
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /log out/i })
      ).toBeInTheDocument();
    });

    // Нажимаем Log Out
    await userEvent.click(screen.getByRole("button", { name: /log out/i }));

    // Переход на форму входа
    expect(
      await screen.findByRole("heading", { name: /sign in/i })
    ).toBeInTheDocument();

    // Вводим те же данные
    await userEvent.type(
      screen.getByPlaceholderText(/email address/i),
      "test@example.com"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/^password$/i),
      "Test123!"
    );

    // Вход
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    // Проверка наличия Log Out снова
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /log out/i })
      ).toBeInTheDocument();
    });
  });
});
