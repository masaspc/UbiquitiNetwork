'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#0a0e14]/95 backdrop-blur border-b border-white/10">
      <div className="max-w-[1800px] mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">U</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">UniFi Config Simulator</h1>
            <p className="text-xs text-gray-400">日本ストア製品構成シミュレーター</p>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          <a
            href="https://jp.store.ui.com/jp/ja"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
          >
            公式ストア
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </nav>
      </div>
    </header>
  );
}
