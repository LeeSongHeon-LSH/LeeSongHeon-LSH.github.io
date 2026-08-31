/** `#` 제목 하나를 기준으로 마크다운을 자른다 — 앞쪽 도입부(head)와 제목 단위 덩어리(items) */
function splitByHeading(
  md: string,
  level: 2 | 3,
): { head: string; items: { title: string; body: string }[] } {
  const marker = `${"#".repeat(level)} `;
  const chunks = md.split(new RegExp(`\\n(?=${marker})`));
  const head = chunks[0]?.startsWith(marker) ? "" : (chunks.shift() ?? "");
  const items = chunks
    .filter((c) => c.startsWith(marker))
    .map((c) => ({
      title: c.slice(marker.length, c.indexOf("\n") < 0 ? undefined : c.indexOf("\n")).trim(),
      body: c,
    }));
  return { head, items };
}

/** 마크다운을 `## ` 제목 기준으로 자른다 — 문서는 cv.md 1덩어리 그대로, 필터는 렌더에서만 */
export function splitSections(md: string): {
  intro: string;
  sections: { title: string; body: string }[];
} {
  const { head, items } = splitByHeading(md, 2);
  return { intro: head, sections: items };
}

/** 섹션 본문을 `### ` 항목 기준으로 자른다 — 항목 하나가 네모 박스(카드) 하나가 된다 */
export function splitEntries(body: string): {
  head: string;
  entries: { title: string; body: string }[];
} {
  const { head, items } = splitByHeading(body, 3);
  return { head, entries: items };
}
