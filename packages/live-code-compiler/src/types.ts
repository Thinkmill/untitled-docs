export type ExampleType = "jsx" | "function";

export type BabelResult =
  | {
      status: "success";
      code: string;
      exampleType: ExampleType;
      globals: string[];
    }
  | {
      status: "parse-error";
      message: string;
      pos: number;
      loc: { line: number; column: number };
      rawMessage: string;
    }
  | {
      status: "unknown-error";
      message: string;
    };
