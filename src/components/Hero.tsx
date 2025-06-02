
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lightbulb, Shield } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full p-3">
              <Lightbulb className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Turn Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Startup Ideas</span> Into Reality
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            A secure marketplace where idea creators can share their vision and find passionate executors. 
            Protect your ideas while building the next big thing together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3">
              <Link to="/submit-idea">Submit Your Idea <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 border-slate-300">
              <Link to="/explore">Explore Ideas</Link>
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2 text-green-500" />
              Secure & Protected
            </div>
            <div className="flex items-center">
              <Lightbulb className="h-4 w-4 mr-2 text-blue-500" />
              Fair Equity Terms
            </div>
            <div className="flex items-center">
              <ArrowRight className="h-4 w-4 mr-2 text-purple-500" />
              Easy Collaboration
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
