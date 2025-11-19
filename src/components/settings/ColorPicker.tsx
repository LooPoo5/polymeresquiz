import React from 'react';
import { Label } from '@/components/ui/label';
import { hslToHex, hexToHsl } from '@/hooks/useThemeColors';

type ColorPickerProps = {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
};

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  label, 
  description, 
  value, 
  onChange 
}) => {
  const hexValue = hslToHex(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    const hsl = hexToHsl(hex);
    onChange(hsl);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">{label}</Label>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-md border border-border shadow-sm"
            style={{ backgroundColor: `hsl(${value})` }}
          />
          <input
            type="color"
            value={hexValue}
            onChange={handleChange}
            className="w-12 h-10 rounded-md border border-border cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
