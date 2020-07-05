import * as Babel from "@babel/standalone";

export function transform(code) {
  var globals;
  var exampleType;
  try {
    return {
      status: "success",
      code: Babel.transform(code, {
        presets: [["env", { modules: false }], "react"],
        parserOpts: {
          allowReturnOutsideFunction: true,
        },
        sourceMaps: false,
        plugins: [
          function(babel) {
            var t = babel.types;
            return {
              visitor: {
                Program(path) {
                  globals = Object.keys(path.scope.globals);

                  if (
                    path.node.body.length === 1 &&
                    t.isExpressionStatement(path.node.body[0])
                  ) {
                    exampleType = "jsx";
                    path.node.body[0] = t.functionExpression(
                      t.identifier("Example"),
                      [],
                      t.blockStatement([
                        t.returnStatement(path.node.body[0].expression),
                      ])
                    );
                  } else {
                    exampleType = "function";
                    path.node.body = [
                      t.functionExpression(
                        t.identifier("Example"),
                        [],
                        t.blockStatement(path.node.body)
                      ),
                    ];
                  }
                },
              },
            };
          },
        ],
      }).code,
      globals: globals,
      exampleType: exampleType,
    };
  } catch (err) {
    if (err.code === "BABEL_PARSE_ERROR") {
      return {
        status: "parse-error",
        loc: {
          line: err.loc.line,
          column: err.loc.column,
        },
        pos: err.pos,
        message: err.message.replace(
          /^unknown: (.+) \(\d+:\d+\)[^]*/m,
          function(_, message) {
            return message;
          }
        ),
        rawMessage: err.message,
      };
    }
    return {
      status: "unknown-error",
      message: err.toString(),
    };
  }
}
