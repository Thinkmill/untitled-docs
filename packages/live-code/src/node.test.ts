import { babelTransform } from "./node";

function assert(condition: any): asserts condition {
  if (!condition) {
    throw new Error("Assertion failed");
  }
}

test("works for jsx examples", () => {
  let result = babelTransform(`<div>
  <Something />
</div>
`);
  assert(result.status === "success");
  expect(result.code).toMatchInlineSnapshot(`
    "function Element() {
      return /*#__PURE__*/React.createElement(\\"div\\", null, /*#__PURE__*/React.createElement(Something, null));
    }"
  `);
  expect(result.exampleType).toEqual("jsx");
  expect(result.globals).toEqual(["Something"]);
});

test("works for function examples", () => {
  let result = babelTransform(`

return (
  <div>
    <Something />
  </div>
)
`);
  assert(result.status === "success");

  expect(result.code).toMatchInlineSnapshot(`
      "function Element() {
        return /*#__PURE__*/React.createElement(\\"div\\", null, /*#__PURE__*/React.createElement(Something, null));
      }"
    `);
  expect(result.exampleType).toEqual("function");
  expect(result.globals).toEqual(["Something"]);
});

test("does not get local variables in the globals array", () => {
  let result = babelTransform(`

let something = 'wow'
return (
<div>
{something}
    <Something />
</div>
)
  `);
  assert(result.status === "success");

  expect(result.code).toMatchInlineSnapshot(`
    "function Element() {
      var something = 'wow';
      return /*#__PURE__*/React.createElement(\\"div\\", null, something, /*#__PURE__*/React.createElement(Something, null));
    }"
  `);
  expect(result.exampleType).toEqual("function");
  expect(result.globals).toEqual(["Something"]);
});

test("returns errors well", () => {
  let result = babelTransform(`
le something = 'wow'
return (
<div>
{something}
    <Something />
</div>
)
`);

  expect(result).toMatchInlineSnapshot(`
    Object {
      "loc": Object {
        "column": 3,
        "line": 2,
      },
      "message": "Unexpected token, expected \\";\\"",
      "pos": 4,
      "rawMessage": "unknown: Unexpected token, expected \\";\\" (2:3)

      1 | 
    > 2 | le something = 'wow'
        |    ^
      3 | return (
      4 | <div>
      5 | {something}",
      "status": "parse-error",
    }
  `);
});
