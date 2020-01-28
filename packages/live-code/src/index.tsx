import React from "react";
import { ControlledEditor, monaco } from "@monaco-editor/react";
import { theme } from "./theme";

monaco.init().then(monaco => {
  // @ts-ignore
  monaco.editor.defineTheme("night-owl", theme);
});

export let Editor: typeof ControlledEditor = props => {
  return (
    <ControlledEditor
      theme="night-owl"
      height={500}
      language="typescript"
      {...props}
    />
  );
};
