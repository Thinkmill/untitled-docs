import visit from "unist-util-visit";
import { transform } from "./transform";

export const plugin = () => {
  return (hast: any) => {
    visit(hast, `element`, (node: any) => {
      if (
        node.tagName === "code" &&
        Array.isArray(node.properties.className) &&
        node.properties.className.length === 1 &&
        node.properties.className[0] === "language-jsx" &&
        // MDX v1
        (node.properties.live ||
          // MDX v2
          (node.data &&
            typeof node.data.meta === "string" &&
            node.data.meta.split(" ").includes("live")))
      ) {
        if (node.children.length !== 1 || node.children[0].type !== "text") {
          throw new Error("live code block does not have code");
        }
        let code = node.children[0].value;

        node.properties.initialCompiledResult = JSON.stringify(transform(code));
      }
    });
  };
};
