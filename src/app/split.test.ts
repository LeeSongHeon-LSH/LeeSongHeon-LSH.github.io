import { describe, expect, it } from "vitest";
import { splitEntries, splitSections } from "./split";

// #61 섹션 필터 — h2 기준 분할 규칙 (서버 렌더·클라 필터가 공유)
describe("splitSections", () => {
  it("h2가 없으면 전부 intro", () => {
    const md = "# 이름\n소개 문단";
    expect(splitSections(md)).toEqual({ intro: md, sections: [] });
  });

  it("h2 기준으로 제목·본문을 자른다", () => {
    const { intro, sections } = splitSections("# 이름\n\n## 소개\n안녕\n\n## 기술\nTS");
    expect(intro).toBe("# 이름\n");
    expect(sections.map((s) => s.title)).toEqual(["소개", "기술"]);
    expect(sections[0].body).toBe("## 소개\n안녕\n");
    expect(sections[1].body).toBe("## 기술\nTS");
  });

  it("문서가 h2로 시작하면 intro 없음", () => {
    const { intro, sections } = splitSections("## 소개\n안녕");
    expect(intro).toBe("");
    expect(sections).toHaveLength(1);
  });

  it("빈 문서", () => {
    expect(splitSections("")).toEqual({ intro: "", sections: [] });
  });
});

// 항목 카드 — h3 기준 분할 규칙 (프로젝트 하나 = 네모 박스 하나)
describe("splitEntries", () => {
  it("h3가 없으면 전부 head, 카드 없음", () => {
    const body = "## 학력\n\n- 대학원\n- 학부";
    expect(splitEntries(body)).toEqual({ head: body, entries: [] });
  });

  it("h3 기준으로 항목을 자르고 h2 도입부는 head에 남긴다", () => {
    const { head, entries } = splitEntries("## 프로젝트\n\n### 가\n한 줄\n\n### 나\n두 줄");
    expect(head).toBe("## 프로젝트\n");
    expect(entries.map((e) => e.title)).toEqual(["가", "나"]);
    expect(entries[0].body).toBe("### 가\n한 줄\n");
    expect(entries[1].body).toBe("### 나\n두 줄");
  });

  it("h3 제목에 구분자가 들어가도 제목 전체를 쓴다", () => {
    const { entries } = splitEntries("## 프로젝트\n\n### add-drivers — ADD 스킬\n본문");
    expect(entries[0].title).toBe("add-drivers — ADD 스킬");
  });

  it("h4는 항목을 자르지 않는다", () => {
    const { entries } = splitEntries("## 프로젝트\n\n### 가\n#### 하위\n본문");
    expect(entries).toHaveLength(1);
    expect(entries[0].body).toContain("#### 하위");
  });
});
