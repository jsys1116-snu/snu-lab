"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!password) {
      setError('비밀번호를 입력하세요.');
      return;
    }

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '인증에 실패했습니다.');
      }

      // 인증 성공 시에만 쿠키 저장
      document.cookie = `admin_token=${encodeURIComponent(password)}; path=/; max-age=86400`;
      router.push('/admin/publications');
    } catch (err) {
      const message = err instanceof Error ? err.message : '인증에 실패했습니다.';
      setError(message);
    }
  };

  return (
    <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-6">
      <div className="space-y-3 rounded-2xl border p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Login</h1>
        <p className="text-sm text-gray-600">입력한 비밀번호가 맞으면 관리자 페이지로 이동합니다.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  );
}
