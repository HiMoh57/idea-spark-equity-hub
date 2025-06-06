
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, Zap, Crown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const plans = [
    {
      name: 'Idea Creator',
      price: 'Free',
      description: 'Perfect for individuals with great startup ideas',
      features: [
        'Submit unlimited ideas',
        'Basic idea protection',
        'View request analytics',
        'Email support',
        'Standard legal templates'
      ],
      icon: Star,
      color: 'from-blue-500 to-cyan-600',
      popular: false
    },
    {
      name: 'Pro Creator',
      price: '₹500',
      period: '/month',
      description: 'Enhanced features for serious entrepreneurs',
      features: [
        'Everything in Free',
        'Priority idea review',
        'Advanced analytics dashboard',
        'Custom legal agreements',
        'Priority support',
        'Featured idea placement'
      ],
      icon: Zap,
      color: 'from-purple-500 to-violet-600',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For organizations and investment firms',
      features: [
        'Everything in Pro',
        'White-label solution',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced security features'
      ],
      icon: Crown,
      color: 'from-orange-500 to-red-600',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <section className="pt-20 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Simple, Transparent <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Pricing</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Choose the plan that fits your needs. Start free and upgrade as you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative border-2 transition-all duration-300 hover:scale-105 ${plan.popular ? 'border-purple-300 shadow-2xl' : 'border-slate-200 shadow-lg'} bg-white/80 backdrop-blur-sm`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className={`bg-gradient-to-r ${plan.color} rounded-2xl p-4 w-fit mx-auto mb-4`}>
                    <plan.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-900">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    {plan.period && <span className="text-slate-600">{plan.period}</span>}
                  </div>
                  <p className="text-slate-600 mt-2">{plan.description}</p>
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    asChild 
                    className={`w-full ${plan.popular 
                      ? 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700' 
                      : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
                    }`}
                  >
                    <Link to="/auth">
                      {plan.price === 'Free' ? 'Get Started Free' : plan.price === 'Custom' ? 'Contact Sales' : 'Start Free Trial'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-slate-600 mb-4">
              For Idea Executors: Pay only ₹150 per idea access via UPI + agree to equity terms
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-sm text-blue-800 font-medium mb-2">💳 Easy UPI Payments</p>
              <p className="text-sm text-blue-700">
                Pay instantly using PhonePe, Google Pay, Paytm, Amazon Pay, or any UPI-enabled app
              </p>
            </div>
            <p className="text-sm text-slate-500 mt-4">
              All plans include 30-day money-back guarantee. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
