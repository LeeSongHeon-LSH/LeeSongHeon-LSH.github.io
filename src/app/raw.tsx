"use client";

import { useEffect, useState, type ReactNode } from "react";

/** 입력 중인 곳에서는 단축키를 가로채지 않는다 — 지금은 입력칸이 없지만 생기면 바로 문제가 된다 */
function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el || typeof el.tagName !== "string") return false;
  return el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
}

/**
 * 원본 md 토글 — `` ` `` 키(또는 종이 왼쪽 아래 `cv.md`)를 누르면 렌더 대신 cv.md 원문을 보여준다.
 * "본문 원본은 cv.md 하나"라는 말을 페이지가 직접 증명한다. Esc로 돌아온다.
 */
export function RawToggle({ raw, children }: { raw: string; children: ReactNode }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // e.repeat: 키를 누르고 있으면 본문이 초당 수십 번 뒤집힌다. isComposing: 한글 조합 중
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat || e.isComposing) return;
      if (isTyping(e.target)) return;
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
        type="button"
        onClick={() => setOn((v) => !v)}
        aria-pressed={on}
        title={on ? "렌더된 화면으로 (Esc)" : "마크다운 원문 보기 (` 키)"}
        className="absolute bottom-3.5 left-5 font-mono text-[10px] text-faint hover:text-ink"
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
        {/* 줄바꿈은 이 "\n" 하나가 전부 — .raw-line이 block이면 여기에 줄바꿈이 하나 더 붙어
            화면은 멀쩡한데 복사한 텍스트가 두 줄씩 벌어진다 (globals.css의 inline-block 주석 참고) */}
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
