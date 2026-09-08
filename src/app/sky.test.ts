import { describe, expect, it } from "vitest";
import { NIGHT_FROM, NIGHT_SCRIPT, NIGHT_TO, isNight } from "./sky";

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

  // 인라인 스크립트는 문자열이라 타입이 못 잡는다 — 임계값이 같은지만 확인
  it("인라인 스크립트가 같은 임계값을 쓴다", () => {
    expect(NIGHT_SCRIPT).toContain(`h>=${NIGHT_FROM}||h<${NIGHT_TO}`);
    expect(NIGHT_SCRIPT).toContain('"data-night"');
  });
});
