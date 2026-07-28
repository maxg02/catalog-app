import assert from "node:assert/strict";
import { resolveSelectedBusinessId } from "./businessSelectionSlice.ts";

assert.equal(resolveSelectedBusinessId([2, 3], null), 2);
assert.equal(resolveSelectedBusinessId([2, 3], 3), 3);
assert.equal(resolveSelectedBusinessId([2, 3], 4), 2);
assert.equal(resolveSelectedBusinessId([], 3), null);
