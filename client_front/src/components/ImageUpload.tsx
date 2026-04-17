"use client";

import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Props {
  onUpload: (url: string) => void;
  onRemove: () => void;
  imageUrl: string | null;
}

export function ImageUpload({ onUpload, onRemove, imageUrl }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('5MB 이하 파일만 업로드할 수 있어요.');
      return;
    }

    setUploading(true);
    setError('');

    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const path = `posts/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(path, file, { upsert: false });

    if (uploadError) {
      setError('업로드에 실패했어요. 잠시 후 다시 시도해주세요.');
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('post-images').getPublicUrl(path);
    onUpload(data.publicUrl);
    setUploading(false);
  }

  if (imageUrl) {
    return (
      <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
        <img src={imageUrl} alt="업로드된 이미지" className="w-full max-h-80 object-cover" />
        <button
          type="button"
          onClick={() => { onRemove(); if (inputRef.current) inputRef.current.value = ''; }}
          className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    );
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors disabled:opacity-50"
      >
        {uploading ? (
          <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
        )}
        {uploading ? '업로드 중...' : '이미지 추가'}
      </button>
      {error && <p className="text-xs text-rose-500 font-bold mt-1">{error}</p>}
    </div>
  );
}
