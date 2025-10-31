import { Request, Response, NextFunction } from 'express';

export const DEFAULT_TEXT_MAX = 255;

type TextOptions = {
  required?: boolean;
  min?: number;
  max?: number;
};

export function textField(field: string, opts: TextOptions = {}) {
  const { required = false, min = 0, max = DEFAULT_TEXT_MAX } = opts;
  return (req: Request, res: Response, next: NextFunction) => {
    const raw = req.body?.[field];
    const value = typeof raw === 'string' ? raw : String(raw ?? '');
    const trimmed = value.trim();

    if (required && trimmed.length === 0) {
      return res.status(400).json({ ok: false, message: `${field} 为必填项` });
    }
    if (trimmed.length < min) {
      return res.status(400).json({ ok: false, message: `${field} 长度不能少于 ${min} 个字符` });
    }
    if (trimmed.length > max) {
      return res.status(400).json({ ok: false, message: `${field} 长度不能超过 ${max} 个字符` });
    }

    // 写回清洗后的值，避免空白和异常类型
    if (req.body) {
      req.body[field] = trimmed;
    }
    next();
  };
}