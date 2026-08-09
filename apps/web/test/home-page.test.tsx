import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HomePage from "@/app/page";
import { createSupabaseMock, createSupabaseQuery } from "@/test/supabase-mock";

const server = vi.hoisted(() => ({ createClient: vi.fn(), cookies: vi.fn(async () => ({})) }));

vi.mock("@/utils/supabase/server", () => ({ createClient: server.createClient }));
vi.mock("next/headers", () => ({ cookies: server.cookies }));

beforeEach(() => server.createClient.mockReset());

describe("home page", () => {
  it("links every fetched business to its catalog", async () => {
    server.createClient.mockReturnValue(
      createSupabaseMock({
        businesses: [
          createSupabaseQuery({
            data: [
              { id: 1, name: "First Store" },
              { id: 2, name: "Second Store" },
            ],
            error: null,
          }),
        ],
      }),
    );

    render(await HomePage());
    expect(screen.getByRole("link", { name: "First Store" })).toHaveAttribute("href", "/catalog/1");
    expect(screen.getByRole("link", { name: "Second Store" })).toHaveAttribute("href", "/catalog/2");
  });

  it("shows a database error instead of throwing", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    server.createClient.mockReturnValue(
      createSupabaseMock({
        businesses: [createSupabaseQuery({ data: null, error: { message: "Unavailable" } })],
      }),
    );

    render(await HomePage());
    expect(screen.getByText("Error fetching businesses: Unavailable")).toBeVisible();
  });
});
