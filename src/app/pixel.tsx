// 도트 아이콘 세트 — LSHobby(#60)에서 CV 사이트가 쓰는 스프라이트만 이관.
// 배경 장면 소품은 도메인색을 쓰지 않고 빙하 톤만 쓴다.

function PixelArt({
  grid,
  palette,
  size,
  cells = 16,
  cellsY,
  flip = false,
}: {
  grid: string[];
  palette: Record<string, string>;
  size: number;
  cells?: number;
  cellsY?: number; // 세로 셀 수 — 정사각이 아닌 스프라이트(빙하·발자국)용
  flip?: boolean; // 좌우 반전
}) {
  const rows = cellsY ?? cells;
  return (
    <svg
      width={size}
      height={(size * rows) / cells}
      viewBox={`0 0 ${cells} ${rows}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <g transform={flip ? `translate(${cells} 0) scale(-1 1)` : undefined}>
        {grid.flatMap((row, y) =>
          [...row].map((ch, x) =>
            ch === "." ? null : (
              <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={palette[ch]} />
            ),
          ),
        )}
      </g>
    </svg>
  );
}

// 마스코트 — 잠옷 모자를 쓰고 펼쳐진 책 위에 앉은 펭귄 (LSHobby 마스코트 승계)
const MASCOT_GRID = [
  "......CCCC......",
  ".....CCCCCC.....",
  ".....FFFFFF.....",
  "....CCCCCCCCWW..",
  "....KKKKKKKK....",
  "...KKKKKKKKKK...",
  "...KKWKKKKWKK...",
  "...KKKKEEKKKK...",
  "...KKWWWWWWKK...",
  "...KKWWWWWWKK...",
  "...KKWWWWWWKK...",
  "...KKKWWWWKKK...",
  ".....EE..EE.....",
  "BGGGGGGDDGGGGGGB",
  "BGGGGGGDDGGGGGGB",
  ".BBBBBBBBBBBBBB.",
];
const MASCOT_PALETTE = {
  K: "#22262b",
  B: "#8b6f47",
  C: "#c05e7c",
  D: "#cfc4a8",
  E: "#e2801f",
  F: "#e8b7c5",
  G: "#f1ead9",
  W: "#fafbfc",
};

export const PixelMascot = ({ size = 44 }: { size?: number }) => (
  <PixelArt grid={MASCOT_GRID} palette={MASCOT_PALETTE} size={size} />
);

// 꼬마 펭귄 — 장면에 세워 두는 소품 (아무것도 들지 않은 기본 자세)
const PENGUIN_TINY_GRID = [
  "...KKKKKK...",
  "..KKKKKKKK..",
  "..KKWKKWKK..",
  "..KKKCCKKK..",
  "..KKWWWWKK..",
  ".KKWWWWWWKK.",
  ".KKWWWWWWKK.",
  ".KKWWWWWWKK.",
  "..KKWWWWKK..",
  "...CC..CC...",
];

export const PixelPenguinTiny = ({ size = 22, flip = false }: { size?: number; flip?: boolean }) => (
  <PixelArt
    grid={PENGUIN_TINY_GRID}
    palette={{ K: "#22262b", C: "#e2801f", W: "#fafbfc" }}
    size={size}
    cells={12}
    cellsY={10}
    flip={flip}
  />
);

// 빙하 산 — 두 봉우리, 눈 덮인 능선(W)·빙벽(I)·그늘 파셋(J). 밑단은 눈 지면에 묻힌다
const BERG_GRID = [
  "......W.................",
  ".....WWW................",
  ".....WWWW...............",
  "....WWIWWW..............",
  "....WIIWWJW.............",
  "...WWIIIWWJW.....W......",
  "...WIIIIIWJJW...WWW.....",
  "..WWIIIIIIJJW..WWIWW....",
  "..WIIIIIIIJJJW.WWIIJW...",
  ".WWIIIIIIIIJJWWIIIIJJW..",
  "WWIIIIIIIIIJJJWIIIIIJJW.",
  "WIIIIIIIIIIJJJIIIIIIJJJW",
  "IIIIIIIIIIIJJJIIIIIIJJJJ",
  "IIIIIIIIIIJJJJIIIIIJJJJJ",
];

export const PixelBerg = ({ size = 160, flip = false }: { size?: number; flip?: boolean }) => (
  <PixelArt
    grid={BERG_GRID}
    palette={{ W: "#fafbfc", I: "#cfdfe9", J: "#a9c4d6" }}
    size={size}
    cells={24}
    cellsY={14}
    flip={flip}
  />
);

// 아기 펭귄 — 회색 솜털, 흰 얼굴에 까만 눈 (황제펭귄 새끼)
const CHICK_GRID = [
  "..KKKKKK..",
  ".KKWWWWKK.",
  ".KWKWWKWK.",
  ".KWWCCWWK.",
  ".FFFFFFFF.",
  "FFFFFFFFFF",
  "FFFFFFFFFF",
  ".FFFFFFFF.",
  "..CC..CC..",
];

export const PixelChick = ({ size = 17, flip = false }: { size?: number; flip?: boolean }) => (
  <PixelArt
    grid={CHICK_GRID}
    palette={{ K: "#22262b", W: "#fafbfc", C: "#e2801f", F: "#a8b2ba" }}
    size={size}
    cells={10}
    cellsY={9}
    flip={flip}
  />
);

// 배밀이 펭귄 — 눈 위를 미끄러지는 중 (머리가 진행 방향)
const PENGUIN_SLIDE_GRID = [
  "..........KKKKK...",
  ".KKKKKKKKKKKWKKK..",
  "KKKKKKKKKKKKKKKCC.",
  "KWWWWWWWWWWWWKKC..",
  ".KWWWWWWWWWWWWK...",
  "..WWWWWWWWWWWW....",
  ".CC...............",
  "..................",
];

export const PixelPenguinSlide = ({ size = 44 }: { size?: number }) => (
  <PixelArt
    grid={PENGUIN_SLIDE_GRID}
    palette={{ K: "#22262b", C: "#e2801f", W: "#fafbfc" }}
    size={size}
    cells={18}
    cellsY={8}
  />
);

// 뭉게구름 — 하늘 소품
const CLOUD_GRID = [
  "......WWWW..........",
  "....WWWWWWWWWW......",
  "..WWWWWWWWWWWWWWW...",
  ".WWWWWWWWWWWWWWWWWW.",
  ".UUUUUUUUUUUUUUUUUU.",
];

export const PixelCloud = ({ size = 84, flip = false }: { size?: number; flip?: boolean }) => (
  <PixelArt
    grid={CLOUD_GRID}
    palette={{ W: "#ffffff", U: "#e2ebf2" }}
    size={size}
    cells={20}
    cellsY={5}
    flip={flip}
  />
);

// 눈 위 펭귄 발자국 — 좌우 번갈아 딛은 자국
const TRACKS_GRID = [
  "FF........FF........FF......",
  "............................",
  ".....FF........FF........FF.",
];

export const PixelTracks = ({ size = 92 }: { size?: number }) => (
  <PixelArt grid={TRACKS_GRID} palette={{ F: "#c5d2dd" }} size={size} cells={28} cellsY={3} />
);
