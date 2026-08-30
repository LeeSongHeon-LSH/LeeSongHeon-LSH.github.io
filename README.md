# 이송헌 — CV

공개 이력서 한 장. **https://leesongheon-lsh.github.io**

- 본문 원본은 이 리포의 [`cv.md`](cv.md) 하나 — 마크다운 한 덩어리.
- `main`에 푸시하면 GitHub Actions가 정적 빌드(`next build` → `out/`)해서 Pages로 배포한다.
- 화면은 취미 프로젝트 [LSHobby](https://github.com/LeeSongHeon-LSH/LSHobby)의 CV 모듈(#61 "이력서 = 종이 한 장")을 이관한 것이다.

## 수정하는 법

`cv.md`를 고치고 커밋하면 끝이다. 브라우저에서 바로 고치려면
[cv.md 편집](https://github.com/LeeSongHeon-LSH/LeeSongHeon-LSH.github.io/edit/main/cv.md).

문서 규칙:

- `# 제목`은 문서 맨 위 한 번 — 이름·이메일·학위 등 기본 정보는 그 아래 도입부에 쓴다.
- `## 제목`이 곧 **섹션 필터 칩**이 된다. 칩을 누르면 그 섹션만, 다시 누르면 전체로 돌아온다.
- `cv.md`가 비어 있으면 페이지는 "CV 준비 중입니다."만 보여준다.
- "마지막 수정"은 `cv.md`의 마지막 커밋 시각에서 자동으로 나온다.

## 개발

```bash
npm install
npm run dev     # localhost:3000
npm test        # 도트 스프라이트·섹션 분리 검사
npm run build   # out/ 에 정적 산출물
```
