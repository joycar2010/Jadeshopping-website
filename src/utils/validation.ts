// 通用文本字段验证工具：支持必填、最小长度、最大长度
export type TextValidationOptions = {
  required?: boolean;
  min?: number;
  max?: number;
};

export function validateText(value: string | undefined | null, opts: TextValidationOptions = {}): string | null {
  const v = (value ?? '').trim();
  if (opts.required && v.length === 0) return '该字段为必填项';
  if (typeof opts.min === 'number' && v.length > 0 && v.length < opts.min) return `长度至少为${opts.min}个字符`;
  if (typeof opts.max === 'number' && v.length > opts.max) return `长度不能超过${opts.max}个字符`;
  return null;
}

// 便捷常量：通用文本字段上限
export const DEFAULT_TEXT_MAX = 100;