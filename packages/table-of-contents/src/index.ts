import { useEffect, useState } from 'react';

export type GatsbyTOCItem = {
  url?: string;
  title?: string;
  items?: GatsbyTOCItem[];
};

export type TOCItem = {
  depth: number;
  id: string;
  value: string;
};

const hashToId = (str: string) => str.slice(1);

export const getHeadings = (item: GatsbyTOCItem, depth = 0) => {
  const itemList: TOCItem[] = [];

  if (depth !== 1 && item.url !== undefined && item.title !== undefined) {
    itemList.push({
      id: hashToId(item.url),
      value: item.title,
      depth: depth,
    });
  }
  if (item.items && depth < 4) {
    for (const child of item.items) {
      itemList.push(...getHeadings(child, depth + 1));
    }
  }

  return itemList;
};

// it's important that IDs are sorted by the order they appear in the document
// so we can pluck active from the beginning
function sortVisible(allIds: string[], targetId: string) {
  return (ids: string[]) =>
    [...ids, targetId].sort((a, b) =>
      allIds.indexOf(a) > allIds.indexOf(b) ? 1 : -1
    );
}
const observerOptions = {
  rootMargin: '0px',
  threshold: 1.0,
};

export function useActiveId(headings: TOCItem[]) {
  let [visibleIds, setVisibleIds] = useState<string[]>([]);
  let [lastVisibleId, setLastVisbleId] = useState('');

  // observe relevant headings
  useEffect(() => {
    let allIds = headings.map(h => h.id);
    if (allIds.length) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const targetId = entry.target.getAttribute('id');
          if (targetId) {
            if (entry.isIntersecting && entry.intersectionRatio === 1) {
              setVisibleIds(sortVisible(allIds, targetId));
              setLastVisbleId(targetId);
            } else {
              setVisibleIds(ids => ids.filter(id => id !== targetId));
            }
          }
        });
      }, observerOptions);

      allIds.forEach(id => {
        observer.observe(document.getElementById(id)!);
      });
      return () => {
        observer.disconnect();
      };
    }
  }, [headings]);

  // catch if we're in a long gap between headings and resolve to the last available.
  let activeId = visibleIds[0] || lastVisibleId;
  return activeId;
}
