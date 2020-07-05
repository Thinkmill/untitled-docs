import React, { useState, useEffect } from "react";
import { useLiveCode } from "@untitled-docs/live-code-compiler";
import { BabelResult } from "@untitled-docs/live-code-compiler/src/types";

export default () => {
  let [code, setCode] = useState("<div>something</div>");
  let thing = useLiveCode({ code, initialTransformResult: null, scope: {} });
  return (
    <div>
      {thing.element}
      <textarea
        onChange={(event) => {
          setCode(event.target.value);
        }}
        value={code}
      />
      <pre>{thing.error}</pre>
    </div>
  );
};
