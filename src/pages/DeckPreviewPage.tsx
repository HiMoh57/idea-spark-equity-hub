import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowDownTrayIcon, SunIcon, MoonIcon, SparklesIcon, ExclamationTriangleIcon, LightBulbIcon, UserGroupIcon, BanknotesIcon, GlobeAltIcon, ChartBarIcon, TrendingUpIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import html2pdf from 'html2pdf.js';

const THEMES = {
  light: {
    bg: 'bg-white',
    accent: 'text-indigo-600',
    text: 'text-slate-900',
    slideBg: ['bg-slate-50', 'bg-indigo-100'],
  },
  dark: {
    bg: 'bg-slate-900',
    accent: 'text-white',
    text: 'text-white',
    slideBg: ['bg-slate-800', 'bg-slate-700'],
  },
  indie: {
    bg: 'bg-emerald-50',
    accent: 'text-orange-500',
    text: 'text-emerald-900',
    slideBg: ['bg-emerald-100', 'bg-orange-100'],
  },
};

const SLIDE_ICONS: Record<string, React.ReactNode> = {
  problem: <ExclamationTriangleIcon className="w-10 h-10 text-red-400 mb-4" />,
  solution: <LightBulbIcon className="w-10 h-10 text-green-400 mb-4" />,
  team: <UserGroupIcon className="w-10 h-10 text-blue-400 mb-4" />,
  business_model: <BanknotesIcon className="w-10 h-10 text-indigo-400 mb-4" />,
  target_market: <GlobeAltIcon className="w-10 h-10 text-yellow-400 mb-4" />,
  competitor_summary: <ChartBarIcon className="w-10 h-10 text-pink-400 mb-4" />,
  traction: <TrendingUpIcon className="w-10 h-10 text-purple-400 mb-4" />,
  ask_and_use_of_funds: <CurrencyDollarIcon className="w-10 h-10 text-orange-400 mb-4" />,
  title: <SparklesIcon className="w-12 h-12 text-indigo-500 mb-4" />,
};

const DeckPreviewPage = () => {
  const { deckId } = useParams();
  const [deck, setDeck] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark' | 'indie'>('light');

  useEffect(() => {
    const fetchDeck = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('pitch_decks')
        .select('*')
        .eq('id', deckId)
        .single();
      setDeck(data);
      setLoading(false);
    };
    if (deckId) fetchDeck();
  }, [deckId]);

  const handleExportPDF = () => {
    const element = document.getElementById('deck-slides');
    if (!element) return;
    html2pdf()
      .set({
        margin: 0,
        filename: `PitchDeck_${deck?.title || 'Startup'}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] },
      })
      .from(element)
      .save();
  };

  const themeObj = THEMES[theme];

  return (
    <div className={`min-h-screen w-full ${themeObj.bg} transition-colors duration-300 relative`}>
      {/* Theme Switcher */}
      <div className="fixed top-6 right-6 z-50 flex gap-2">
        <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')}><SunIcon className="w-5 h-5 mr-1" />Light</Button>
        <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')}><MoonIcon className="w-5 h-5 mr-1" />Dark</Button>
        <Button variant={theme === 'indie' ? 'default' : 'outline'} onClick={() => setTheme('indie')}><SparklesIcon className="w-5 h-5 mr-1" />Indie</Button>
      </div>
      {/* Export PDF Button */}
      <Button
        className="fixed bottom-8 right-8 z-50 shadow-lg text-lg px-6 py-3 rounded-full"
        onClick={handleExportPDF}
        variant="default"
      >
        <ArrowDownTrayIcon className="w-6 h-6 mr-2" /> Export PDF
      </Button>
      <div id="deck-slides" className="w-full flex flex-col items-center">
        {loading ? (
          <div className="h-screen flex items-center justify-center text-2xl font-bold">Loading...</div>
        ) : (
          deck?.deck_content?.map((slide: any, idx: number) => (
            <section
              key={idx}
              className={`w-full min-h-screen flex flex-col justify-center items-center px-4 py-16 ${themeObj.slideBg[idx % themeObj.slideBg.length]} transition-colors duration-300`}
              style={{ pageBreakAfter: 'always', transition: 'background 0.5s' }}
            >
              <div className="max-w-2xl w-full bg-white/80 rounded-3xl shadow-xl p-12 flex flex-col items-center hover:scale-105 transition-transform duration-300">
                {SLIDE_ICONS[slide.type] || <SparklesIcon className="w-10 h-10 text-indigo-400 mb-4" />}
                <h2 className={`text-4xl font-bold mb-6 text-center ${themeObj.accent}`}>{slide.title}</h2>
                {slide.subtitle && <p className="text-xl mb-4 text-slate-500 text-center">{slide.subtitle}</p>}
                <p className={`text-lg leading-loose text-center ${themeObj.text}`}>{slide.content}</p>
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
};

export default DeckPreviewPage; 