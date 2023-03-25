import { assert, describe, expect, test } from "vitest";

// Edit an assertion and save to see HMR in action

test("Math.sqrt()", () => {
  expect(Math.sqrt(4)).toBe(2);
  expect(Math.sqrt(144)).toBe(12);
  expect(Math.sqrt(2)).toBe(Math.SQRT2);
});

test("JSON", () => {
  const input = {
    foo: "hello",
    bar: "world",
  };

  const output = JSON.stringify(input);

  expect(output).eq('{"foo":"hello","bar":"world"}');
  assert.deepEqual(JSON.parse(output), input, "matches original");
});

describe("#sum", () => {
    test("adds 1 + 2 to equal 3", () => {
        expect(1 + 2).toBe(3);
    });
    
    test("adds 2 + 2 to equal 4", () => {
        expect(2 + 2).toBe(4);
    });
});