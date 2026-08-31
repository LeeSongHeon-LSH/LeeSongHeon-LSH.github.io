import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Components } from "react-markdown";
import { Markdown } from "./markdown";
import { PixelMascot } from "./pixel";
import { IceScene } from "./scene";
import { CvFilter } from "./sections";
import { splitEntries, splitSections } from "./split";

/** cv.md의 마지막 커밋 시각 — 파일 mtime은 CI 체크아웃 시각이라 못 쓴다 (얕은 클론이면 빈 값) */
function lastEditedMonth(): string | null {
  try {
    const iso = execFileSync("git", ["log", "-1", "--format=%cI", "--", "cv.md"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"], // 커밋이 없거나 git이 없으면 조용히 실패시킨다
    }).trim();
    if (!iso) return null;
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
  } catch {
    return null;
  }
}

// LSHobby #61 CV 문서 타이포그래피 — 제목은 고운바탕, 링크·괘선 포인트는 잠옷 로즈
const cvComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mt-2 font-display text-3xl font-bold leading-snug">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-8 border-b border-line pb-1.5 font-display text-xl font-bold">{children}</h2>
  ),
  h3: ({ children }) => <h3 className="mt-5 font-display text-base font-bold">{children}</h3>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer" className="text-cv underline underline-offset-2">
      {children}
    </a>
  ),
};

// 카드 안에서는 제목이 박스의 첫 줄 — 바깥에서 쓰던 윗여백을 뺀다
const cardComponents: Components = {
  ...cvComponents,
  h3: ({ children }) => <h3 className="font-display text-base font-bold">{children}</h3>,
};

/** 섹션 하나 — `### ` 항목이 있으면 항목마다 네모 박스로 싼다 (없으면 통째로 렌더) */
function Section({ body }: { body: string }) {
  const { head, entries } = splitEntries(body);
  if (entries.length === 0) return <Markdown components={cvComponents}>{body}</Markdown>;
  return (
    <>
      <Markdown components={cvComponents}>{head}</Markdown>
      <div className="mt-4 space-y-3">
        {entries.map((e) => (
          <div
            key={e.title}
            className="cv-card rounded-lg border border-line bg-paper/35 px-4 py-3.5 sm:px-5"
          >
            <Markdown components={cardComponents}>{e.body}</Markdown>
          </div>
        ))}
      </div>
    </>
  );
}

/**
 * 공개 CV — "이력서 = 종이 한 장": 눈밭 위 종이 시트, 위 모서리에 잠옷 펭귄(장식).
 * 본문 원본은 리포의 cv.md — 빌드 때 읽어 정적 HTML로 굳는다 (GitHub Pages는 서버가 없다).
 */
export default function CvPage() {
  const content = readFileSync(join(process.cwd(), "cv.md"), "utf8").trim();
  const { intro, sections } = splitSections(content);
  const edited = lastEditedMonth();
  return (
    <main className="relative mx-auto w-full max-w-2xl flex-1 px-4 pb-16 pt-14 sm:px-6">
      <IceScene />
      <div className="absolute left-1/2 top-[26px] z-[2] -translate-x-1/2">
        <PixelMascot size={48} />
      </div>
      <div className="relative z-[1] min-h-[70dvh] rounded-lg border border-line bg-sheet px-6 pb-12 pt-10 shadow-[0_10px_30px_rgba(34,38,43,0.08)] sm:px-10">
        {content ? (
          <CvFilter
            intro={intro ? <Markdown components={cvComponents}>{intro}</Markdown> : null}
            sections={sections.map((s) => ({
              title: s.title,
              node: <Section body={s.body} />,
            }))}
          />
        ) : (
          <p className="pt-16 text-center text-sm text-faint">CV 준비 중입니다.</p>
        )}
        {content && edited && (
          <p className="absolute bottom-3.5 right-5 font-mono text-[10px] text-line">
            마지막 수정 {edited}
          </p>
        )}
      </div>
    </main>
  );
}
