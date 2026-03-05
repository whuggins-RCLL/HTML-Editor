import React from 'react';

interface LivePreviewProps {
  code: string;
}

export function LivePreview({ code }: LivePreviewProps) {
  return (
    <div className="h-full w-full bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <iframe
        srcDoc={code}
        title="Preview"
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-modals"
      />
    </div>
  );
}
