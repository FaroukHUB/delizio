import { useRef, useState } from 'react';

interface Props {
  onUpload: (file: File) => Promise<void>;
}

export default function PhotoEditButton({ onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    inputRef.current?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try {
      await onUpload(f);
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err instanceof Error ? err.message : 'Erreur upload');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  return (
    <>
      <span
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.stopPropagation();
            inputRef.current?.click();
          }
        }}
        className="absolute top-2 end-2 z-10 w-9 h-9 rounded-full bg-black/55 backdrop-blur-sm text-white flex items-center justify-center text-base shadow-lg active:scale-90 transition"
        aria-label="Modifier la photo"
      >
        {busy ? '…' : '📷'}
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onClick={(e) => e.stopPropagation()}
        onChange={handleChange}
      />
    </>
  );
}

