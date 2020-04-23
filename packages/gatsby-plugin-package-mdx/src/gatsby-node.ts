import path from 'path';

import { CreateResolversArgs } from 'gatsby';

export const createResolvers = ({ createResolvers }: CreateResolversArgs) => {
  createResolvers({
    Package: {
      mdx: {
        type: 'Mdx',
        args: { path: { type: 'String!' } },
        // @ts-ignore
        resolve(source, args, context, info) {
          return context.nodeModel.runQuery({
            query: {
              filter: {
                fileAbsolutePath: { eq: path.join(source.dir, args.path) },
              },
            },
            type: 'Mdx',
            firstOnly: true,
          });
        },
      },
    },
  });
};
