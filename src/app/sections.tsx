"use client";

import { useEffect, useState, type ReactNode } from "react";
import { sectionFromHash } from "./split";

/**
 * 섹션 필터 칩 — 무선택 = 전체 보기, 같은 칩 재탭 = 전체로 복귀.
 * 선택은 URL 해시(`#프로젝트`)와 동기화된다 — 특정 섹션만 보이는 링크를 공유할 수 있다.
 * 마크다운은 서버(page.tsx)에서 이미 렌더된 노드로 받는다 — react-markdown이
 * 클라이언트 번들에 실리지 않게 한다
 */
export function CvFilter({
  intro,
  sections,
}: {
  intro: ReactNode;
  sections: { title: string; node: ReactNode }[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const titlesKey = sections.map((s) => s.title).join("\n");

  // 첫 렌더는 항상 전체 보기(정적 HTML과 일치) → 마운트 후 해시를 읽어 맞춘다.
  // 뒤로가기·주소창 편집으로 해시가 바뀌어도 따라간다
  useEffect(() => {
    const titles = titlesKey.split("\n");
    const sync = () => setActive(sectionFromHash(window.location.hash, titles));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [titlesKey]);

  const pick = (title: string) => {
    const next = active === title ? null : title;
    setActive(next);
    // pushState가 아니라 replaceState — 칩을 눌러도 뒤로가기 히스토리는 안 쌓인다
    const { pathname, search } = window.location;
    window.history.replaceState(null, "", next ? `#${encodeURIComponent(next)}` : pathname + search);
  };

  return (
    <>
      {intro}
      {sections.length > 1 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {sections.map((s) => (
            <button
              key={s.title}
              onClick={() => pick(s.title)}
              aria-pressed={active === s.title}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] ${
                active === s.title ? "border-cv bg-cv text-sheet" : "border-cv/30 bg-cv-soft/40 text-faint"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      )}
      {sections
        .filter((s) => !active || s.title === active)
        .map((s) => (
          <div key={s.title}>{s.node}</div>
        ))}
    </>
  );
}
