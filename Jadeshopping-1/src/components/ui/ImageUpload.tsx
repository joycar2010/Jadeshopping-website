import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Star, Move } from 'lucide-react';
import { ProductImage } from '@/types';

interface ImageUploadProps {
  images: ProductImage[];
  onUpload: (file: File) => Promise<ProductImage | null>;
  onDelete: (imageId: string) => Promise<boolean>;
  onReorder: (images: ProductImage[]) => Promise<boolean>;
  onSetMain: (imageId: string) => void;
  loading?: boolean;
  maxImages?: number;
  acceptedTypes?: string[];
  maxFileSize?: number; // in MB
  error?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onUpload,
  onDelete,
  onReorder,
  onSetMain,
  loading = false,
  maxImages = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize = 5,
  error
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // 检查文件类型
      if (!acceptedTypes.includes(file.type)) {
        alert(`不支持的文件类型: ${file.type}`);
        continue;
      }
      
      // 检查文件大小
      if (file.size > maxFileSize * 1024 * 1024) {
        alert(`文件大小不能超过 ${maxFileSize}MB`);
        continue;
      }
      
      // 检查图片数量限制
      if (images.length >= maxImages) {
        alert(`最多只能上传 ${maxImages} 张图片`);
        break;
      }
      
      await onUpload(file);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      handleDragEnd();
      return;
    }

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    
    // 移除被拖拽的图片
    newImages.splice(draggedIndex, 1);
    
    // 在新位置插入图片
    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newImages.splice(insertIndex, 0, draggedImage);
    
    await onReorder(newImages);
    handleDragEnd();
  };

  const handleSetMainImage = (imageId: string) => {
    onSetMain(imageId);
  };

  const handleDeleteImage = async (imageId: string) => {
    if (window.confirm('确定要删除这张图片吗？')) {
      await onDelete(imageId);
    }
  };

  return (
    <div className="space-y-4">
      {/* 上传区域 */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        
        <div className="space-y-2">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || images.length >= maxImages}
              className="text-blue-600 hover:text-blue-500 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              点击上传图片
            </button>
            <p className="text-gray-500 text-sm mt-1">
              或拖拽图片到此处
            </p>
          </div>
          <p className="text-xs text-gray-400">
            支持 {acceptedTypes.map(type => type.split('/')[1]).join(', ')} 格式，
            单个文件不超过 {maxFileSize}MB，最多 {maxImages} 张
          </p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* 图片列表 */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">
              已上传图片 ({images.length}/{maxImages})
            </h4>
            <p className="text-xs text-gray-500">
              拖拽图片可调整顺序，第一张为主图
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`
                  relative group border-2 rounded-lg overflow-hidden cursor-move
                  ${image.is_main ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                  ${dragOverIndex === index ? 'border-blue-400 bg-blue-50' : ''}
                  ${draggedIndex === index ? 'opacity-50' : ''}
                  hover:border-gray-300 transition-all
                `}
              >
                {/* 主图标识 */}
                {image.is_main && (
                  <div className="absolute top-2 left-2 z-10">
                    <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      主图
                    </div>
                  </div>
                )}

                {/* 拖拽图标 */}
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Move className="h-4 w-4 text-gray-600 bg-white rounded p-0.5" />
                </div>

                {/* 图片 */}
                <div className="aspect-square">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NyA3NEg2M0M2MS44OTU0IDc0IDYxIDc0Ljg5NTQgNjEgNzZWMTI0QzYxIDEyNS4xMDUgNjEuODk1NCAxMjYgNjMgMTI2SDEzN0MxMzguMTA1IDEyNiAxMzkgMTI1LjEwNSAxMzkgMTI0Vjc2QzEzOSA3NC44OTU0IDEzOC4xMDUgNzQgMTM3IDc0SDExM00xMTMgNzRWNjZDMTEzIDY0Ljg5NTQgMTEyLjEwNSA2NCAxMTEgNjRIODlDODcuODk1NCA2NCA4NyA2NC44OTU0IDg3IDY2Vjc0TTExMyA3NEg4N00xMDAgOTBDMTAzLjMxNCA5MCAxMDYgOTIuNjg2MyAxMDYgOTZDMTA2IDk5LjMxMzcgMTAzLjMxNCAxMDIgMTAwIDEwMkM5Ni42ODYzIDEwMiA5NCA5OS4zMTM3IDk0IDk2Qzk0IDkyLjY4NjMgOTYuNjg2MyA5MCAxMDAgOTBaTTEyNiAxMTRMMTE4IDEwNkMxMTcuNjI2IDEwNS42MjYgMTE3LjA2NSAxMDUuNDY5IDExNi41MjcgMTA1LjY4NEMxMTUuOTg5IDEwNS44OTkgMTE1LjU2OCAxMDYuNDUgMTE1LjQ0IDEwNy4wMTJMMTEzIDExNkw5NiAxMDJDOTUuNjI2IDEwMS42MjYgOTUuMDY1IDEwMS40NjkgOTQuNTI3IDEwMS42ODRDOTMuOTg5IDEwMS44OTkgOTMuNTY4IDEwMi40NSA5My40NCAxMDMuMDEyTDc0IDEyMEgxMjZWMTE0WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                    }}
                  />
                </div>

                {/* 操作按钮 */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    {!image.is_main && (
                      <button
                        type="button"
                        onClick={() => handleSetMainImage(image.id)}
                        className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title="设为主图"
                      >
                        <Star className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(image.id)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      title="删除图片"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* 加载状态 */}
                {loading && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 空状态 */}
      {images.length === 0 && !loading && (
        <div className="text-center py-8">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">还没有上传任何图片</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;