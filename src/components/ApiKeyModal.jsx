import { useState } from 'react';
import { Key, X, Eye, EyeOff, Check, AlertTriangle } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, onSave, savedKey }) {
  const [keyInput, setKeyInput] = useState(savedKey || '');
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSave(keyInput.trim());
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    setKeyInput('');
    onSave('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md saas-card p-6 text-[#f8fafc] font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(124,58,237,0.15)] pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-[#a855f7] animate-pulse" />
            <h3 className="text-base font-extrabold text-white tracking-wide">GEMINI CONFIGURATION</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-[#161625] text-[#94a3b8] hover:text-white rounded-lg transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Alert box */}
        <div className="bg-[#7c3aed]/10 border border-[#7c3aed]/30 rounded-xl p-3.5 mb-4 text-xs text-[#94a3b8] flex gap-2.5 font-medium">
          <AlertTriangle className="w-4 h-4 text-[#a855f7] shrink-0 mt-0.5" />
          <p>
            Your API Key is stored <strong className="text-white">locally</strong> in your browser's local storage. It is transmitted directly to Google Gemini APIs and is never sent to any external server.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider text-[#94a3b8] font-bold">Gemini API Key</label>
            <div className="relative flex items-center">
              <input
                type={showKey ? "text" : "password"}
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-[#161625] border border-[rgba(124,58,237,0.25)] focus:border-[#7c3aed] focus:outline-none focus:ring-1 focus:ring-[#7c3aed] rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-zinc-700 transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 text-[#94a3b8] hover:text-white cursor-pointer"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-[#94a3b8]/70 leading-normal">
              Obtain a free API Key from Google AI Studio.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClear}
              disabled={!keyInput}
              className="flex-1 btn-secondary py-2.5 text-xs disabled:opacity-30 disabled:pointer-events-none cursor-pointer uppercase tracking-wider font-semibold"
            >
              Clear Key
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary py-2.5 text-xs flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider font-semibold"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved
                </>
              ) : (
                'Save Config'
              )}
            </button>
          </div>
        </form>

        {/* Note info */}
        <div className="mt-4 pt-4 border-t border-[rgba(124,58,237,0.15)] text-[10px] text-[#94a3b8]/60 text-center font-medium">
          Leaving this empty will default to locally extracted study-sheet items.
        </div>
      </div>
    </div>
  );
}
