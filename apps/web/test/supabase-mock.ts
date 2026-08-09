import { vi } from "vitest";

type QueryResult = {
  data?: unknown;
  error?: unknown;
  count?: number | null;
};

export type SupabaseQueryMock = ReturnType<typeof createSupabaseQuery>;

export function createSupabaseQuery(result: QueryResult) {
  const query: Record<string, unknown> = {};
  const chainMethods = ["select", "eq", "order", "range", "or", "insert", "update", "delete", "upsert"];

  for (const method of chainMethods) query[method] = vi.fn(() => query);

  query.single = vi.fn(() => Promise.resolve(result));
  query.maybeSingle = vi.fn(() => Promise.resolve(result));
  query.then = (onFulfilled: (value: QueryResult) => unknown, onRejected?: (reason: unknown) => unknown) =>
    Promise.resolve(result).then(onFulfilled, onRejected);

  return query as {
    [Key in (typeof chainMethods)[number]]: ReturnType<typeof vi.fn>;
  } & {
    single: ReturnType<typeof vi.fn>;
    maybeSingle: ReturnType<typeof vi.fn>;
    then: Promise<QueryResult>["then"];
  };
}

export function createSupabaseMock(queries: Record<string, SupabaseQueryMock[]>) {
  const queues = Object.fromEntries(
    Object.entries(queries).map(([table, tableQueries]) => [table, [...tableQueries]]),
  );

  return {
    from: vi.fn((table: string) => {
      const query = queues[table]?.shift();
      if (!query) throw new Error(`No Supabase query mock configured for ${table}.`);
      return query;
    }),
  };
}
