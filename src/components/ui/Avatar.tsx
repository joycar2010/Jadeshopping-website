import React from 'react';

export interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null;
  fallbackSrc?: string;
  size?: number | string; // 以 px 为单位或任意 CSS 尺寸
  shape?: 'circle' | 'rounded' | 'square';
  bordered?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'avatar',
  className = '',
  fallbackSrc = '/favicon.svg',
  loading = 'lazy',
  decoding = 'async',
  size,
  shape = 'circle',
  bordered = false,
  onError,
  ...rest
}) => {
  const handleError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    if (typeof onError === 'function') onError(e);
    const img = e.currentTarget;
    // 避免回退占位图也触发错误导致循环
    if (!img.src.includes(fallbackSrc)) {
      img.onerror = null;
      img.src = fallbackSrc;
    }
  };

  const styleDim: React.CSSProperties | undefined =
    typeof size !== 'undefined'
      ? (typeof size === 'number'
          ? { width: `${size}px`, height: `${size}px` }
          : { width: size, height: size })
      : undefined;

  const shapeClass = shape === 'circle' ? 'rounded-full' : shape === 'rounded' ? 'rounded-lg' : '';
  const borderClass = bordered ? 'border' : '';

  return (
    <img
      src={src || fallbackSrc}
      alt={alt}
      className={`${shapeClass} ${borderClass} object-cover ${className}`}
      style={styleDim}
      loading={loading as any}
      decoding={decoding as any}
      onError={handleError}
      {...rest}
    />
  );
};

export default Avatar;