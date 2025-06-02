
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <section className="pt-20 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-8">Terms of Service</h1>
            <p className="text-slate-600 mb-8">Last updated: December 2024</p>

            <div className="space-y-8 text-slate-700">
              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                <p className="leading-relaxed">
                  By accessing and using IdeaSpark ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Platform Description</h2>
                <p className="leading-relaxed mb-4">
                  IdeaSpark is a marketplace platform that connects idea creators with potential executors. The platform allows:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Idea creators to submit and protect their startup ideas</li>
                  <li>Executors to browse, access, and potentially execute ideas</li>
                  <li>Secure transactions and legal agreement generation</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. User Responsibilities</h2>
                <h3 className="text-lg font-medium text-slate-800 mb-2">Idea Creators:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                  <li>Must own or have rights to submit ideas</li>
                  <li>Responsible for accuracy of submitted information</li>
                  <li>Agree to honor equity agreements when executed</li>
                </ul>
                
                <h3 className="text-lg font-medium text-slate-800 mb-2">Idea Executors:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Must pay required fees to access full ideas</li>
                  <li>Agree to equity terms (3-5% + optional board seat)</li>
                  <li>Maintain confidentiality of accessed ideas</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Intellectual Property</h2>
                <p className="leading-relaxed">
                  Idea creators retain ownership of their submitted ideas. By using the platform, creators grant IdeaSpark a limited license to display teasers publicly and full ideas to authorized, paying users only.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Payment Terms</h2>
                <p className="leading-relaxed mb-4">
                  Executors must pay the required access fee before viewing full idea details. Fees are non-refundable once access is granted. Equity agreements are separate legal contracts between creators and executors.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Limitation of Liability</h2>
                <p className="leading-relaxed">
                  IdeaSpark acts as a platform facilitator only. We are not responsible for the success or failure of any idea execution, disputes between users, or the enforcement of equity agreements.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Termination</h2>
                <p className="leading-relaxed">
                  Either party may terminate their account at any time. IdeaSpark reserves the right to suspend or terminate accounts that violate these terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Changes to Terms</h2>
                <p className="leading-relaxed">
                  IdeaSpark reserves the right to modify these terms at any time. Users will be notified of significant changes via email.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Contact Information</h2>
                <p className="leading-relaxed">
                  For questions about these Terms of Service, please contact us at legal@ideaspark.com
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

export default Terms;
