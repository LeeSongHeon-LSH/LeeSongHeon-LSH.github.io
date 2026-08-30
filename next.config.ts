import type { NextConfig } from "next";

// GitHub Pages는 정적 호스팅 — 서버 없이 out/ 을 그대로 서빙한다.
// 사용자 사이트(leesongheon-lsh.github.io)라 basePath 없음.
const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
