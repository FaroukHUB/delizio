import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  initialUrl?: string | null;
  onChange: (file: File | null) => void;
}

export default function PhotoPicker({ initialUrl, onChange }: Props) {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    onChange(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  return (
    <div>
      <div className="aspect-square w-full max-w-[240px] mx-auto bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center mb-3">
        {preview ? (
          <img src={preview} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-5xl opacity-40">📷</span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => cameraRef.current?.click()} className="btn btn-ghost btn-md">
          📸 {t('addProduct.takePhoto')}
        </button>
        <button type="button" onClick={() => fileRef.current?.click()} className="btn btn-ghost btn-md">
          🖼️ {t('addProduct.choosePhoto')}
        </button>
      </div>
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handle}
      />
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handle} />
    </div>
  );
}
