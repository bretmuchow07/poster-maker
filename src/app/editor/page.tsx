'use client';

import dynamic from 'next/dynamic';

const EditorLayout = dynamic(() => import('@/components/editor/EditorLayout'), {
    ssr: false,
    loading: () => (
        <div className="flex h-screen items-center justify-center bg-[#121214] text-white text-xs font-medium">
            <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-[var(--accent,#ff5c00)] border-t-transparent rounded-full animate-spin" />
                <span>Loading Studio...</span>
            </div>
        </div>
    )
});

export default function EditorPage() {
    return <EditorLayout />;
}
