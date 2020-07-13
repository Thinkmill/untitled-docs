import React, { ReactElement, useEffect, useMemo, useState } from "react";

import { getElement } from "./eval";
import { LiveCodeErrorBoundary } from "./error-boundary";
import { createBabelWorker } from "./worker";
import { BabelResult, SuccessBabelResult } from "./types";

const worker = typeof window !== "undefined" ? createBabelWorker() : undefined;

type Options = {
  code: string;
  scope: Record<string, any>;
  initialCompiledResult: null | (() => BabelResult);
};

function useCompiledResult(
  code: string,
  initialResult: (() => BabelResult) | null
): { latest: BabelResult | null; lastestSafe: SuccessBabelResult | null } {
  let [transformedResult, setTransformedResult] = useState<{
    latest: BabelResult | null;
    lastestSafe: SuccessBabelResult | null;
  }>(() => {
    if (initialResult !== null) {
      let readInitialResult = initialResult();
      if (readInitialResult.status !== "success") {
        throw new Error(
          `There was a parse error with a live code example.\n${
            readInitialResult.status === "parse-error"
              ? readInitialResult.rawMessage
              : readInitialResult.message
          }\n\n\`\`\`\n${code.trim()}\n\`\`\``
        );
      }
      return {
        lastestSafe: readInitialResult,
        latest: readInitialResult,
      };
    }
    return {
      lastestSafe: null,
      latest: null,
    };
  });
  useEffect(() => {
    let shouldSet = true;
    worker!.compile(code).then((result) => {
      if (shouldSet) {
        setTransformedResult((prevState) => {
          return {
            latest: result,
            lastestSafe:
              result.status === "success" ? result : prevState.lastestSafe,
          };
        });
      }
    });
    return () => {
      shouldSet = false;
    };
  }, [code]);
  return transformedResult;
}

export function useLiveCode({ code, scope, initialCompiledResult }: Options) {
  const compiledResult = useCompiledResult(code, initialCompiledResult);

  let [error, setError] = useState<{
    result: BabelResult | null;
    error: string | null;
  }>({
    result: null,
    error: null,
  });

  let element = useMemo(() => {
    if (compiledResult.lastestSafe) {
      return getElement({
        code: compiledResult.lastestSafe.code,
        scope,
      });
    }
    return null;
  }, [compiledResult.lastestSafe, scope]);

  return {
    element: (
      <LiveCodeErrorBoundary
        onError={(err) => {
          setError({ error: err, result: compiledResult.lastestSafe });
        }}
      >
        {element}
      </LiveCodeErrorBoundary>
    ),
    error:
      compiledResult.latest?.status === "parse-error"
        ? compiledResult.latest.rawMessage
        : compiledResult.latest?.status === "unknown-error"
        ? compiledResult.latest.message
        : compiledResult.lastestSafe === error.result
        ? error.error
        : null,
    latestSuccessfulCompiledResult: compiledResult.lastestSafe,
  };
}
