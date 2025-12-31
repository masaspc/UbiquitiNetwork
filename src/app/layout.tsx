import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UniFi Config Simulator - 日本ストア製品構成シミュレーター',
  description: '日本国内で購入可能なUbiquiti UniFi製品を対象に、ホームネットワーク構成を支援するWebアプリケーション',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
