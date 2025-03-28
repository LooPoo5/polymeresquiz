
import React, { useRef, useEffect, useState } from 'react';

interface SignatureProps {
  onChange: (signature: string) => void;
  value?: string;
  width?: number;
  height?: number;
}

const Signature: React.FC<SignatureProps> = ({ 
  onChange, 
  value, 
  width = 300, 
  height = 150 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = '#333333';
        setCtx(context);
      }

      // Load signature if value is provided
      if (value && context) {
        const img = new Image();
        img.onload = () => {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(img, 0, 0);
        };
        img.src = value;
      }
    }
  }, [value]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    if (ctx && canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      let x, y;
      
      if ('touches' in e) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }
      
      // Adjust for any scaling between the canvas display size and actual size
      x = x * (canvas.width / rect.width);
      y = y * (canvas.height / rect.height);
      
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    // Adjust for any scaling between the canvas display size and actual size
    x = x * (canvas.width / rect.width);
    y = y * (canvas.height / rect.height);
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDrawing = () => {
    if (isDrawing && canvasRef.current) {
      setIsDrawing(false);
      ctx?.closePath();
      // Save signature as data URL and call onChange
      const signatureData = canvasRef.current.toDataURL('image/png');
      onChange(signatureData);
    }
  };

  const clearSignature = () => {
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      onChange('');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="signature-pad border border-gray-300 dark:border-gray-400 rounded-lg overflow-hidden bg-white dark:bg-gray-700">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="touch-none" // Prevents touch scrolling while signing
          style={{ 
            width: `${width}px`, 
            height: `${height}px` 
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
      </div>
      <button
        type="button"
        className="mt-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-brand-red transition-colors"
        onClick={clearSignature}
      >
        Effacer la signature
      </button>
    </div>
  );
};

export default Signature;
