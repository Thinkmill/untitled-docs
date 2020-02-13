import * as semver from "semver";
import { useMemo } from "react";

type ChangelogEntry = {
  version: string;
  content: string;
};

export function useFilteredChangelog(changelog: string, range: string) {
  let splitChangelog = useMemo(() => divideChangelog(changelog), [changelog]);
  let filteredChangelog = useMemo(
    () => filterChangelog(splitChangelog, range),
    [splitChangelog, range]
  );
  return filteredChangelog;
}

export const divideChangelog = (changelog: string): ChangelogEntry[] => {
  const splitToken = `__CHANGELOG_SPLIT_${Date.now()}__`;
  const splitChangelog: ChangelogEntry[] = [];
  changelog
    .replace(/[\n\r\s]## /g, `${splitToken}## `)
    .split(splitToken)
    .forEach(md => {
      // This should only allow us to skip the first chunk which is the name, as
      // well as the unreleased section.
      const match = md.match(/\d+\.\d+\.\d+/);

      if (match) {
        return splitChangelog.push({
          version: match[0],
          content: md
        });
      }
    });
  return splitChangelog;
};

export const filterChangelog = (rawLogs: ChangelogEntry[], range: string) => {
  return range
    ? rawLogs.filter(e => semver.satisfies(e.version, range))
    : rawLogs;
};
