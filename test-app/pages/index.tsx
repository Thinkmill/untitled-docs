import React, { useState, useEffect } from "react";
import { createBabelWorker } from "@untitled-docs/live-code-compiler";
import { BabelResult } from "@untitled-docs/live-code-compiler/src/types";

let worker = typeof window !== "undefined" ? createBabelWorker() : undefined;

export default () => {
  let [compiled, setCompiledResult] = useState<
    BabelResult | { status: "compiling" }
  >({ status: "compiling" });
  let [code, setCode] = useState("console.log(1)");
  useEffect(() => {
    let shouldUpdate = true;
    worker!.compile(code).then((result) => {
      if (shouldUpdate) {
        setCompiledResult(result);
      }
    });
    return () => {
      shouldUpdate = false;
    };
  }, [code]);
  return (
    <div>
      <textarea
        onChange={(event) => {
          setCode(event.target.value);
        }}
        value={code}
      />
      <pre>{JSON.stringify(compiled, null, 2)}</pre>
    </div>
  );
};
