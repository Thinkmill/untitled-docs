import path from 'path';

import { CreateResolversArgs, CreateSchemaCustomizationArgs } from 'gatsby';

// @ts-ignore
import createMdxNode from 'gatsby-plugin-mdx/utils/create-mdx-node';

import { parseMarkdown } from './split';

export const createSchemaCustomization = async ({
  actions,
}: CreateSchemaCustomizationArgs) => {
  const { createTypes } = actions;

  let typeDefs = `
    type Changelog {
      full: Mdx!
      parts: [ChangelogParts!]!
    }
    type ChangelogParts {
      version: String!
      content: Mdx!
    }
  `;
  createTypes(typeDefs);
};

export const createResolvers = ({
  createResolvers,
  createNodeId,
}: CreateResolversArgs) => {
  createResolvers({
    Package: {
      changelog: {
        type: 'Changelog',
        // @ts-ignore
        resolve(source, args, context, info) {
          return context.nodeModel.runQuery({
            query: {
              filter: {
                fileAbsolutePath: {
                  eq: path.join(source.dir, 'CHANGELOG.md'),
                },
              },
            },
            type: 'Mdx',
            firstOnly: true,
          });
        },
      },
    },
    Changelog: {
      full: {
        type: 'Mdx!',
        resolve(source: any) {
          return source;
        },
      },
      parts: {
        type: '[ChangelogParts!]!',
        resolve(source: any) {
          return Promise.all(
            parseMarkdown(source.rawBody).map(async x => {
              return {
                version: x.version,
                content: await createMdxNode({
                  content: x.content,
                  node: { internal: {} },
                  id: createNodeId(x.content),
                }),
              };
            })
          );
        },
      },
    },
  });
};
