import React, { Suspense } from 'react';
import EditorLayout from '@/components/editor/EditorLayout';

export default function EditorPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#121214] text-white">Loading Studio...</div>}>
            <EditorLayout />
        </Suspense>
    );
}
