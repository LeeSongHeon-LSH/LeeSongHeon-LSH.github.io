/**
 * 밤하늘 규칙 — 방문자 로컬 시각이 밤이면 눈밭이 어두워지고 오로라가 뜬다.
 * 판정은 첫 페인트 전에 인라인 스크립트로 해서(layout.tsx) 낮→밤 깜빡임이 없다.
 * `?sky=night` / `?sky=day`로 강제할 수 있다 (확인용).
 */
export const NIGHT_FROM = 19; // 이 시각(포함)부터 밤
export const NIGHT_TO = 6; // 이 시각(미포함)까지 밤

export function isNight(hour: number, override?: string | null): boolean {
  if (override === "night") return true;
  if (override === "day") return false;
  return hour >= NIGHT_FROM || hour < NIGHT_TO;
}

/** `<html data-night>`를 첫 페인트 전에 박는 스크립트 — isNight와 같은 규칙 */
export const NIGHT_SCRIPT = `(function(){try{var q=new URLSearchParams(location.search).get("sky");var h=new Date().getHours();if(q==="night"||(q!=="day"&&(h>=${NIGHT_FROM}||h<${NIGHT_TO})))document.documentElement.setAttribute("data-night","")}catch(e){}})()`;
