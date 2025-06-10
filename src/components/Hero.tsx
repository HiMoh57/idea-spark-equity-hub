import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lightbulb, Shield, Star, Users, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Silk from './Silk';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const trustIndicators = [
    {
      icon: Shield,
      title: "Secure & Protected",
      description: "Bank-level security for your ideas",
      color: "text-green-500",
      delay: 0.2
    },
    {
      icon: Users,
      title: "Verified Executors",
      description: "Pre-screened entrepreneurs ready to build",
      color: "text-blue-500",
      delay: 0.4
    },
    {
      icon: Star,
      title: "Fair Equity Terms",
      description: "5-15% equity + Non-Voting Board Seat Guaranteed",
      color: "text-yellow-500",
      delay: 0.6
    }
  ];

  return (
    <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center">
      {/* Silk background */}
      <div className="absolute inset-0 -z-10">
        <Silk
          speed={3}
          scale={1.5}
          color="#6366f1"
          noiseIntensity={1}
          rotation={0}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full">
        <AnimatePresence>
          {isVisible && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* Enhanced Badge */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center mb-8"
              >
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
                  <Star className="h-4 w-4 text-yellow-500 mr-2" />
                  <span className="text-sm font-medium text-slate-700">Trusted by 500+ idea creators</span>
                </div>
              </motion.div>
              
              {/* Enhanced Logo */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex justify-center mb-8"
              >
                <div className="relative group">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full p-4 shadow-lg"
                  >
                    <Lightbulb className="h-16 w-16 text-blue-600" />
                  </motion.div>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                    className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1"
                  >
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Enhanced Title */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight"
              >
                Turn Your{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Startup Ideas
                  </span>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60"
                  />
                </span>
                <br />Into Reality
              </motion.h1>
              
              {/* Enhanced Description */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed"
              >
                The world's first <span className="font-semibold text-slate-800">secure marketplace</span> where idea creators can share their vision and find passionate executors. 
                <br className="hidden md:block" />
                <span className="text-blue-600 font-medium">Protect your ideas</span> while building the next big thing together.
              </motion.p>
              
              {/* Enhanced CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              >
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-lg px-10 py-4 h-auto shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <Link to="/submit-idea">
                    Submit Your Idea 
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-10 py-4 h-auto border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all duration-300"
                >
                  <Link to="/explore">Browse Ideas</Link>
                </Button>
              </motion.div>
              
              {/* Enhanced Trust Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
                {trustIndicators.map((indicator, index) => (
                  <motion.div
                    key={indicator.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: indicator.delay }}
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <indicator.icon className={`h-8 w-8 ${indicator.color} mb-3`} />
                    <h3 className="font-semibold text-slate-900 mb-1">{indicator.title}</h3>
                    <p className="text-sm text-slate-600 text-center">{indicator.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <Button
          asChild
          size="lg"
          className="rounded-full w-14 h-14 p-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
        >
          <Link to="/submit-idea">
            <Plus className="h-6 w-6" />
          </Link>
        </Button>
      </motion.div>
    </section>
  );
};

export default Hero;
