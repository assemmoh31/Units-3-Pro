import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, Globe } from 'lucide-react';
import SEO from '../components/SEO';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <SEO 
        title="Privacy Policy"
        description="Privacy Policy for Unit Converter Pro. Learn how we manage data, cookies, and third-party advertising."
        keywords={['privacy policy', 'adsense policy', 'cookies', 'data protection', 'GDPR', 'CCPA']}
      />
      
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-6 text-primary-600 dark:text-primary-400 ring-4 ring-primary-50 dark:ring-primary-900/20">
           <ShieldCheck className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Privacy Policy</h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400 text-lg">Last updated: January 2025</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Introduction */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-primary-500" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Introduction</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            At Unit Converter Pro, accessible from our website, one of our main priorities is the privacy of our visitors. 
            This Privacy Policy document contains types of information that is collected and recorded by Unit Converter Pro and how we use it.
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
          </p>
        </div>

        {/* Log Files */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-emerald-500" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Log Files</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Unit Converter Pro follows a standard procedure of using log files. These files log visitors when they visit websites. 
            All hosting companies do this as a part of hosting services' analytics. The information collected by log files includes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300">
            <li>Internet Protocol (IP) addresses</li>
            <li>Browser type and version</li>
            <li>Internet Service Provider (ISP)</li>
            <li>Date and time stamp</li>
            <li>Referring/exit pages</li>
            <li>Possibly the number of clicks</li>
          </ul>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, 
            administering the site, tracking users' movement on the website, and gathering demographic information.
          </p>
        </div>

        {/* Cookies & Google AdSense */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Cookies and Advertising</h2>
          </div>
          
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Google AdSense & DoubleClick DART Cookie</h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Google is a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon 
            their visit to this website and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting 
            the Google ad and content network Privacy Policy at the following URL: 
            <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline ml-1">
              https://policies.google.com/technologies/ads
            </a>
          </p>

          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Our Advertising Partners</h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Some of advertisers on our site may use cookies and web beacons. Our advertising partners specifically include:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300 mb-6">
            <li><strong>Google AdSense</strong></li>
          </ul>

          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-600">
            <p className="text-sm text-slate-600 dark:text-slate-400 italic">
              Note that Unit Converter Pro has no access to or control over these cookies that are used by third-party advertisers.
            </p>
          </div>
        </div>

        {/* Third Party Policies */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Third Party Privacy Policies</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Unit Converter Pro's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective 
            Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how 
            to opt-out of certain options.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management 
            with specific web browsers, it can be found at the browsers' respective websites.
          </p>
        </div>

        {/* Children's Info & Consent */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Children's Information</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, 
            participate in, and/or monitor and guide their online activity. Unit Converter Pro does not knowingly collect any Personal Identifiable 
            Information from children under the age of 13.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Consent</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
          </p>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;