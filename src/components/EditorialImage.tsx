import { useState } from 'react';
import { Camera } from 'lucide-react';

interface EditorialImageProps {
  src: string;
  alt: string;
  fallbackTitle?: string;
  className?: string;
  loading?: 'eager' | 'lazy';
}

export function EditorialImage({
  src,
  alt,
  fallbackTitle = 'Miami Sunset Edition',
  className = 'w-full h-full object-cover',
  loading = 'lazy',
}: EditorialImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#25203F] via-[#181B28] to-[#11131C] text-[#FFF4E8]/60 p-6 text-center ${className}`}
      >
        <Camera className="w-6 h-6 text-[#F7C779]/70 mb-2" strokeWidth={1.5} />
        <span className="font-editorial italic text-xl text-[var(--accent-3)]">{fallbackTitle}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
