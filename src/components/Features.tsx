
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Users, TrendingUp, FileText, CreditCard, Award } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure Idea Protection',
      description: 'Your full idea is only visible to verified users who pay and agree to your terms.',
    },
    {
      icon: Users,
      title: 'Find Perfect Executors',
      description: 'Connect with skilled entrepreneurs who can turn your vision into a successful startup.',
    },
    {
      icon: TrendingUp,
      title: 'Equity-Based Partnership',
      description: 'Retain 3-5% equity and potential board seat while someone else builds your idea.',
    },
    {
      icon: FileText,
      title: 'Legal Contract Generation',
      description: 'Automatically generate partnership agreements to protect both parties.',
    },
    {
      icon: CreditCard,
      title: 'Monetize Your Ideas',
      description: 'Earn from access fees and potential equity returns from successful executions.',
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'All users are verified and ideas are curated to maintain platform quality.',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Why Choose IdeaSpark?
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            We've built the perfect platform to protect idea creators while enabling collaboration
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-3 w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
