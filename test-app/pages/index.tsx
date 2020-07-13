import React, { useState } from "react";
import { useLiveCode } from "@untitled-docs/live-code";

let scope = {};

export default () => {
  let [code, setCode] = useState("<div>something</div>");
  let { element, error } = useLiveCode({
    code,
    initialCompiledResult: null,
    scope,
  });
  return (
    <div>
      {element}
      <textarea
        onChange={(event) => {
          setCode(event.target.value);
        }}
        value={code}
      />
      <pre>{error}</pre>
    </div>
  );
};
