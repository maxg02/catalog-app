import reducer, { resolveSelectedBusinessId, setSelectedBusinessId } from "./businessSelectionSlice";

describe("business selection", () => {
    test.each([
        [[2, 3], null, 2],
        [[2, 3], 3, 3],
        [[2, 3], 4, 2],
        [[], 3, null],
    ])("resolves %j with selected %s", (ids, selected, expected) => {
        expect(resolveSelectedBusinessId(ids, selected)).toBe(expected);
    });

    it("sets and clears the selected business", () => {
        expect(reducer(undefined, { type: "init" })).toEqual({ selectedBusinessId: null });
        expect(reducer(undefined, setSelectedBusinessId(7))).toEqual({ selectedBusinessId: 7 });
        expect(reducer({ selectedBusinessId: 7 }, setSelectedBusinessId(null))).toEqual({
            selectedBusinessId: null,
        });
    });
});
