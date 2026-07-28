import assert from "node:assert/strict";
import { getBusinessImageUrls } from "./businessImages.ts";

assert.deepEqual(getBusinessImageUrls({ image_url: "banner" }), ["banner"]);
assert.deepEqual(getBusinessImageUrls([{ image_url: "banner" }]), ["banner"]);
assert.deepEqual(getBusinessImageUrls(null), []);
