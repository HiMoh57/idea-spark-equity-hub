
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Users, DollarSign, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
   {
  icon: <Lightbulb className="h-8 w-8 text-blue-600" />,
  title: "List Your Idea",
  description: "Got a startup spark? Submit your one-liner teaser — keep it short, sharp, and secret-safe.",
  details: "Don't worry about revealing everything. You stay in control and approve who gets full access."
},
{
  icon: <Users className="h-8 w-8 text-purple-600" />,
  title: "Get Discovered",
  description: "Your idea teaser is shown to builders, founders, and investors who are actively looking.",
  details: "If they're interested, they request access. You choose whether to approve or decline."
},
{
  icon: <DollarSign className="h-8 w-8 text-green-600" />,
  title: "Earn From Your Ideas",
  description: "Charge a small fee to unlock your idea — and get 5–15% equity if someone brings it to life. You also earn a 70% payout of the total unlock fee.",
  details: "Build passive ownership in startups without needing to execute every idea yourself."
},
{
  icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
  title: "Grow Your Reputation",
  description: "Track which ideas are trending and see your profile grow as a visionary innovator.",
  details: "Gain credibility, build a portfolio, and turn creativity into real-world impact."
}
  ];

  const features = [
    "Secure idea submission process",
    "Expert community feedback",
    "Investor matching system",
    "Comprehensive business resources",
    "Mentorship opportunities",
    "Legal protection guidance"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            How IdeoPark Works
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Transform your innovative ideas into successful businesses with our comprehensive platform designed for entrepreneurs and investors.
          </p>
        </div>

        {/* Steps Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">
            Your Journey to Success
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="relative bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="text-center pb-4">
                  <div className="mb-4 flex justify-center">
                    <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold text-slate-800">
                    {step.title}
                  </CardTitle>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-slate-600 mb-4">
                    {step.description}
                  </CardDescription>
                  <p className="text-sm text-slate-500">
                    {step.details}
                  </p>
                </CardContent>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-slate-400" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-slate-800">
                Why Choose IdeoPark?
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                We provide a comprehensive ecosystem that supports entrepreneurs at every stage of their journey, from initial concept to successful business launch.
              </p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="text-slate-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold mb-2">30+</div>
                  <div className="text-blue-100">Ideas Submitted</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold mb-2">10+</div>
                  <div className="text-purple-100">Active Investors</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold mb-2">0+</div>
                  <div className="text-green-100">Funding Raised</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold mb-2">05+</div>
                  <div className="text-orange-100">Success Stories</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white border-0 shadow-2xl">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-6">
                Ready to Transform Your Idea?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                Join entrepreneurs who have successfully launched their businesses through IdeoPark.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-300">
                  Submit Your Idea
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
                  Browse Ideas
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HowItWorks;
