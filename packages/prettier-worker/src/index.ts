export const createPrettierWorker = (options: {}) => {
  const blob = new Blob(
    [
      `"use strict";
importScripts("https://unpkg.com/prettier@2.0.5/standalone.js", "https://unpkg.com/prettier@2.0.5/parser-graphql.js");
function format(code) {
  try {
    prettier.format(code, ${JSON.stringify(options)})
  } catch(err) {
    console.error(err);
    return code;
  }
}
  
self.onmessage = function (event) {
  self.postMessage({id:event.data.id,result:format(event.data.code)})
}
`,
    ],
    {
      type: "application/javascript",
    }
  );

  let id = 0;
  let callbacks: Record<number, (result: any) => void> = {};
  let worker = new Worker(URL.createObjectURL(blob));
  worker.onmessage = (event) => {
    callbacks[event.data.id](event.data.result);
    delete callbacks[event.data.id];
  };
  return {
    compile(code: string) {
      return new Promise<string>((resolve) => {
        callbacks[++id] = resolve;
        worker.postMessage({
          id,
          code,
        });
      });
    },
  };
};
