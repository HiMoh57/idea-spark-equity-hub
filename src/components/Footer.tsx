
import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">Ideopark</span>
            </Link>
            <p className="text-slate-400 mb-4 max-w-md">
              The secure marketplace for startup ideas. Connecting visionaries with executors to build the next generation of successful companies.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/explore" className="hover:text-white transition-colors">Explore Ideas</Link></li>
              <li><Link to="/submit-idea" className="hover:text-white transition-colors">Submit Idea</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">How it Works</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/disclaimer" className="hover:text-white transition-colors">Legal Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; 2025 IdeoPark. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
