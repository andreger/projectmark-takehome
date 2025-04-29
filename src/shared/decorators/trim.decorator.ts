import { Transform } from "class-transformer";

/**
 * Trims leading/trailing whitespace from a string value
 *
 * Usage:
 *   @Trim()
 *   title: string;
 */
export function Trim() {
  return Transform(({ value }) =>
    typeof value === "string" ? value.trim() : value
  );
}
