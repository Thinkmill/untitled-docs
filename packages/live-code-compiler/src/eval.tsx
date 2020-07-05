import React, { useState, useEffect } from "react";

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
  onError,
}: {
  code: string;
  scope: Record<string, any>;
  onError: (err: string) => void;
}) => {
  let element = evalCode(code, scope);
  let Comp = () => {
    console.log("yas");
    let [err, setErr] = useState<null | string>(null);
    useEffect(() => {
      if (err !== null) {
        onError(err);
      }
    });
    if (err !== null) {
      return null;
    }
    try {
      let ele = element();
      return ele;
    } catch (err) {
      if (typeof window === "undefined") {
        onError(err.toString());
      } else {
        setErr(err.toString());
      }
      return null;
    }
  };
  return <Comp />;
};
