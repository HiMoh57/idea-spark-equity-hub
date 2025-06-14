
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Stats from '@/components/Stats';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sparkles, TrendingUp, Shield } from 'lucide-react';

const Index = () => {
  const benefits = [
    "Secure idea sharing with bank-level encryption",
    "Pre-screened entrepreneurs ready to execute",
    "Fair equity terms (5-15%) with board seat",
    "Legal protection for your intellectual property",
    "Dedicated support throughout the process",
    "Transparent communication platform"
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Founder, HealthTech Startup",
      content: "IdeoPark connected me with the perfect technical co-founder. Our app now has 50K+ users!",
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez",
      role: "Serial Entrepreneur",
      content: "I've executed 3 ideas from this platform. The quality of ideas and legal protection is unmatched.",
      avatar: "MR"
    },
    {
      name: "Dr. Emily Watson",
      role: "AI Researcher",
      content: "Finally, a platform where I can monetize my research ideas without losing control.",
      avatar: "EW"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Premium background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-purple-100 opacity-70" />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
      </div>
      
      <div className="relative z-10">
        <Navbar />
        
        {/* Enhanced Hero Section */}
        <Hero />

        {/* Trust Indicators Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center opacity-60">
              {["TechCrunch", "Forbes", "Wired", "Entrepreneur"].map((logo) => (
                <div key={logo} className="text-center">
                  <div className="text-2xl font-bold text-slate-600 tracking-tight">{logo}</div>
                  <div className="text-xs text-slate-500 mt-1">Featured in</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Stats Section */}
        <Stats />

        {/* Enhanced Features Section */}
        <Features />

        {/* Testimonials Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 backdrop-blur-3xl" />
          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 mb-8">
                <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-semibold text-blue-700">Success Stories</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8">
                Trusted by <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Innovators</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Join thousands of entrepreneurs who've turned their ideas into successful businesses
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="group relative p-8 bg-white/70 backdrop-blur-md rounded-3xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="flex items-center mb-6">
                      <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {testimonial.avatar}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                        <p className="text-sm text-slate-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-slate-700 leading-relaxed italic">"{testimonial.content}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-green-100 to-blue-100 border border-green-200/50 mb-8">
                <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-semibold text-green-700">Simple Process</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8">How It Works</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Turn your idea into reality in three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Submit Your Idea",
                  description: "Share your startup idea securely with our platform. Your intellectual property is protected with bank-level security.",
                  step: "01",
                  icon: Shield,
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  title: "Find Executors",
                  description: "Connect with pre-screened entrepreneurs who are ready to bring your vision to life with proven track records.",
                  step: "02",
                  icon: TrendingUp,
                  color: "from-purple-500 to-pink-500"
                },
                {
                  title: "Build Together",
                  description: "Collaborate with your chosen team and watch your idea transform into a successful business with shared equity.",
                  step: "03",
                  icon: Sparkles,
                  color: "from-green-500 to-blue-500"
                }
              ].map((item) => (
                <div key={item.step} className="relative group">
                  <div className="relative p-10 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105 border border-white/50">
                    <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </div>
                    <div className={`bg-gradient-to-r ${item.color} rounded-2xl p-4 w-fit mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8">
                Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">IdeoPark</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                We provide everything you need to turn your idea into a successful business
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={benefit} className="flex items-start space-x-6 p-6 bg-white/70 backdrop-blur-md rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p className="text-lg text-slate-700 font-medium leading-relaxed">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600" />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full filter blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-300/20 rounded-full filter blur-3xl" />
          </div>
          
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-8">
              <Sparkles className="h-5 w-5 text-white mr-2" />
              <span className="text-sm font-semibold text-white">Ready to Start?</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Turn Your Idea Into<br />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Reality Today</span>
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of successful entrepreneurs who've built their dreams with IdeoPark
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-12 py-6 h-auto rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                <Link to="/submit-idea">
                  Submit Your Idea
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 text-lg px-12 py-6 h-auto rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <Link to="/explore">Browse Ideas</Link>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Index;
