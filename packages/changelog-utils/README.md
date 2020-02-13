# @untitled-docs/changelog-utils

> Utils to help rendering changelogs on documentation sites

## Install

```
yarn add @untitled-docs/changelog-utils
```

```jsx
import React from "react";
import { useFilteredChangelog } from "@untitled-docs/changelog-utils";
import ReactMarkdown from "react-markdown";

function MyChangelog({ changelog }) {
  let [value, setValue] = useState("");

  let filteredChangelog = useFilteredChangelog(changelog, value);

  return (
    <div>
      <label>
        Semver Range
        <input
          type="search"
          placeholder={'e.g. "> 1.0.6 <= 3.0.2"'}
          onChange={event => {
            setValue(event.target.value);
          }}
          value={value}
        />
      </label>
      <ReactMarkdown
        source={filteredChangelog.map(x => x.content).join("\n")}
      />
    </div>
  );
}
```
