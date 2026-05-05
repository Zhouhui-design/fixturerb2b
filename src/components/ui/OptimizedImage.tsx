import React, { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  priority?: boolean; // 是否优先加载(首屏图片)
  aspectRatio?: string; // 宽高比,如 "16/9", "4/3"
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  fallbackSrc?: string; // 备用图片
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * 优化的图片组件
 * 功能:
 * - 懒加载(Intersection Observer)
 * - WebP格式自动检测和降级
 * - 占位符和加载状态
 * - 错误处理和备用图片
 * - 响应式尺寸
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  aspectRatio,
  objectFit = 'cover',
  fallbackSrc,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(!priority);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 将JPEG/PNG路径转换为WebP路径
  const getWebPSrc = (originalSrc: string): string => {
    // 如果已经是WebP格式,直接返回
    if (originalSrc.endsWith('.webp')) {
      return originalSrc;
    }
    
    // 检查是否有对应的WebP版本
    const webpPath = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    return webpPath;
  };

  // 检测浏览器是否支持WebP
  const supportsWebP = (): boolean => {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  };

  // 初始化图片源
  useEffect(() => {
    const hasWebPSupport = supportsWebP();
    const finalSrc = hasWebPSupport ? getWebPSrc(src) : src;
    setCurrentSrc(finalSrc);
  }, [src]);

  // 设置Intersection Observer用于懒加载
  useEffect(() => {
    if (priority || !imgRef.current) {
      setIsLoading(false);
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoading(false);
            // 停止观察
            if (observerRef.current) {
              observerRef.current.disconnect();
            }
          }
        });
      },
      {
        rootMargin: '50px 0px', // 提前50px开始加载
        threshold: 0.01,
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority]);

  // 处理图片加载完成
  const handleLoad = () => {
    setIsLoaded(true);
    setIsLoading(false);
    onLoad?.();
  };

  // 处理图片加载错误
  const handleError = () => {
    setError(true);
    setIsLoading(false);
    
    // 如果有备用图片,尝试加载
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setError(false);
    } else {
      onError?.();
    }
  };

  // 计算样式
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: width || '100%',
    height: height || 'auto',
  };

  if (aspectRatio) {
    const [w, h] = aspectRatio.split('/').map(Number);
    if (w && h) {
      containerStyle.aspectRatio = `${w}/${h}`;
    }
  }

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit,
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
  };

  // 如果不需要懒加载且还没加载,立即显示
  const shouldShowImage = !isLoading || priority;

  return (
    <div className={`relative overflow-hidden ${className}`} style={containerStyle}>
      {/* 占位符背景(加载时显示) */}
      {!isLoaded && !error && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"
          style={{ zIndex: 1 }}
        />
      )}

      {/* 实际图片 */}
      {shouldShowImage && !error && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          style={imageStyle}
          className="block"
        />
      )}

      {/* 错误状态 */}
      {error && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400"
          style={{ zIndex: 2 }}
        >
          <div className="text-center">
            <svg
              className="w-12 h-12 mx-auto mb-2 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm">Image unavailable</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
