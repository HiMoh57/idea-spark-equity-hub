
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, User, Building } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Register = () => {
  const [userType, setUserType] = useState('creator');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    experience: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registration submitted:', { ...formData, userType });
    // Handle registration logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full p-3 w-fit mx-auto mb-4">
              <Lightbulb className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Join IdeaSpark</h1>
            <p className="text-slate-600">Start your journey as an idea creator or executor</p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Create Your Account</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label className="text-base font-medium">I want to:</Label>
                  <RadioGroup value={userType} onValueChange={setUserType} className="mt-2">
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50">
                      <RadioGroupItem value="creator" id="creator" />
                      <User className="h-4 w-4 text-blue-600" />
                      <Label htmlFor="creator" className="flex-1 cursor-pointer">
                        Submit and protect my startup ideas
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50">
                      <RadioGroupItem value="executor" id="executor" />
                      <Building className="h-4 w-4 text-purple-600" />
                      <Label htmlFor="executor" className="flex-1 cursor-pointer">
                        Find and execute promising ideas
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio (Optional)</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      placeholder="Tell us about yourself..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="experience">Experience & Skills (Optional)</Label>
                    <Textarea
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                      placeholder="Your background, skills, and relevant experience..."
                      className="mt-1"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Create Account
                </Button>

                <div className="text-center text-sm text-slate-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
