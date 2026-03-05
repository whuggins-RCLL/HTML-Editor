/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CodeEditor } from './components/CodeEditor';
import { LivePreview } from './components/LivePreview';
import { updateHtml } from './services/ai';
import { Loader2, Download, Copy, Play, Code2, Eye, Wand2 } from 'lucide-react';

export default function App() {
  const [htmlCode, setHtmlCode] = useState<string>(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
    <style>
        body {
            font-family: system-ui, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f9ff;
            color: #0f172a;
        }
        .card {
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            text-align: center;
            max-width: 400px;
        }
        h1 { margin-bottom: 1rem; color: #3b82f6; }
        p { line-height: 1.5; color: #64748b; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Hello World</h1>
        <p>This is a simple HTML page. Try editing me with AI!</p>
    </div>
</body>
</html>`);
  const [instruction, setInstruction] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('preview'); // Mobile view toggle

  const handleUpdate = async () => {
    if (!instruction.trim()) return;
    
    setLoading(true);
    try {
      const updatedCode = await updateHtml(htmlCode, instruction);
      setHtmlCode(updatedCode);
      setInstruction(''); // Clear instruction after success
    } catch (error) {
      console.error(error);
      alert('Failed to update HTML. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlCode);
    alert('Code copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">AI HTML Editor</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Copy Code"
          >
            <Copy className="w-5 h-5" />
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download HTML</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden h-[calc(100vh-73px)]">
        
        {/* Left Panel: Editor & Controls */}
        <div className={`flex-1 flex flex-col border-r border-gray-200 bg-white lg:flex ${activeTab === 'editor' ? 'flex' : 'hidden lg:flex'}`}>
          
          {/* AI Input Area */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-purple-600" />
              Describe changes
            </label>
            <div className="flex flex-col gap-3">
              <textarea
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="e.g., Change the background to dark mode, add a contact form..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm text-sm min-h-[100px] resize-y"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleUpdate();
                  }
                }}
              />
              <div className="flex justify-end">
                <button
                  onClick={handleUpdate}
                  disabled={loading || !instruction.trim()}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm font-medium text-sm flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Update</span>
                      <Play className="w-3 h-3 fill-current" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Code Editor Area */}
          <div className="flex-1 relative bg-gray-900 overflow-hidden">
            <div className="absolute inset-0 p-4">
              <CodeEditor 
                code={htmlCode} 
                onChange={setHtmlCode} 
                placeholder="Paste your HTML here..." 
              />
            </div>
          </div>
        </div>

        {/* Right Panel: Preview */}
        <div className={`flex-1 flex flex-col bg-gray-100 lg:flex ${activeTab === 'preview' ? 'flex' : 'hidden lg:flex'}`}>
          <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between lg:justify-end">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider lg:hidden">Preview Mode</span>
            <div className="flex items-center gap-2">
               <span className="text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:block mr-2">Live Preview</span>
            </div>
          </div>
          <div className="flex-1 p-4 lg:p-8 overflow-hidden">
            <div className="h-full w-full shadow-lg rounded-xl overflow-hidden bg-white ring-1 ring-black/5">
              <LivePreview code={htmlCode} />
            </div>
          </div>
        </div>

      </main>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden bg-white border-t border-gray-200 flex">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === 'editor' ? 'text-blue-600 bg-blue-50' : 'text-gray-500'
          }`}
        >
          <Code2 className="w-4 h-4" />
          Editor
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === 'preview' ? 'text-blue-600 bg-blue-50' : 'text-gray-500'
          }`}
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
      </div>
    </div>
  );
}

