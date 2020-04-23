import path from 'path';

import { createContentDigest } from 'gatsby-core-utils';
import {
  CreateResolversArgs,
  CreateSchemaCustomizationArgs,
  SourceNodesArgs,
} from 'gatsby';
import { getPackages } from '@manypkg/get-packages';

export const createSchemaCustomization = ({
  actions,
}: CreateSchemaCustomizationArgs) => {
  const { createTypes } = actions;

  let typeDefs = `
      type Dependency {
        name: String!
        range: String!
      }
      type Package implements Node {
        name: String!
        version: String!
        description: String
        dir: String!
        relativeDir: String!
        rawPackageJson: JSON!
        dependencies: [Dependency!]!
        peerDependencies: [Dependency!]!
        devDependencies: [Dependency!]!
        optionalDependencies: [Dependency!]!
      }
    `;
  createTypes(typeDefs);
};

export const createResolvers = ({ createResolvers }: CreateResolversArgs) => {
  const resolvers = {
    Package: {
      name: {
        type: 'String!',
        args: { scope: { type: 'Boolean', defaultValue: true } },
        resolve: (source: any, args: { scope: boolean }) => {
          if (args.scope === true) {
            return source.name;
          }
          return source.name.replace(/^@[^/]+\//, '');
        },
      },
    },
  };
  createResolvers(resolvers);
};

let transformDeps = (deps: Record<string, string> = {}) => {
  return Object.entries(deps).map(([name, range]) => ({ name, range }));
};

export const sourceNodes = async (
  { actions, createNodeId }: SourceNodesArgs,
  { cwd = process.cwd() }
) => {
  let { createNode } = actions;
  let { packages } = await getPackages(cwd);

  for (let pkg of packages) {
    let { dir, packageJson } = pkg;

    let newNode = {
      name: packageJson.name,
      // @ts-ignore
      description: packageJson.description,
      dir,
      relativeDir: path.relative(cwd, dir),
      version: packageJson.version,
      rawPackageJson: packageJson,
      dependencies: transformDeps(packageJson.dependencies),
      peerDependencies: transformDeps(packageJson.peerDependencies),
      devDependencies: transformDeps(packageJson.devDependencies),
      optionalDependencies: transformDeps(packageJson.optionalDependencies),
      id: createNodeId(packageJson.name),
      internal: {
        contentDigest: createContentDigest({
          packageJson,
        }),
        type: 'Package',
      },
    };

    createNode(newNode);
  }
};
