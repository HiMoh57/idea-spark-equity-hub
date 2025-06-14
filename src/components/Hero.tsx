
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lightbulb, Shield, Star, Users, Sparkles, TrendingUp } from 'lucide-react';

const Hero = () => {
  const trustIndicators = [
    {
      icon: Shield,
      title: "Secure & Protected",
      description: "Bank-level security for your ideas",
      color: "text-emerald-500",
      bgColor: "from-emerald-500/20 to-green-500/20"
    },
    {
      icon: Users,
      title: "Verified Executors",
      description: "Pre-screened entrepreneurs ready to build",
      color: "text-blue-500",
      bgColor: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: Star,
      title: "Fair Equity Terms",
      description: "5-15% equity + Board Seat Guaranteed",
      color: "text-yellow-500",
      bgColor: "from-yellow-500/20 to-orange-500/20"
    }
  ];

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob opacity-70" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 opacity-70" />
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-gradient-to-r from-indigo-400/30 to-blue-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000 opacity-70" />
      </div>

      <div className="max-w-7xl mx-auto w-full z-10 relative">
        <div className="text-center">
          {/* Enhanced Badge */}
          <div className="flex justify-center mb-12">
            <div className="group inline-flex items-center px-8 py-4 rounded-full bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mr-3 group-hover:rotate-12 transition-transform duration-300">
                <Star className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Trusted by 500+ Silicon Valley Innovators
              </span>
              <div className="ml-3 px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full">
                <span className="text-xs font-semibold text-green-700">LIVE</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Logo */}
          <div className="flex justify-center mb-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-75 group-hover:opacity-100 animate-pulse" />
              <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full p-8 shadow-2xl transform group-hover:scale-110 transition-all duration-500">
                <Lightbulb className="h-24 w-24 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-3 animate-bounce shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-2 -left-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full p-2 animate-ping">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          
          {/* Enhanced Title */}
          <div className="mb-12">
            <div className="inline-block mb-6">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-slate-900 leading-tight tracking-tighter">
                Turn Your{' '}
              </h1>
            </div>
            <div className="relative inline-block mb-6">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-tight tracking-tighter">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-x">
                  Startup Ideas
                </span>
              </h1>
              <div className="absolute -bottom-4 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-full opacity-80 blur-sm animate-pulse" />
            </div>
            <div className="inline-block">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-slate-900 leading-tight tracking-tighter">
                Into Reality
              </h1>
            </div>
          </div>
          
          {/* Enhanced Description */}
          <div className="mb-16">
            <p className="text-2xl md:text-3xl text-slate-700 mb-6 max-w-5xl mx-auto leading-relaxed font-light">
              The world's first <span className="font-bold text-slate-900 bg-yellow-200/50 px-2 py-1 rounded-lg">secure marketplace</span> where idea creators can share their vision and find passionate executors.
            </p>
            <p className="text-xl md:text-2xl text-blue-700 font-semibold max-w-4xl mx-auto">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Protect your ideas</span> while building the next unicorn startup together.
            </p>
          </div>
          
          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20">
            <Button 
              asChild 
              size="lg" 
              className="group bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-xl px-16 py-8 h-auto rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 transform hover:scale-110 font-bold tracking-wide border-0"
            >
              <Link to="/submit-idea">
                <span className="flex items-center">
                  Submit Your Idea 
                  <ArrowRight className="ml-4 h-7 w-7 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="text-xl px-16 py-8 h-auto rounded-2xl border-3 border-slate-300 bg-white/80 backdrop-blur-md text-slate-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-500 transform hover:scale-105 font-bold shadow-xl hover:shadow-2xl"
            >
              <Link to="/explore">Browse Ideas</Link>
            </Button>
          </div>
          
          {/* Enhanced Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {trustIndicators.map((indicator, index) => (
              <div
                key={indicator.title}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-white/30 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-500" />
                <div className="relative flex flex-col items-center p-10 bg-white/90 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-4 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" style={{background: `linear-gradient(135deg, ${indicator.bgColor})`}} />
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-125 transition-all duration-500 bg-gradient-to-r ${indicator.bgColor}`}>
                      <indicator.icon className={`h-8 w-8 ${indicator.color}`} />
                    </div>
                    <h3 className="font-bold text-2xl text-slate-900 mb-3 group-hover:text-slate-800 transition-colors">{indicator.title}</h3>
                    <p className="text-base text-slate-600 text-center leading-relaxed group-hover:text-slate-700 transition-colors">{indicator.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
