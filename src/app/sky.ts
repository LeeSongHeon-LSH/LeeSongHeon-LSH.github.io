/**
 * 밤하늘 규칙 — 방문자 로컬 시각이 밤이면 눈밭이 어두워지고 오로라가 뜬다.
 * 판정은 첫 페인트 전에 인라인 스크립트로 해서(layout.tsx) 낮→밤 깜빡임이 없다.
 * `?sky=night` / `?sky=day`로 강제할 수 있다 (확인용).
 */
export const NIGHT_FROM = 19; // 이 시각(포함)부터 밤
export const NIGHT_TO = 6; // 이 시각(미포함)까지 밤

// 브라우저 크롬(주소창·상태바) 색 — globals.css의 --color-paper와 같은 값이어야 한다.
// CSS는 스크립트가 도는 시점에 아직 없을 수 있어 여기에 적고, sky.test.ts가 두 파일을 대조한다
export const DAY_PAPER = "#eef1f4";
export const NIGHT_PAPER = "#101826";

/** 밤인지 — 인라인 스크립트(NIGHT_SCRIPT)가 지켜야 할 규칙의 원본 */
export function isNight(hour: number, override?: string | null): boolean {
  if (override === "night") return true;
  if (override === "day") return false;
  return hour >= NIGHT_FROM || hour < NIGHT_TO;
}

/**
 * `<html data-night>`와 theme-color를 첫 페인트 전에 박는 스크립트.
 * theme-color 메타는 Next의 viewport export가 아니라 여기서 만든다 — 서버가 박아둔 메타를
 * 고치면 하이드레이션 때 React가 자기 것을 하나 더 끼워 넣어 낮/밤 값이 둘이 된다.
 * 문자열이라 타입이 안 잡히는 대신, sky.test.ts가 이 스크립트를 실제로 실행해
 * 24시간 × 강제값 전부를 isNight와 대조한다
 */
export const NIGHT_SCRIPT = `(function(){try{var q=new URLSearchParams(location.search).get("sky");var h=new Date().getHours();var night=q==="night"||(q!=="day"&&(h>=${NIGHT_FROM}||h<${NIGHT_TO}));if(night)document.documentElement.setAttribute("data-night","");var m=document.createElement("meta");m.setAttribute("name","theme-color");m.setAttribute("content",night?"${NIGHT_PAPER}":"${DAY_PAPER}");document.head.appendChild(m)}catch(e){}})()`;
