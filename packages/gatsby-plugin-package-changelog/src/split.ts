import remark from 'remark';
// @ts-ignore
import nodeToString from 'mdast-util-to-string';
import findVersions from 'find-versions';
// @ts-ignore
import remarkMdx from 'remark-mdx';

let processor = remark().use(remarkMdx);

export const parseMarkdown = (markdown: string) => {
  let ast = processor.parse(markdown);
  let splitVersions = [];
  // @ts-ignore
  for (let node of ast.children) {
    if (node.type === 'heading') {
      let stringifiedNode = nodeToString(node);
      let versions = findVersions(stringifiedNode);
      if (versions.length === 1) {
        let version = versions[0];
        splitVersions.push({
          ast: { type: 'root', children: [{ ...node, depth: 2 }] },
          version,
        });
        continue;
      }
    }
    let currentVersion = splitVersions[splitVersions.length - 1];
    if (currentVersion) {
      currentVersion.ast.children.push(node);
    }
  }

  if (splitVersions.length) {
    return splitVersions.map(x => {
      return {
        version: x.version,
        content: processor.stringify(x.ast),
      };
    });
  }

  throw new Error(`Could not split changelog:\n${markdown}`);
};
