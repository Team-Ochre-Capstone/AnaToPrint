import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Runs a cleanup after each test case
afterEach(() => {
  cleanup();
});
