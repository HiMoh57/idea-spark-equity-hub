
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Heart, Lightbulb, Star, Award } from 'lucide-react';

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Mohit Rai",
      role: "Co-Founder & CEO",
      description: "Visionary entrepreneur working with Ishaan for almost 4 years as school-friends and co-founders on 35+ startup ideas, failing, leaning, emegrging together.",
      icon: <Star className="h-6 w-6 text-blue-600" />
    },
    {
      name: "Ishaan Kesarwani",
      role: "Co-Founder & COO", 
      description: "Hey! Working with Mohit for almost 4 years as school-friends and co-founders on 35+ startup ideas, failing, leaning, emegrging together. Now handling the operations of IdeoPark.",
      icon: <Lightbulb className="h-6 w-6 text-purple-600" />
    },
  ];

  const values = [
    {
      icon: <Target className="h-8 w-8 text-blue-600" />,
      title: "Empower Creativity",
      description: "We believe every individual has the power to imagine something that could change the world — and they should be rewarded for it."
    },
    {
      icon: <Heart className="h-8 w-8 text-red-600" />,
      title: "Ownership Matters",
      description: "Great ideas deserve credit. We ensure that ideators are not just acknowledged, but earn real ownership in the companies they inspire."
    },
    {
      icon: <Award className="h-8 w-8 text-yellow-600" />,
      title: "Build Together, Grow Together",
      description: "We're fostering a global community where thinkers, builders, and investors can collaborate to bring powerful ideas to life — with shared success for everyone."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            About IdeoPark
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            We're on a mission to bridge the gap between brilliant ideas and skilled execution, 
            creating a thriving ecosystem where innovation meets opportunity.
          </p>
        </div>

        {/* Our Story Section */}
        <div className="mb-20">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">Our Story</h2>
              <div className="prose prose-lg max-w-4xl mx-auto text-slate-700">
                <p className="text-lg leading-relaxed mb-6">
                  IdeoPark was born from a simple truth:
                  Thousands of brilliant startup ideas fade away — not due to a lack of potential, but because they never find the right hands to bring them to life. At the same time, skilled entrepreneurs and builders are constantly on the lookout for their next big opportunity.
                  IdeoPark bridges that gap — turning untapped ideas into real ventures.
                </p>
                <p className="text-lg leading-relaxed mb-6">
                  Founded in June 2025, IdeoPark set out to build the world’s first secure marketplace for startup ideas.
                  Our mission is simple: give idea creators full control and rightful ownership while offering a trusted space for collaboration. With IdeoPark, innovators can safely share their visions and connect with the right people to turn them into reality.
                </p>
                <p className="text-lg leading-relaxed">
                  Today, IdeoPark is the bridge between visionaries and builders — turning bold ideas into real ventures, and fostering partnerships where everyone wins.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Our Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      {value.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold text-slate-800">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-slate-600">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold text-slate-800">
                    {member.name}
                  </CardTitle>
                  <div className="flex items-center justify-center space-x-2">
                    {member.icon}
                    <p className="text-sm font-medium text-slate-500">{member.role}</p>
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-slate-600">
                    {member.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-2">30+</div>
                <div className="text-blue-100">Ideas Listed</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-2">50+</div>
                <div className="text-purple-100">Active Users</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-2">10+</div>
                <div className="text-green-100">Successful Matches</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-2">5+</div>
                <div className="text-orange-100">Launched Startups</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white border-0 shadow-2xl">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-6">
                Ready to Join Our Community?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                Whether you're an idea creator or an executor, IdeoPark is the perfect place 
                to connect, collaborate, and create the next big thing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/auth"
                  className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-300"
                >
                  Get Started Today
                </Link>
                <Link 
                  to="/how-it-works"
                  className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
