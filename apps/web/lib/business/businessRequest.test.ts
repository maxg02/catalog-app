import { describe, expect, it } from "vitest";
import { parseBusinessBody, validateBusinessBody } from "./businessRequest";

describe("business request parsing", () => {
  it("parses JSON and invalid JSON bodies", async () => {
    const request = new Request("http://test/business", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: " Demo " }),
    });
    expect(await parseBusinessBody(request)).toMatchObject({ name: " Demo " });

    const invalid = new Request("http://test/business", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{",
    });
    expect(await parseBusinessBody(invalid)).toBeNull();
  });

  it("parses multipart location and banner fields", async () => {
    const form = new FormData();
    form.set("name", "Demo");
    form.set("location", JSON.stringify({ city: "Santo Domingo" }));
    form.set("bannerAction", "keep");
    const request = new Request("http://test/business", { method: "POST", body: form });

    expect(await parseBusinessBody(request)).toMatchObject({
      name: "Demo",
      location: { city: "Santo Domingo" },
      bannerAction: "keep",
    });
  });
});

describe("business validation", () => {
  it("normalizes valid fields and converts a zero-based category for storage", () => {
    expect(
      validateBusinessBody({
        name: "  Demo shop  ",
        description: "  Description  ",
        category: "0",
        location: { address: "", city: " Santo Domingo ", country: "DO" },
      }),
    ).toEqual({
      ok: true,
      business: {
        name: "Demo shop",
        description: "Description",
        category: 1,
        location: { address: "", city: "Santo Domingo", country: "DO" },
      },
    });
  });

  it("reports required, category, and location errors", () => {
    expect(validateBusinessBody({ name: "", category: 999, location: "invalid" })).toEqual({
      ok: false,
      fieldErrors: {
        name: "Business name is required.",
        location: "Location is invalid.",
        category: "Category is invalid.",
      },
    });
  });

  it("normalizes an empty location and description to null", () => {
    expect(validateBusinessBody({ name: "Demo", description: " ", location: {} })).toMatchObject({
      ok: true,
      business: { description: null, location: null, category: null },
    });
  });
});
