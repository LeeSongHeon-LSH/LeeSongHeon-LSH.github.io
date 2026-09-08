"use client";

import { useState } from "react";
import { PixelChick, PixelMascot } from "./pixel";

const MAX_CHICKS = 3;

/**
 * 종이 위 모서리 마스코트 — 누르면 폴짝 뛰고, 뛸 때마다 아기 펭귄이 한 마리씩 따라온다.
 * 셋이 다 모이면 다음 클릭에 흩어진다. 못 찾아도 아무 손해 없는 장난감.
 */
export function Mascot() {
  const [hops, setHops] = useState(0);
  const chicks = hops % (MAX_CHICKS + 1);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setHops((n) => n + 1)}
        aria-label="펭귄 마스코트 — 누르면 폴짝"
        className="pg-host block cursor-pointer rounded-sm"
      >
        {/* 폴짝(hop)은 바깥, 뒤뚱(waddle)은 안쪽 — 한 요소에 두 animation을 못 얹는다. key로 매번 처음부터 */}
        <span key={hops} className={`block ${hops ? "hop" : ""}`}>
          <span className="pg-waddle">
            <PixelMascot size={48} />
          </span>
        </span>
      </button>
      {/* 아기들은 오른쪽으로 붙는다 — 마스코트는 계속 종이 가운데에 */}
      <div className="absolute bottom-1 left-full ml-1 flex items-end gap-0.5 whitespace-nowrap">
        {Array.from({ length: chicks }, (_, i) => (
          <span key={i} className="chick-pop" style={{ animationDelay: `${i * 40}ms` }}>
            <PixelChick size={14} />
          </span>
        ))}
      </div>
    </div>
  );
}
