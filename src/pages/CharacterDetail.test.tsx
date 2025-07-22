// CharacterDetail.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CharacterDetail from "./CharacterDetail";
import { useAuthStore } from "../store/authStore";
import * as favoritesUtils from "../utils/favorites";
import userEvent from "@testing-library/user-event";

// 1. Мокаем fetch и localStorage
const mockCharacter = {
  id: 1,
  name: "Rick Sanchez",
  status: "Alive",
  species: "Human",
  gender: "Male",
  origin: { name: "Earth" },
  location: { name: "Earth" },
  image: "some-image-url",
};

vi.stubGlobal(
  "fetch",
  vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockCharacter),
    })
  )
);

// 2. Перед каждым тестом сбрасываем Zustand и мокаем localStorage
beforeEach(() => {
  useAuthStore.setState({ userId: "test-user-id" });
  localStorage.clear();

  vi.spyOn(favoritesUtils, "isFavorite").mockReturnValue(false);
  vi.spyOn(favoritesUtils, "toggleFavorite").mockImplementation(() => {});
});

function renderWithRouter() {
  render(
    <MemoryRouter initialEntries={["/characters/1"]}>
      <Routes>
        <Route path="/characters/:id" element={<CharacterDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("CharacterDetail", () => {
  it("renders character details", async () => {
    renderWithRouter();

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Rick Sanchez/i)).toBeInTheDocument();
      expect(screen.getByText(/Alive/i)).toBeInTheDocument();
      expect(screen.getByAltText("not in Favorite")).toBeInTheDocument();
    });
  });

  it("calls toggleFavorite on heart click", async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/Rick Sanchez/i)).toBeInTheDocument();
    });

    const button = screen.getByRole("button");
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByAltText("in Favorite")).toBeInTheDocument();
    });
    expect(favoritesUtils.toggleFavorite).toHaveBeenCalledWith(
      "test-user-id",
      mockCharacter.id
    );
  });
});
