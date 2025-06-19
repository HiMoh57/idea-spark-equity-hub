import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PitchDeck {
  id: string;
  title: string;
  problem_statement: string;
  solution: string;
  business_model: string;
  target_market: string;
  competitor_summary: string;
  traction: string;
  team: string;
  ask_and_use_of_funds: string;
  deck_content: any[];
  created_at: string;
}

interface PitchDeckViewerProps {
  pitchDeck: PitchDeck;
}

const PitchDeckViewer: React.FC<PitchDeckViewerProps> = ({ pitchDeck }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slides = pitchDeck.deck_content || [];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderSlide = (slide: any, index: number) => {
    const isActive = index === currentSlide;
    
    if (!isActive) return null;

    return (
      <div 
        key={index}
        className={`w-full h-full rounded-lg overflow-hidden transition-all duration-300 ${
          isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'aspect-[16/9]'
        }`}
      >
        <div className={`w-full h-full p-8 ${slide.background || 'bg-white'}`}>
          {slide.type === 'title' ? (
            <div className="flex flex-col justify-center items-center h-full text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl text-white/90">
                {slide.subtitle}
              </p>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                {slide.title}
              </h2>
              <div className="flex-1 flex items-center">
                <p className="text-lg md:text-xl text-slate-700 leading-relaxed">
                  {slide.content}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {pitchDeck?.id && (
        <div className="flex justify-end">
          <Link to={`/fundeer/deck-preview/${pitchDeck.id}`} className="inline-block">
            <Button variant="default" className="mb-4">View Visual Deck Preview</Button>
          </Link>
        </div>
      )}
      {/* Slide Navigation */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-slate-200">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm font-medium text-slate-600">
            Slide {currentSlide + 1} of {slides.length}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Slide Viewer */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {slides.map((slide, index) => renderSlide(slide, index))}
        </CardContent>
      </Card>

      {/* Slide Thumbnails */}
      <div className="grid grid-cols-9 gap-2">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`aspect-video rounded-lg border-2 transition-all ${
              index === currentSlide
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="w-full h-full flex items-center justify-center text-xs font-medium text-slate-600">
              {index + 1}
            </div>
          </button>
        ))}
      </div>

      {/* Pitch Deck Summary */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Pitch Deck Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-slate-700 mb-2">Problem</h4>
              <p className="text-slate-600 line-clamp-3">
                {pitchDeck.problem_statement}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-slate-700 mb-2">Solution</h4>
              <p className="text-slate-600 line-clamp-3">
                {pitchDeck.solution}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-slate-700 mb-2">Business Model</h4>
              <p className="text-slate-600 line-clamp-3">
                {pitchDeck.business_model}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-slate-700 mb-2">Target Market</h4>
              <p className="text-slate-600 line-clamp-3">
                {pitchDeck.target_market}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PitchDeckViewer; 