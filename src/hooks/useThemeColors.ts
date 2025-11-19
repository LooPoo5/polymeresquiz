import { useState, useEffect } from 'react';

export type ThemeColors = {
  questionBgEdit: string;
  questionBgView: string;
  questionBorder: string;
  questionText: string;
  questionTextMuted: string;
  questionNumberText: string;
};

const defaultColors: ThemeColors = {
  questionBgEdit: '351 100% 86%',
  questionBgView: '0 0% 100%',
  questionBorder: '0 0% 89.8%',
  questionText: '240 5.3% 26.1%',
  questionTextMuted: '240 4.9% 40%',
  questionNumberText: '240 5.9% 10%',
};

const STORAGE_KEY = 'quiz-theme-colors';

export const useThemeColors = () => {
  const [colors, setColors] = useState<ThemeColors>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultColors;
  });

  useEffect(() => {
    // Apply colors to CSS variables
    const root = document.documentElement;
    root.style.setProperty('--question-bg-edit', colors.questionBgEdit);
    root.style.setProperty('--question-bg-view', colors.questionBgView);
    root.style.setProperty('--question-border', colors.questionBorder);
    root.style.setProperty('--question-text', colors.questionText);
    root.style.setProperty('--question-text-muted', colors.questionTextMuted);
    root.style.setProperty('--question-number-text', colors.questionNumberText);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
  }, [colors]);

  const updateColor = (key: keyof ThemeColors, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };

  const resetColors = () => {
    setColors(defaultColors);
  };

  return { colors, updateColor, resetColors };
};

// Helper function to convert HSL string to hex
export const hslToHex = (hsl: string): string => {
  const [h, s, l] = hsl.split(' ').map(v => parseFloat(v));
  const hDecimal = h / 360;
  const sDecimal = s / 100;
  const lDecimal = l / 100;

  let r, g, b;
  if (sDecimal === 0) {
    r = g = b = lDecimal;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = lDecimal < 0.5 ? lDecimal * (1 + sDecimal) : lDecimal + sDecimal - lDecimal * sDecimal;
    const p = 2 * lDecimal - q;
    r = hue2rgb(p, q, hDecimal + 1/3);
    g = hue2rgb(p, q, hDecimal);
    b = hue2rgb(p, q, hDecimal - 1/3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Helper function to convert hex to HSL string
export const hexToHsl = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0 0% 0%';

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
};
