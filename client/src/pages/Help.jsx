import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { FiHelpCircle, FiChevronDown, FiActivity, FiUser, FiInfo } from 'react-icons/fi';

export default function Help() {
  const { isBn } = useLang();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: isBn ? 'পিপল ই-শেবা কী?' : 'What is People E-Sheba?',
      a: isBn 
        ? 'পিপল ই-শেবা বাংলাদেশের নাগরিকদের জন্য একটি সমন্বিত অনলাইন প্ল্যাটফর্ম, যার মাধ্যমে আপনি জরুরি হটলাইন, রক্তদাতা, বিভিন্ন সরকারি ও বেসরকারি স্কুল-কলেজ-বিশ্ববিদ্যালয়ের তথ্য, চাকরি এবং আর্থিক সাহায্যের সুবিধা এক ক্লিকে পেতে পারেন।'
        : 'People E-Sheba is a unified digital platform for Bangladeshi citizens, offering quick access to emergency hotlines, blood donors, school-college-university directories, job listings, and verified financial donation requests.'
    },
    {
      q: isBn ? 'আমি কীভাবে রক্তদাতার প্রোফাইল তৈরি করব?' : 'How do I register as a blood donor?',
      a: isBn
        ? 'রক্তদাতা হতে প্রথমে আপনার অ্যাকাউন্টে লগইন করুন, তারপর মেনুবার থেকে "রক্তদান" পেজে গিয়ে "Become a Donor" বাটনে ক্লিক করে আপনার রক্তের গ্রুপ, বিভাগ ও শেষ রক্তদানের তারিখ দিয়ে রেজিস্ট্রেশন সম্পন্ন করুন।'
        : 'To become a blood donor, log in to your account, visit the "Blood Donation" page from the navigation bar, click "Become a Donor", and provide your blood group, division/area, and last donation date.'
    },
    {
      q: isBn ? 'সাহায্যের অনুরোধ বা অনুদানের পোস্ট কীভাবে করব?' : 'How can I post a donation/help request?',
      a: isBn
        ? 'যদি আপনার কোনো আর্থিক বা চিকিৎসাজনিত সাহায্যের প্রয়োজন হয়, তবে লগইন করে "Donate" পেজে যান এবং "Post Request" বাটনে ক্লিক করে ফর্মটি পূরণ করুন। অ্যাডমিন আপনার পোস্টটি সত্যতা যাচাই করে দ্রুত অ্যাপ্রুভ করবেন।'
        : 'If you need medical or educational financial assistance, log in and visit the "Donate" page, click "Post Request", and fill out the details. Administrators will verify and approve the post quickly.'
    },
    {
      q: isBn ? 'অ্যাডমিন প্যানেল এবং ইমপোর্ট কীভাবে কাজ করে?' : 'How does the admin import system work?',
      a: isBn
        ? 'অ্যাডমিনরা এক্সেল বা সিএসভি ফাইল আপলোড করে এক ক্লিকে শত শত নতুন হাসপাতাল, রক্তদাতা, স্কুল, কলেজ, বা বিশ্ববিদ্যালয়ের তথ্য বাংলা ও ইংরেজিতে একসাথে আপলোড করতে পারেন। এটি সম্পূর্ণ স্বয়ংক্রিয় এবং নিখুঁত।'
        : 'Administrators can upload Excel or CSV spreadsheets via the Admin Import tab to instantly populate hundreds of hospital, doctor, donor, school, college, or university listings in both Bangla and English.'
    }
  ];

  return (
    <div className="min-h-screen py-12 md:py-20 px-4" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="container max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
               style={{ background: 'var(--red-light)', color: 'var(--red)', fontSize: '0.78rem', fontWeight: 800 }}>
            <FiHelpCircle size={12} />
            {isBn ? 'সহায়তা কেন্দ্র' : 'Help & Support'}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight">
            {isBn ? 'আপনার জিজ্ঞাসা ও সমাধান' : 'How Can We Help You?'}
          </h1>
          <p className="max-w-xl mx-auto text-sm md:text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {isBn 
              ? 'আমাদের প্ল্যাটফর্মের ব্যবহার এবং বিভিন্ন সুবিধা সম্পর্কে সাধারণ প্রশ্নের উত্তরসমূহ এখানে খুঁজে পাবেন।' 
              : 'Find quick answers to common questions about using our platform, registers, and donation updates.'}
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="rounded-2xl transition-all border"
                style={{ 
                  background: 'var(--surface)', 
                  borderColor: isOpen ? 'var(--red)' : 'var(--border)',
                  boxShadow: isOpen ? 'var(--shadow-md)' : 'none'
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 bg-transparent border-none text-left cursor-pointer"
                >
                  <span className="font-bold text-base md:text-lg pr-4" style={{ color: 'var(--text)' }}>
                    {faq.q}
                  </span>
                  <FiChevronDown 
                    size={18} 
                    className="flex-shrink-0 transition-transform duration-300" 
                    style={{ 
                      color: isOpen ? 'var(--red)' : 'var(--text-dim)', 
                      transform: isOpen ? 'rotate(180deg)' : 'none' 
                    }} 
                  />
                </button>
                
                <div 
                  className="overflow-hidden transition-all duration-300"
                  style={{ 
                    maxHeight: isOpen ? '250px' : '0',
                    opacity: isOpen ? 1 : 0
                  }}
                >
                  <p className="p-6 pt-0 text-sm md:text-base leading-relaxed border-t" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="rounded-3xl p-6 md:p-8 mt-12 text-center" 
             style={{ background: 'var(--surface-3)', border: '1px solid var(--border)' }}>
          <h4 className="text-lg md:text-xl font-bold mb-2">
            {isBn ? 'আপনার সমাধান খুঁজে পাননি?' : 'Still Need Help?'}
          </h4>
          <p className="text-xs md:text-sm mb-6 max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
            {isBn 
              ? 'আমাদের সাথে যেকোনো সাহায্য বা জিজ্ঞাসার জন্য সরাসরি যোগাযোগ করুন।' 
              : 'Contact our customer support directly and we will respond within 24 hours.'}
          </p>
          <a href="/contact" className="btn btn-primary" style={{ background: 'var(--grad-red)', border: 'none', textDecoration: 'none', display: 'inline-block' }}>
            {isBn ? 'যোগাযোগ পেজে যান' : 'Go to Contact Page'}
          </a>
        </div>

      </div>
    </div>
  );
}
