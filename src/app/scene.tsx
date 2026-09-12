import { memo } from "react";
import {
  PixelBerg,
  PixelChick,
  PixelCloud,
  PixelPenguinSlide,
  PixelPenguinTiny,
  PixelTracks,
} from "./pixel";

// 눈송이 — SSR 일관성을 위해 난수 대신 고정 배치. 음수 delay로 첫 화면부터 내리는 중
const FLAKES = [
  { left: "4%", delay: "-2s", dur: "13s", size: 3 },
  { left: "11%", delay: "-9s", dur: "16s", size: 2 },
  { left: "19%", delay: "-5s", dur: "12s", size: 3 },
  { left: "27%", delay: "-11s", dur: "17s", size: 2 },
  { left: "34%", delay: "-1s", dur: "14s", size: 2 },
  { left: "43%", delay: "-7s", dur: "12s", size: 3 },
  { left: "51%", delay: "-13s", dur: "18s", size: 2 },
  { left: "58%", delay: "-3s", dur: "13s", size: 3 },
  { left: "66%", delay: "-10s", dur: "15s", size: 2 },
  { left: "73%", delay: "-6s", dur: "12s", size: 3 },
  { left: "81%", delay: "-14s", dur: "17s", size: 2 },
  { left: "88%", delay: "-4s", dur: "13s", size: 3 },
  { left: "95%", delay: "-8s", dur: "15s", size: 2 },
];

function Snowfall() {
  return (
    <>
      {FLAKES.map((f) => (
        <span
          key={f.left}
          className="flake"
          style={{
            left: f.left,
            width: f.size,
            height: f.size,
            animationDelay: f.delay,
            animationDuration: f.dur,
          }}
        />
      ))}
    </>
  );
}

// 별 — 밤에만 보인다(CSS). 눈송이처럼 고정 배치.
// 반짝임이 엇갈리게 delay도 여기 적는다 — :nth-child(odd)로 하면 형제 순서가 바뀔 때 같이 깨진다
const STARS = [
  { left: "6%", top: "8%", size: 2, delay: "0s" },
  { left: "15%", top: "22%", size: 1, delay: "-1.6s" },
  { left: "23%", top: "5%", size: 2, delay: "0s" },
  { left: "31%", top: "16%", size: 1, delay: "-1.6s" },
  { left: "40%", top: "9%", size: 2, delay: "0s" },
  { left: "47%", top: "26%", size: 1, delay: "-1.6s" },
  { left: "55%", top: "4%", size: 2, delay: "0s" },
  { left: "63%", top: "18%", size: 1, delay: "-1.6s" },
  { left: "70%", top: "7%", size: 2, delay: "0s" },
  { left: "78%", top: "24%", size: 1, delay: "-1.6s" },
  { left: "86%", top: "11%", size: 2, delay: "0s" },
  { left: "93%", top: "20%", size: 1, delay: "-1.6s" },
];

function NightSky() {
  return (
    <>
      {STARS.map((s) => (
        <span
          key={s.left}
          className="star"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay }}
        />
      ))}
      <div className="aurora" />
    </>
  );
}

/**
 * 남극 지평선 — CV 페이지 배경 (LSHobby #65·#67 전면 하늘에서 이관).
 * 옅은 얼음빛 하늘 아래 빙하 산 → 눈드리프트 지면 → 펭귄 무리, 성근 눈내림.
 * 방문자 시각이 밤이면(`html[data-night]`, sky.ts) 하늘이 어두워지고 별·오로라가 뜬다.
 * -z-10 고정 레이어라 페이지 콘텐츠는 그대로 위에 얹힌다.
 */
export const IceScene = memo(function IceScene() {
  return (
    <div aria-hidden="true" className="sky-ice pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <NightSky />
      <Snowfall />
      <div className="absolute left-[8%] top-[10%]">
        <PixelCloud size={92} />
      </div>
      <div className="absolute right-[10%] top-[20%]">
        <PixelCloud size={68} flip />
      </div>
      <div className="absolute bottom-9 left-[2%]">
        <PixelBerg size={190} />
      </div>
      <div className="absolute bottom-10 right-[4%]">
        <PixelBerg size={140} flip />
      </div>
      <div className="ice-ground" />
      {/* 어른+아기는 한 묶음 — %와 px를 섞으면 좁은 화면에서 서로를 뚫고 그려진다 */}
      <div className="absolute bottom-[38px] left-[5%] flex items-end gap-1">
        <PixelPenguinTiny size={26} />
        <PixelChick size={18} />
      </div>
      <div className="absolute bottom-9 left-[22%]">
        <PixelPenguinTiny size={20} flip />
      </div>
      <div className="absolute bottom-[46px] left-[38%]">
        <PixelPenguinSlide size={44} />
      </div>
      <div className="absolute bottom-[30px] left-[56%] hidden sm:block">
        <PixelPenguinTiny size={20} />
      </div>
      <div className="absolute bottom-8 right-[26%] hidden opacity-80 sm:block">
        <PixelTracks size={80} />
      </div>
      <div className="absolute bottom-[34px] right-[18%] flex items-end gap-1">
        <PixelChick size={16} flip />
        <PixelPenguinTiny size={22} flip />
      </div>
      <div className="absolute bottom-10 right-[6%]">
        <PixelPenguinTiny size={24} flip />
      </div>
    </div>
  );
});
