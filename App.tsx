
import React, { useState, useCallback, useRef } from 'react';
import { Camera, Upload, RefreshCw, Download, Sparkles, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { PROFESSIONAL_STYLES } from './constants';
import { AppState, ProfessionalStyle } from './types';
import { generateHeadshot, editHeadshot } from './services/geminiService';

export default function App() {
  const [status, setStatus] = useState<AppState>('IDLE');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<ProfessionalStyle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setStatus('SELECTING_STYLE');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async (style: ProfessionalStyle) => {
    if (!originalImage) return;
    
    setSelectedStyle(style);
    setStatus('GENERATING');
    setIsProcessing(true);
    setError(null);

    try {
      const result = await generateHeadshot(originalImage, style.prompt);
      setGeneratedImage(result);
      setStatus('DONE');
    } catch (err) {
      setError('Failed to generate headshot. Please try again.');
      setStatus('SELECTING_STYLE');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!generatedImage || !editPrompt.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const result = await editHeadshot(generatedImage, editPrompt);
      setGeneratedImage(result);
      setEditPrompt('');
    } catch (err) {
      setError('Failed to edit image. Try a different prompt.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetApp = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setSelectedStyle(null);
    setStatus('IDLE');
    setError(null);
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `proshot-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={resetApp}>
          <div className="bg-blue-600 p-2 rounded-lg">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">ProShot AI</span>
        </div>
        
        {status !== 'IDLE' && (
          <button 
            onClick={resetApp}
            className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-sm font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Start Over
          </button>
        )}
      </nav>

      <main className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-10">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-4 duration-300">
            {error}
          </div>
        )}

        {status === 'IDLE' && (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in-95 duration-500">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Your Professional Headshot,<br /> Powered by AI.
            </h1>
            <p className="text-slate-600 text-lg mb-10 max-w-xl">
              Turn any casual photo into a stunning executive portrait in seconds. Choose from a range of high-end styles.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="group relative bg-white border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-3xl p-8 transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-blue-50 p-4 rounded-full group-hover:bg-blue-100 transition-colors">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <span className="font-semibold text-slate-800">Upload Selfie</span>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </button>
              
              <div className="relative group bg-slate-200 rounded-3xl p-8 opacity-60 cursor-not-allowed">
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-slate-300 p-4 rounded-full">
                    <Camera className="w-8 h-8 text-slate-500" />
                  </div>
                  <span className="font-semibold text-slate-800">Use Camera</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-slate-800 text-white text-[10px] px-2 py-1 rounded-full font-bold">COMING SOON</span>
                </div>
              </div>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
              {[1, 2, 3, 4].map((i) => (
                <img key={i} src={`https://picsum.photos/seed/pro${i}/200/250`} className="rounded-2xl shadow-sm" alt="Demo" />
              ))}
            </div>
          </div>
        )}

        {status === 'SELECTING_STYLE' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
            <button 
              onClick={() => setStatus('IDLE')}
              className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Select Your Style</h2>
            <p className="text-slate-500 mb-8">Choose the environment and mood for your professional portrait.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PROFESSIONAL_STYLES.map((style) => (
                <div 
                  key={style.id}
                  onClick={() => handleGenerate(style)}
                  className="group relative bg-white rounded-3xl overflow-hidden cursor-pointer border border-slate-200 hover:border-blue-500 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img src={style.previewUrl} alt={style.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{style.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{style.description}</p>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-blue-600 p-2 rounded-full shadow-lg">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(status === 'GENERATING' || isProcessing) && !generatedImage && (
          <div className="flex flex-col items-center justify-center py-24 animate-in fade-in duration-300">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <Sparkles className="w-8 h-8 text-blue-600 absolute inset-0 m-auto animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-8">Developing Your Shot</h2>
            <p className="text-slate-500 mt-2 text-center max-w-sm">
              Our AI is carefully adjusting the lighting, outfit, and background while preserving your unique features.
            </p>
          </div>
        )}

        {status === 'DONE' && generatedImage && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Left Side: Image Preview */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-white border border-slate-200">
                <img src={generatedImage} alt="Generated Headshot" className="w-full h-auto" />
                {isProcessing && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="flex flex-col items-center gap-4">
                      <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
                      <span className="font-bold text-slate-800">Updating...</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={downloadImage}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-5 h-5" /> Download Full Res
                </button>
                <button 
                  onClick={() => setStatus('SELECTING_STYLE')}
                  className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all"
                >
                  <RefreshCw className="w-5 h-5" /> Change Style
                </button>
              </div>
            </div>

            {/* Right Side: Tools */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Sparkles className="text-blue-600 w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">AI Retouching</h3>
                </div>
                
                <p className="text-slate-600 text-sm mb-6">
                  Need a tweak? Just type what you want to change. "Make the background darker", "Add a blue tie", or "Smooth the lighting".
                </p>

                <form onSubmit={handleEdit} className="space-y-4">
                  <div className="relative">
                    <textarea 
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                      placeholder="e.g. Add a subtle vintage filter..."
                      className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                    />
                    <button 
                      type="submit"
                      disabled={isProcessing || !editPrompt.trim()}
                      className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white p-3 rounded-xl transition-colors shadow-lg"
                    >
                      <Sparkles className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {['Add a blue blazer', 'Blur background more', 'Warmer lighting', 'Corporate blue tie'].map((suggestion) => (
                      <button 
                        key={suggestion}
                        type="button"
                        onClick={() => setEditPrompt(suggestion)}
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 px-3 rounded-full transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </form>
              </div>

              <div className="bg-blue-600 p-8 rounded-[2rem] text-white overflow-hidden relative">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">Tips for success</h3>
                  <ul className="text-blue-100 text-sm space-y-3">
                    <li className="flex gap-2">
                      <span className="font-bold">1.</span>
                      Avoid busy backgrounds in your original selfie.
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">2.</span>
                      Make sure your face is well-lit and facing forward.
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">3.</span>
                      One person only for best likeness preservation.
                    </li>
                  </ul>
                </div>
                <div className="absolute -bottom-6 -right-6 opacity-20">
                  <ImageIcon className="w-32 h-32 rotate-12" />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 px-6 text-center text-slate-400 text-xs mt-auto">
        <p>© 2024 ProShot AI. Powered by Gemini 2.5 Flash Image.</p>
      </footer>
    </div>
  );
}
