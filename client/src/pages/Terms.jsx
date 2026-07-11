import { useLang } from '../context/LanguageContext';
import { FiFileText, FiShield, FiAlertTriangle } from 'react-icons/fi';

export default function Terms() {
  const { isBn } = useLang();

  return (
    <div className="min-h-screen py-12 md:py-20 px-4" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="container max-w-4xl mx-auto">
        <div className="rounded-3xl p-6 md:p-10" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
          
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[var(--border)]">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--red-light)', color: 'var(--red)' }}>
              <FiFileText size={22} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black">{isBn ? 'শর্তাবলী ও নিয়ম' : 'Terms of Service'}</h1>
              <p className="text-xs md:text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                {isBn ? 'সর্বশেষ আপডেট: জুলাই ২০২৬' : 'Last Updated: July 2026'}
              </p>
            </div>
          </div>

          <div className="space-y-8 text-sm md:text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            
            <section>
              <h3 className="text-lg md:text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>
                {isBn ? '১. প্ল্যাটফর্মের ব্যবহার' : '1. Use of the Platform'}
              </h3>
              <p>
                {isBn 
                  ? 'পিপল ই-শেবা বাংলাদেশের সাধারণ নাগরিকদের সহযোগিতার জন্য তৈরি একটি প্ল্যাটফর্ম। এখানে সঠিক ও সত্য তথ্য পোস্ট করা বাধ্যতামুলক। কোনো প্রকার বিভ্রান্তিকর, ফেক বা ক্ষতিকর তথ্য প্রদান দন্ডনীয় অপরাধ।' 
                  : 'People E-Sheba is built to assist the citizens of Bangladesh. Providing accurate and truthful information is mandatory. Sharing misleading, fake, or harmful information is strictly prohibited.'}
              </p>
            </section>

            <section>
              <h3 className="text-lg md:text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>
                {isBn ? '২. রক্তদান ও স্বেচ্ছাসেবক রোল' : '2. Blood Donation & Volunteers'}
              </h3>
              <p>
                {isBn 
                  ? 'রক্তদাতা ও স্বেচ্ছাসেবকরা কোনো প্রকার আর্থিক লেনদেন ছাড়া সম্পূর্ণ মানবিকভাবে সাহায্য করবেন। কোনো প্রার্থীর সাথে পিপল ই-শেবা কর্তৃপক্ষ কোনো আর্থিক লেনদেনের দায়ভার গ্রহণ করবে না।' 
                  : 'Blood donors and volunteers register purely out of humanitarian spirit without financial motives. People E-Sheba does not handle or take responsibility for any personal or financial transactions between members.'}
              </p>
            </section>

            <section>
              <h3 className="text-lg md:text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>
                {isBn ? '৩. দায়বদ্ধতার সীমাবদ্ধতা' : '3. Limitation of Liability'}
              </h3>
              <p>
                {isBn 
                  ? 'আমরা প্ল্যাটফর্মের সমস্ত তথ্য সর্বোচ্চ যাচাই করার চেষ্টা করি, তবে আমরা কোনো তথ্যের শতভাগ নির্ভুলতার গ্যারান্টি দিতে পারি না। জরুরি চিকিৎসায় হাসপাতালে নেওয়ার আগে বা সাহায্য পাঠনোর আগে দয়া করে নিজ দায়িত্বে সত্যতা নিশ্চিত করুন।' 
                  : 'While we strive to verify listings on our platform, we cannot guarantee 100% accuracy of all community contributions. Users are requested to verify medical, hospital, or donation claims independently before acting.'}
              </p>
            </section>

            <section>
              <h3 className="text-lg md:text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>
                {isBn ? '৪. অ্যাকাউন্ট বাতিলকরণ' : '4. Termination of Accounts'}
              </h3>
              <p>
                {isBn 
                  ? 'আমাদের শর্ত ভঙ্গ করলে বা ফেক রিকোয়েস্ট তৈরি করলে যেকোনো ব্যবহারকারীর অ্যাকাউন্ট বা পোস্ট যেকোনো সময় বিনা নোটিশে ব্লক বা মুছে দেওয়ার পূর্ণ অধিকার অ্যাডমিনের রয়েছে।' 
                  : 'The administrators reserve the right to suspend or terminate user accounts and posts instantly if any platform guidelines are violated or fraudulent activity is detected.'}
              </p>
            </section>

          </div>

        </div>
      </div>
    </div>
  );
}
