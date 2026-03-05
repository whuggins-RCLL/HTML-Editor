import React from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  placeholder?: string;
}

export function CodeEditor({ code, onChange, placeholder }: CodeEditorProps) {
  return (
    <div className="relative h-full w-full font-mono text-sm">
      <textarea
        className="w-full h-full p-4 bg-gray-900 text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg border border-gray-700"
        value={code}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
      />
    </div>
  );
}
