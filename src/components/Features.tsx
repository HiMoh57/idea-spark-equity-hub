
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Users, TrendingUp, FileText, CreditCard, Award, ArrowRight } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure Idea Protection',
      description: 'Your full idea is only visible to verified users who pay and agree to your terms.',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
    },
    {
      icon: Users,
      title: 'Find Perfect Executors',
      description: 'Connect with skilled entrepreneurs who can turn your vision into a successful startup.',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
    },
    {
      icon: TrendingUp,
      title: 'Equity-Based Partnership',
      description: 'Retain 3-5% equity and potential board seat while someone else builds your idea.',
      color: 'from-purple-500 to-violet-600',
      bgColor: 'from-purple-50 to-violet-50',
    },
    {
      icon: FileText,
      title: 'Legal Contract Generation',
      description: 'Automatically generate partnership agreements to protect both parties.',
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-50 to-red-50',
    },
    {
      icon: CreditCard,
      title: 'Monetize Your Ideas',
      description: 'Earn from access fees and potential equity returns from successful executions.',
      color: 'from-indigo-500 to-blue-600',
      bgColor: 'from-indigo-50 to-blue-50',
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'All users are verified and ideas are curated to maintain platform quality.',
      color: 'from-yellow-500 to-amber-600',
      bgColor: 'from-yellow-50 to-amber-50',
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white"></div>
      
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 mb-6">
            <span className="text-sm font-medium text-blue-700">Platform Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">IdeaSpark?</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            We've built the perfect platform to protect idea creators while enabling seamless collaboration with verified executors
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm hover:scale-105 cursor-pointer overflow-hidden">
              <CardContent className="p-8 relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="relative z-10">
                  <div className={`bg-gradient-to-r ${feature.color} rounded-2xl p-4 w-fit mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-slate-800 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-4 group-hover:text-slate-700 transition-colors">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                    <span className="text-sm">Learn more</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
