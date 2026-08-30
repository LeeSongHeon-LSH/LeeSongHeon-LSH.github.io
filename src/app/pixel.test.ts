import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// LSHobby src/design.test.ts에서 이관한 도트 격자 불변식 —
// grid에만 있고 palette에 없는 문자는 fill=undefined → 검은 사각형으로 조용히 렌더된다
const pixelSrc = readFileSync(join(process.cwd(), "src/app/pixel.tsx"), "utf8");

/** `start`의 `{`부터 짝이 맞는 `}`까지 (중첩 포함) */
const blockAt = (src: string, start: number): { body: string; end: number } => {
  const open = src.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}" && --depth === 0) return { body: src.slice(open + 1, i), end: i + 1 };
  }
  throw new Error(`짝이 맞는 } 를 찾지 못했습니다 (offset ${start})`);
};

const sprites = [...pixelSrc.matchAll(/<PixelArt\b/g)].map((m) => {
  const call = pixelSrc.slice(m.index!, pixelSrc.indexOf("/>", m.index!));
  const gridName = /grid=\{(\w+)\}/.exec(call)![1];
  const cells = Number(/cells=\{(\d+)\}/.exec(call)?.[1] ?? 16);
  const cellsYRaw = /cellsY=\{(\d+)\}/.exec(call)?.[1];
  // palette는 인라인 객체이거나 이름 있는 상수 (`palette={{…}}` / `palette={NAME}`)
  const named = /palette=\{([A-Za-z_]\w*)\}/.exec(call)?.[1];
  const paletteBody = named
    ? blockAt(pixelSrc, pixelSrc.indexOf(`const ${named}`)).body
    : blockAt(call, call.indexOf("palette=")).body;
  const keys = [...paletteBody.matchAll(/(?:^|[{,])\s*(?:"([^"]+)"|([A-Za-z0-9_]+))\s*:/g)].map(
    (k) => k[1] ?? k[2],
  );
  const decl = new RegExp(`const ${gridName}\\s*=\\s*\\[([\\s\\S]*?)\\];`).exec(pixelSrc)!;
  const rows = [...decl[1].matchAll(/"([^"]*)"/g)].map((r) => r[1]);
  return { gridName, cells, cellsY: cellsYRaw ? Number(cellsYRaw) : cells, keys, rows };
});

describe("도트 스프라이트 격자", () => {
  // 파서가 스프라이트를 건너뛰면 그 스프라이트의 검사가 통째로 사라진다
  it("내보낸 스프라이트를 하나도 빠뜨리지 않고 읽어냈다", () => {
    const exported = [...pixelSrc.matchAll(/export const (Pixel\w+)/g)].map((m) => m[1]);
    expect(sprites.length).toBe(exported.length);
  });

  it.each(sprites.map((s) => [s.gridName, s] as const))("%s — 행 수가 cellsY와 같다", (_n, s) => {
    expect(s.rows.length).toBe(s.cellsY);
  });

  it.each(sprites.map((s) => [s.gridName, s] as const))("%s — 모든 행이 cells 폭이다", (_n, s) => {
    expect(s.rows.filter((r) => r.length !== s.cells)).toEqual([]);
  });

  it.each(sprites.map((s) => [s.gridName, s] as const))("%s — 쓰인 색이 palette에 다 있다", (_n, s) => {
    const used = new Set(s.rows.flatMap((r) => [...r]).filter((ch) => ch !== "."));
    expect([...used].filter((ch) => !s.keys.includes(ch))).toEqual([]);
  });
});
