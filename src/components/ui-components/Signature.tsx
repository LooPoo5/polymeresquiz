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
        context.strokeStyle = document.documentElement.classList.contains('dark') ? '#FFFFFF' : '#333333';
        setCtx(context);
      }

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
  
  useEffect(() => {
    const handleThemeChange = () => {
      if (ctx) {
        ctx.strokeStyle = document.documentElement.classList.contains('dark') ? '#FFFFFF' : '#333333';
      }
    };
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          handleThemeChange();
        }
      });
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    return () => observer.disconnect();
  }, [ctx]);

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

    x = x * (canvas.width / rect.width);
    y = y * (canvas.height / rect.height);
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const endDrawing = () => {
    if (isDrawing && canvasRef.current) {
      setIsDrawing(false);
      ctx?.closePath();
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
  return <div className="flex flex-col items-center">
      <div className="signature-pad border-2 border-gray-300 dark:border-gray-300 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
        <canvas ref={canvasRef} width={width} height={height}
      style={{
        width: `${width}px`,
        height: `${height}px`
      }} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={endDrawing} onMouseLeave={endDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={endDrawing} className="touch-none bg-white dark:bg-gray-800" />
      </div>
      <button type="button" className="mt-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-brand-red transition-colors" onClick={clearSignature}>
        Effacer la signature
      </button>
    </div>;
};
export default Signature;
