import type { Metadata } from "next";
import { Gowun_Batang, IBM_Plex_Mono, IBM_Plex_Sans_KR } from "next/font/google";
import "./globals.css";
import { NIGHT_SCRIPT } from "./sky";

// LSHobby(#48)에서 이관한 타이포 시스템 — 제목: 고운바탕 / 본문: IBM Plex Sans KR / 수치: IBM Plex Mono
const gowun = Gowun_Batang({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-gowun" });
const plex = IBM_Plex_Sans_KR({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--font-plex" });
const plexMono = IBM_Plex_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-plex-mono" });

export const metadata: Metadata = {
  title: "이송헌 — CV",
  description: "이송헌(Lee SongHeon)의 이력서",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${gowun.variable} ${plex.variable} ${plexMono.variable} h-full antialiased`}>
      <head>
        {/* 밤 판정은 첫 페인트 전에 — 하이드레이션 뒤에 바꾸면 낮 하늘이 한 번 번쩍인다.
            theme-color 메타(주소창 색)도 이 스크립트가 만든다 (sky.ts 주석 참고) */}
        <script dangerouslySetInnerHTML={{ __html: NIGHT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col bg-paper text-ink">{children}</body>
    </html>
  );
}
