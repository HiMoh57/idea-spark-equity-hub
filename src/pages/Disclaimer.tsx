
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AlertTriangle } from 'lucide-react';

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <section className="pt-20 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex items-center mb-8">
              <div className="bg-yellow-100 rounded-2xl p-3 mr-4">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">Legal Disclaimer</h1>
                <p className="text-slate-600">Important legal information and limitations</p>
              </div>
            </div>
            
            <p className="text-slate-600 mb-8">Last updated: December 2024</p>

            <div className="space-y-8 text-slate-700">
              <section className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                <h2 className="text-xl font-semibold text-yellow-800 mb-3">⚠️ Important Notice</h2>
                <p className="text-yellow-700 leading-relaxed">
                  IdeaSpark is a demonstration platform created for educational and portfolio purposes only. 
                  This is not a real business and no actual legal agreements, payments, or equity transfers should be conducted through this platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Platform Status</h2>
                <p className="leading-relaxed mb-4">
                  IdeaSpark is a proof-of-concept marketplace platform designed to demonstrate the feasibility of connecting startup idea creators with potential executors. This platform is:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>For demonstration and educational purposes only</li>
                  <li>Not licensed to facilitate real business transactions</li>
                  <li>Not providing actual legal or financial services</li>
                  <li>Not authorized to generate binding legal agreements</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. No Legal Advice</h2>
                <p className="leading-relaxed">
                  Information provided on this platform does not constitute legal, financial, or business advice. Users should consult with qualified professionals before entering into any real business relationships or legal agreements related to startup ideas or equity sharing.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Intellectual Property Protection</h2>
                <p className="leading-relaxed mb-4">
                  While this platform demonstrates security features for idea protection, it does not provide actual legal protection for intellectual property. Users should:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Not submit confidential or proprietary business ideas</li>
                  <li>Seek proper legal protection (patents, trademarks, NDAs) for valuable IP</li>
                  <li>Understand that submission here does not create legal rights</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. No Financial Guarantees</h2>
                <p className="leading-relaxed">
                  Any references to equity percentages, payment amounts, or financial returns are purely illustrative. This platform makes no representations about potential financial outcomes or the viability of any business ideas.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Third-Party Integrations</h2>
                <p className="leading-relaxed mb-4">
                  Payment processing and other third-party services mentioned are in test/sandbox mode only. No real financial transactions are processed. References to services like Stripe are for demonstration purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. User-Generated Content</h2>
                <p className="leading-relaxed">
                  Users are responsible for any content they submit. The platform operator is not responsible for the accuracy, legality, or originality of user-submitted ideas or information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Limitation of Liability</h2>
                <p className="leading-relaxed">
                  The platform creators and operators shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from the use of this demonstration platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. No Warranty</h2>
                <p className="leading-relaxed">
                  This platform is provided "as is" without any warranties, express or implied. We make no guarantees about the platform's availability, security, or functionality.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Data Handling</h2>
                <p className="leading-relaxed">
                  While we implement security measures, this demonstration platform should not be used to store sensitive, confidential, or proprietary business information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Future Commercial Use</h2>
                <p className="leading-relaxed">
                  If this concept were to be developed into a commercial platform, it would require:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Proper business licensing and legal compliance</li>
                  <li>Professional legal and financial advisory services</li>
                  <li>Comprehensive terms of service and privacy policies</li>
                  <li>Regulatory approval for financial transactions</li>
                  <li>Professional insurance and bonding</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">11. Contact for Legal Matters</h2>
                <p className="leading-relaxed">
                  This disclaimer is for demonstration purposes. For any actual legal concerns, users should consult with qualified legal professionals in their jurisdiction.
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

export default Disclaimer;
