import assert from "node:assert/strict";
import { getPasswordRequirementErrors } from "./password.ts";

assert.deepEqual(getPasswordRequirementErrors("Pass1"), ["At least 8 characters"]);
assert.deepEqual(getPasswordRequirementErrors("PASSWORD1"), ["One lowercase letter"]);
assert.deepEqual(getPasswordRequirementErrors("password1"), ["One uppercase letter"]);
assert.deepEqual(getPasswordRequirementErrors("Password"), ["One number"]);
assert.deepEqual(getPasswordRequirementErrors("Password1"), []);
