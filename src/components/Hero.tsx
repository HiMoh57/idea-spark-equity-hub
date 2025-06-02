
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lightbulb, Shield, Star, Users } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-75"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-150"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 backdrop-blur-sm">
              <Star className="h-4 w-4 text-yellow-500 mr-2" />
              <span className="text-sm font-medium text-slate-700">Trusted by 500+ idea creators</span>
            </div>
          </div>
          
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full p-4 shadow-lg">
                <Lightbulb className="h-16 w-16 text-blue-600" />
              </div>
              <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight">
            Turn Your{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Startup Ideas
              </span>
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60"></div>
            </span>
            <br />Into Reality
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            The world's first <span className="font-semibold text-slate-800">secure marketplace</span> where idea creators can share their vision and find passionate executors. 
            <br className="hidden md:block" />
            <span className="text-blue-600 font-medium">Protect your ideas</span> while building the next big thing together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-lg px-10 py-4 h-auto shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <Link to="/submit-idea">
                Submit Your Idea 
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-10 py-4 h-auto border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all duration-300">
              <Link to="/explore">Browse Ideas</Link>
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm">
              <Shield className="h-8 w-8 text-green-500 mb-3" />
              <h3 className="font-semibold text-slate-900 mb-1">Secure & Protected</h3>
              <p className="text-sm text-slate-600 text-center">Bank-level security for your ideas</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm">
              <Users className="h-8 w-8 text-blue-500 mb-3" />
              <h3 className="font-semibold text-slate-900 mb-1">Verified Executors</h3>
              <p className="text-sm text-slate-600 text-center">Pre-screened entrepreneurs ready to build</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm">
              <Star className="h-8 w-8 text-yellow-500 mb-3" />
              <h3 className="font-semibold text-slate-900 mb-1">Fair Equity Terms</h3>
              <p className="text-sm text-slate-600 text-center">3-5% equity + board seat guaranteed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
