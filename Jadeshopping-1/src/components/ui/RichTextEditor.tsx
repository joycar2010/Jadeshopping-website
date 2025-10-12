import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
  error?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = '请输入内容...',
  height = 200,
  disabled = false,
  error
}) => {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet', 'indent',
    'align',
    'link', 'image'
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={disabled}
        style={{
          height: `${height}px`,
          marginBottom: '42px' // 为工具栏留出空间
        }}
        className={`
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      <style jsx global>{`
        .rich-text-editor .ql-editor {
          min-height: ${height - 42}px;
          font-size: 14px;
          line-height: 1.6;
        }
        
        .rich-text-editor .ql-toolbar {
          border-top: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-radius: 6px 6px 0 0;
        }
        
        .rich-text-editor .ql-container {
          border-bottom: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-radius: 0 0 6px 6px;
        }
        
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        
        .rich-text-editor .ql-editor:focus {
          outline: none;
        }
        
        .rich-text-editor .ql-toolbar.ql-snow {
          background: #f9fafb;
        }
        
        .rich-text-editor .ql-toolbar.ql-snow .ql-picker-label:hover,
        .rich-text-editor .ql-toolbar.ql-snow .ql-picker-label.ql-active {
          color: #3b82f6;
        }
        
        .rich-text-editor .ql-toolbar.ql-snow button:hover,
        .rich-text-editor .ql-toolbar.ql-snow button.ql-active {
          color: #3b82f6;
        }
        
        .rich-text-editor .ql-toolbar.ql-snow button:hover .ql-stroke,
        .rich-text-editor .ql-toolbar.ql-snow button.ql-active .ql-stroke {
          stroke: #3b82f6;
        }
        
        .rich-text-editor .ql-toolbar.ql-snow button:hover .ql-fill,
        .rich-text-editor .ql-toolbar.ql-snow button.ql-active .ql-fill {
          fill: #3b82f6;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;