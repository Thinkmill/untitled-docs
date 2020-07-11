export type ExampleType = "jsx" | "function";

export type SuccessBabelResult = {
  status: "success";
  code: string;
  exampleType: ExampleType;
  globals: string[];
};

export type BabelResult =
  | SuccessBabelResult
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
