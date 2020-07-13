import React from "react";
import "regenerator-runtime";

const evalCode = (code: string, scope: { [key: string]: any }) => {
  const scopeKeys = Object.keys(scope);
  const scopeValues = scopeKeys.map((key) => scope[key]);
  // eslint-disable-next-line no-new-func
  const res = new Function("React", ...scopeKeys, `${code}\nreturn Example`);
  return res(React, ...scopeValues);
};

export const getElement = ({
  code,
  scope,
}: {
  code: string;
  scope: Record<string, any>;
}) => {
  let _Comp = evalCode(code, scope);
  let Comp =
    // on the server, we want to throw a more helpful error
    // since error boundaries don't work server side
    // and you shouldn't ship a broken code example anyway.
    typeof window === "undefined"
      ? () => {
          try {
            let ele = _Comp();
            return ele;
          } catch (err) {
            throw new Error(
              `An error occurred in a live code example: ${err.toString()}.\n\n\`\`\`\n${code.trim()}\n\`\`\``
            );
          }
        }
      : _Comp;
  return <Comp />;
};
