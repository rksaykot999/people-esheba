import { useLang } from '../context/LanguageContext';
import { FiLock, FiShield, FiFileText } from 'react-icons/fi';

export default function Privacy() {
  const { isBn } = useLang();

  return (
    <div className="min-h-screen py-12 md:py-20 px-4" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="container max-w-4xl mx-auto">
        <div className="rounded-3xl p-6 md:p-10" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
          
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[var(--border)]">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--red-light)', color: 'var(--red)' }}>
              <FiLock size={22} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black">{isBn ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}</h1>
              <p className="text-xs md:text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                {isBn ? 'সর্বশেষ আপডেট: জুলাই ২০২৬' : 'Last Updated: July 2026'}
              </p>
            </div>
          </div>

          <div className="space-y-8 text-sm md:text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            
            <section>
              <h3 className="text-lg md:text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>
                {isBn ? '১. তথ্য সংগ্রহ' : '1. Information Collection'}
              </h3>
              <p>
                {isBn 
                  ? 'আমরা আপনার অ্যাকাউন্ট রেজিস্ট্রেশন, রক্তদান প্রোফাইল তৈরি বা সাহায্য পোস্ট করার সময় কিছু তথ্য সংগ্রহ করি (যেমন নাম, ইমেইল, মোবাইল নম্বর এবং ঠিকানা)।' 
                  : 'We collect information you provide to us directly when registering an account, creating a blood donation profile, or posting help requests (such as name, email, phone number, and location).'}
              </p>
            </section>

            <section>
              <h3 className="text-lg md:text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>
                {isBn ? '২. তথ্যের ব্যবহার' : '2. How We Use Your Information'}
              </h3>
              <p className="mb-2">
                {isBn ? 'সংগৃহীত তথ্য নিম্নলিখিত উদ্দেশ্যে ব্যবহার করা হতে পারে:' : 'We use the collected information to:'}
              </p>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>{isBn ? 'আপনাকে জরুরি সেবা ও রক্তদাতার সাথে সংযোগ করাতে।' : 'Connect you with emergency resources and blood donors.'}</li>
                <li>{isBn ? 'আমাদের প্ল্যাটফর্মের নিরাপত্তা বজায় রাখতে এবং মিথ্যা অনুরোধ রুখতে।' : 'Ensure the security and reliability of help requests.'}</li>
                <li>{isBn ? 'আপনার অভিজ্ঞতা ও প্ল্যাটফর্মের কাজের মান উন্নত করতে।' : 'Improve platform usability and deliver a personalized experience.'}</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg md:text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>
                {isBn ? '৩. তথ্যের নিরাপত্তা ও শেয়ারিং' : '3. Data Protection and Sharing'}
              </h3>
              <p>
                {isBn 
                  ? 'আমরা কখনোই আপনার ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি করি না। শুধুমাত্র রক্তদাতা এবং স্বেচ্ছাসেবকদের ক্ষেত্রে আপনার সম্মতি অনুযায়ী যোগাযোগের নম্বরটি প্রকাশ করা হয় যাতে সাহায্য প্রার্থীরা সরাসরি যোগাযোগ করতে পারেন।' 
                  : 'We never sell your personal information to third parties. Your phone number is only shared with your consent for public roles like blood donors or volunteers so that individuals in need can contact you directly.'}
              </p>
            </section>

            <section>
              <h3 className="text-lg md:text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>
                {isBn ? '৪. আপনার অধিকার' : '4. Your Rights'}
              </h3>
              <p>
                {isBn 
                  ? 'আপনি যেকোনো সময় আপনার প্রোফাইল তথ্য পরিবর্তন বা মুছে ফেলতে পারেন। কোনো সাহায্যের অনুরোধ পোস্ট বন্ধ করতে চাইলে তা ড্যাশবোর্ড থেকে রিমুভ করতে পারবেন।' 
                  : 'You have the right to modify or delete your account information at any time. Any active donation or help posts can be deactivated from your user dashboard.'}
              </p>
            </section>

          </div>

        </div>
      </div>
    </div>
  );
}
