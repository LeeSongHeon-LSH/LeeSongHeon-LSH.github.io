import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DAY_PAPER, NIGHT_PAPER, NIGHT_SCRIPT, isNight } from "./sky";

type FakeEl = { attrs: Record<string, string>; setAttribute(k: string, v: string): void };
const el = (attrs: Record<string, string> = {}): FakeEl => ({
  attrs,
  setAttribute(k, v) {
    this.attrs[k] = v;
  },
});

/**
 * 페이지에 실제로 실려 나가는 문자열을 그대로 실행한다 — document·location·Date만 가짜로 끼운다.
 * 스크립트 안의 try/catch가 예외를 삼키므로, 오타는 "밤인데 아무것도 안 박힌다"로 드러난다
 */
function runScript(hour: number, sky?: string) {
  const root = el();
  const metas: FakeEl[] = [];
  const document = {
    documentElement: root,
    head: { appendChild: (m: FakeEl) => void metas.push(m) },
    createElement: () => el(),
  };
  const location = { search: sky === undefined ? "" : `?sky=${sky}` };
  class FakeDate {
    getHours() {
      return hour;
    }
  }
  new Function("document", "location", "Date", NIGHT_SCRIPT)(document, location, FakeDate);
  return {
    night: "data-night" in root.attrs,
    metas: metas.filter((m) => m.attrs.name === "theme-color"),
  };
}

describe("밤 판정", () => {
  it("19시부터 6시 전까지가 밤", () => {
    expect(isNight(18)).toBe(false);
    expect(isNight(19)).toBe(true);
    expect(isNight(23)).toBe(true);
    expect(isNight(0)).toBe(true);
    expect(isNight(5)).toBe(true);
    expect(isNight(6)).toBe(false);
    expect(isNight(12)).toBe(false);
  });

  it("?sky= 강제가 시각을 이긴다", () => {
    expect(isNight(12, "night")).toBe(true);
    expect(isNight(23, "day")).toBe(false);
    expect(isNight(23, "whatever")).toBe(true);
  });
});

describe("인라인 스크립트", () => {
  it("24시간 내내 isNight와 같은 판정을 한다", () => {
    for (let h = 0; h < 24; h++) {
      expect({ h, night: runScript(h).night }).toEqual({ h, night: isNight(h) });
    }
  });

  it("?sky= 강제를 isNight와 똑같이 따른다", () => {
    for (const sky of ["night", "day", "whatever"]) {
      for (const h of [3, 12, 21]) {
        expect({ sky, h, night: runScript(h, sky).night }).toEqual({ sky, h, night: isNight(h, sky) });
      }
    }
  });

  it("theme-color 메타를 직접 만들어 붙인다 — 낮이든 밤이든 하나만", () => {
    expect(runScript(21).metas.map((m) => m.attrs.content)).toEqual([NIGHT_PAPER]);
    expect(runScript(12).metas.map((m) => m.attrs.content)).toEqual([DAY_PAPER]);
  });
});

// 스크립트는 CSS보다 먼저 도니 색을 문자열로 들고 있다 — 두 파일이 갈라지면 여기서 걸린다
describe("theme-color와 --color-paper", () => {
  const css = readFileSync(new URL("./globals.css", import.meta.url), "utf8");
  const paperIn = (block: string) => block.match(/--color-paper:\s*([^;]+);/)?.[1].trim();

  it("낮 값이 @theme의 --color-paper와 같다", () => {
    expect(paperIn(css.match(/@theme\s*\{([\s\S]*?)\n\}/)?.[1] ?? "")).toBe(DAY_PAPER);
  });

  it("밤 값이 html[data-night]의 --color-paper와 같다", () => {
    expect(paperIn(css.match(/html\[data-night\]\s*\{([^}]*)\}/)?.[1] ?? "")).toBe(NIGHT_PAPER);
  });
});
