'use client';

import React, { useCallback, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { Loader2, X } from 'lucide-react';

const OUTPUT_SIZE = 1080; // px, square
const JPEG_QUALITY = 0.82;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function getCroppedFile(imageSrc: string, cropPixels: Area, fileName: string): Promise<File> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    OUTPUT_SIZE,
    OUTPUT_SIZE
  );

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Failed to export image'))), 'image/jpeg', JPEG_QUALITY);
  });

  const baseName = fileName.replace(/\.[^.]+$/, '');
  return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' });
}

export function ImageCropModal({
  file,
  onCancel,
  onCropped,
}: {
  file: File;
  onCancel: () => void;
  onCropped: (file: File) => void;
}) {
  const [imageSrc] = useState(() => URL.createObjectURL(file));
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    try {
      setProcessing(true);
      const cropped = await getCroppedFile(imageSrc, croppedAreaPixels, file.name);
      URL.revokeObjectURL(imageSrc);
      onCropped(cropped);
    } catch (err) {
      console.error('Crop failed:', err);
      alert('Failed to crop image. Please try again.');
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    URL.revokeObjectURL(imageSrc);
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] px-4">
      <div className="bg-white w-full max-w-lg shadow-xl" style={{ backgroundColor: '#fffaf4' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#e5dcd4' }}>
          <h3 className="text-lg font-light" style={{ color: '#3d2817' }}>
            Crop photo (1:1 square)
          </h3>
          <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="relative w-full" style={{ height: 360, backgroundColor: '#222' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="rect"
            showGrid
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wide mb-2" style={{ color: '#8b6f47' }}>
              Zoom
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              disabled={processing}
              className="flex-1 px-4 py-2 text-sm border"
              style={{ backgroundColor: '#e5dcd4', color: '#3d2817' }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={processing || !croppedAreaPixels}
              className="flex-1 px-4 py-2 text-sm text-white inline-flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: '#3d2817' }}
            >
              {processing && <Loader2 size={16} className="animate-spin" />}
              Use this crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
