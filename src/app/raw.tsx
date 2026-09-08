"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * 원본 md 토글 — `` ` `` 키(또는 종이 왼쪽 아래 `cv.md`)를 누르면 렌더 대신 cv.md 원문을 보여준다.
 * "본문 원본은 cv.md 하나"라는 말을 페이지가 직접 증명한다. Esc로 돌아온다.
 */
export function RawToggle({ raw, children }: { raw: string; children: ReactNode }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "`") {
        e.preventDefault();
        setOn((v) => !v);
      } else if (e.key === "Escape") {
        setOn(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {on ? <RawView raw={raw} /> : children}
      <button
        onClick={() => setOn((v) => !v)}
        title={on ? "렌더된 화면으로 (Esc)" : "마크다운 원문 보기 (` 키)"}
        className="absolute bottom-3.5 left-5 font-mono text-[10px] text-line hover:text-faint"
      >
        {on ? "← 렌더" : "cv.md"}
      </button>
    </>
  );
}

function RawView({ raw }: { raw: string }) {
  const lines = raw.split("\n");
  return (
    <div>
      <p className="flex items-baseline justify-between border-b border-line pb-1.5 font-mono text-[11px] text-faint">
        <span>cv.md</span>
        <span>
          {lines.length}줄 · 이 페이지가 읽는 파일 그대로 · <kbd className="rounded border border-line px-1">`</kbd> 로 돌아가기
        </span>
      </p>
      <pre className="raw-md mt-3 whitespace-pre-wrap break-words font-mono text-[11.5px] leading-relaxed text-ink">
        {lines.map((line, i) => (
          <span key={i} className="raw-line">
            {line}
            {"\n"}
          </span>
        ))}
      </pre>
    </div>
  );
}
