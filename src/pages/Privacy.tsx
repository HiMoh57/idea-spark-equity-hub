
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <section className="pt-20 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
            <p className="text-slate-600 mb-8">Last updated: December 2024</p>

            <div className="space-y-8 text-slate-700">
              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Information We Collect</h2>
                <h3 className="text-lg font-medium text-slate-800 mb-2">Personal Information:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                  <li>Name, email address, and contact information</li>
                  <li>Professional background and experience</li>
                  <li>Payment information (processed securely through Stripe)</li>
                </ul>
                
                <h3 className="text-lg font-medium text-slate-800 mb-2">Idea Information:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                  <li>Startup ideas and descriptions</li>
                  <li>Industry tags and categorization</li>
                  <li>Interaction data (views, requests, payments)</li>
                </ul>

                <h3 className="text-lg font-medium text-slate-800 mb-2">Usage Data:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Browser type, device information, and IP address</li>
                  <li>Pages visited and time spent on platform</li>
                  <li>Click patterns and user interactions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. How We Use Your Information</h2>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Facilitate connections between idea creators and executors</li>
                  <li>Process payments and generate legal agreements</li>
                  <li>Improve platform functionality and user experience</li>
                  <li>Send important updates and notifications</li>
                  <li>Prevent fraud and maintain platform security</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Information Sharing</h2>
                <p className="leading-relaxed mb-4">We do not sell or rent your personal information. We may share information in the following circumstances:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Idea Access:</strong> Full idea details are shared only with verified, paying executors</li>
                  <li><strong>Service Providers:</strong> With trusted partners who help operate our platform (payment processors, email services)</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect platform integrity</li>
                  <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of company assets</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Data Security</h2>
                <p className="leading-relaxed mb-4">We implement industry-standard security measures:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>SSL encryption for all data transmission</li>
                  <li>Secure cloud storage with regular backups</li>
                  <li>Access controls and authentication systems</li>
                  <li>Regular security audits and monitoring</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Your Rights</h2>
                <p className="leading-relaxed mb-4">You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access and update your personal information</li>
                  <li>Delete your account and associated data</li>
                  <li>Control how your ideas are displayed</li>
                  <li>Opt-out of non-essential communications</li>
                  <li>Request data portability</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Cookies and Tracking</h2>
                <p className="leading-relaxed">
                  We use cookies to improve your experience, remember preferences, and analyze platform usage. You can control cookie settings through your browser, though some features may not work properly if disabled.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Third-Party Services</h2>
                <p className="leading-relaxed mb-4">We integrate with third-party services:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Stripe:</strong> For secure payment processing</li>
                  <li><strong>Analytics:</strong> To understand platform usage patterns</li>
                  <li><strong>Email Services:</strong> For communications and notifications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Children's Privacy</h2>
                <p className="leading-relaxed">
                  IdeaSpark is not intended for users under 18. We do not knowingly collect personal information from children under 18.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. International Users</h2>
                <p className="leading-relaxed">
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Contact Us</h2>
                <p className="leading-relaxed">
                  For privacy-related questions or to exercise your rights, contact us at privacy@ideaspark.com or through our platform's privacy settings.
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Privacy;
