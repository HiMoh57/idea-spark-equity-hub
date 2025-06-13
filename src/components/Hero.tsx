import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lightbulb, Shield, Star, Users } from 'lucide-react';

const Hero = () => {
  const trustIndicators = [
    {
      icon: Shield,
      title: "Secure & Protected",
      description: "Bank-level security for your ideas",
      color: "text-green-500"
    },
    {
      icon: Users,
      title: "Verified Executors",
      description: "Pre-screened entrepreneurs ready to build",
      color: "text-blue-500"
    },
    {
      icon: Star,
      title: "Fair Equity Terms",
      description: "5-15% equity + Non-Voting Board Seat Guaranteed",
      color: "text-yellow-500"
    }
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-purple-50 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full z-10 relative">
        <div className="text-center">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center px-6 py-2 rounded-full bg-white/70 backdrop-blur-md border border-yellow-300 shadow-lg">
              <Star className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="text-sm font-semibold text-slate-800">Trusted by 500+ idea creators</span>
            </div>
          </div>
          
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-5 shadow-2xl animate-pulse-slow">
                <Lightbulb className="h-20 w-20 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-2 animate-ping-slow">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-6xl md:text-8xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tighter">
            Turn Your{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Startup Ideas
              </span>
              <div className="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-70 blur-sm" />
            </span>
            <br />Into Reality
          </h1>
          
          {/* Description */}
          <p className="text-xl md:text-2xl text-slate-700 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            The world's first <span className="font-bold text-slate-900">secure marketplace</span> where idea creators can share their vision and find passionate executors. 
            <br className="hidden md:block" />
            <span className="text-blue-700 font-semibold">Protect your ideas</span> while building the next big thing together.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-12 py-5 h-auto rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 font-semibold tracking-wide"
            >
              <Link to="/submit-idea">
                Submit Your Idea 
                <ArrowRight className="ml-3 h-7 w-7" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="text-lg px-12 py-5 h-auto rounded-xl border-2 border-slate-300 text-slate-700 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 font-semibold"
            >
              <Link to="/explore">Browse Ideas</Link>
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
            {trustIndicators.map((indicator) => (
              <div
                key={indicator.title}
                className="flex flex-col items-center p-8 bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/60 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <indicator.icon className={`h-10 w-10 ${indicator.color} mb-4`} />
                <h3 className="font-bold text-xl text-slate-900 mb-2">{indicator.title}</h3>
                <p className="text-base text-slate-600 text-center leading-relaxed">{indicator.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background gradients/shapes (optional, for visual flair) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      </div>
    </section>
  );
};

export default Hero;
