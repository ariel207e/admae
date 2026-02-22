'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    </div>
  );
}
