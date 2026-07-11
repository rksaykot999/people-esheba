import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle, FiInfo, FiActivity } from 'react-icons/fi';

export default function Contact() {
  const { t, isBn } = useLang();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const isDark = theme === 'dark';

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  return (
    <div className="min-h-screen py-12 md:py-20 px-4" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="container max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
               style={{ background: 'var(--red-light)', color: 'var(--red)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <FiActivity size={12} className="animate-pulse" />
            {isBn ? 'যোগাযোগ করুন' : 'Get In Touch'}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight">
            {isBn ? 'আপনার কোনো প্রশ্ন বা মতামত আছে?' : 'Have Questions or Feedback?'}
          </h1>
          <p className="max-w-xl mx-auto text-sm md:text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {isBn 
              ? 'আমাদের সাথে যেকোনো প্রয়োজনে যোগাযোগ করতে পারেন। আমরা সবসময় আপনার সহায়তায় প্রস্তুত।' 
              : 'Feel free to contact us with any queries or feedback. Our team is always here to assist you.'}
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* Left Column: Details */}
          <div className="md:col-span-5 space-y-6">
            <div className="rounded-3xl p-6 md:p-8" 
                 style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
              <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                {isBn ? 'যোগাযোগের মাধ্যম' : 'Contact Details'}
              </h3>
              
              <div className="space-y-6">
                {[
                  {
                    icon: <FiMail size={18} />,
                    title: isBn ? 'ইমেইল করুন' : 'Email Us',
                    val: 'info@esheba.bd',
                    sub: isBn ? 'যেকোনো সাধারণ জিজ্ঞাসার জন্য' : 'For general queries',
                    to: 'mailto:info@esheba.bd'
                  },
                  {
                    icon: <FiPhone size={18} />,
                    title: isBn ? 'কল করুন' : 'Call Support',
                    val: '+880 1700-000000',
                    sub: isBn ? 'রবি থেকে বৃহস্পতিবার, সকাল ৯টা - বিকাল ৫টা' : 'Sun to Thu, 9 AM - 5 PM',
                    to: 'tel:+8801700000000'
                  },
                  {
                    icon: <FiMapPin size={18} />,
                    title: isBn ? 'প্রধান কার্যালয়' : 'Headquarters',
                    val: isBn ? 'মিরপুর-১০, ঢাকা, বাংলাদেশ' : 'Mirpur-10, Dhaka, Bangladesh',
                    sub: isBn ? 'সরাসরি দেখা করার জন্য' : 'For in-person support',
                    to: '#'
                  }
                ].map((item, idx) => (
                  <a href={item.to} key={idx} className="flex gap-4 group text-decoration-none block" style={{ color: 'inherit' }}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                         style={{ background: 'var(--red-light)', color: 'var(--red)' }}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-dim mb-1" style={{ color: 'var(--text-dim)' }}>{item.title}</div>
                      <div className="text-base font-black group-hover:text-red-500 transition-colors">{item.val}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.sub}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Note */}
            <div className="rounded-3xl p-6" 
                 style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', display: 'flex', gap: 12 }}>
              <FiInfo size={20} className="text-cyan-500 flex-shrink-0" />
              <p className="text-xs md:text-sm leading-relaxed mb-0" style={{ color: 'var(--text-muted)' }}>
                {isBn 
                  ? 'জরুরি চিকিৎসার সাহায্য বা রক্তদাতার জন্য দয়া করে আমাদের প্রধান রক্তদান বা জরুরি সেবা পেজে অনুসন্ধান করুন।' 
                  : 'For medical emergencies or blood donation requests, please search our Blood Donation or Emergency pages directly.'}
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="md:col-span-7">
            <div className="rounded-3xl p-6 md:p-8" 
                 style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
              
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-6">
                    <FiCheckCircle size={36} />
                  </div>
                  <h3 className="text-2xl font-black mb-2">
                    {isBn ? 'বার্তাটি সফলভাবে পাঠানো হয়েছে!' : 'Message Sent Successfully!'}
                  </h3>
                  <p className="text-sm max-w-sm mx-auto mb-6" style={{ color: 'var(--text-muted)' }}>
                    {isBn 
                      ? 'আমরা আপনার বার্তা পেয়েছি এবং খুব শীঘ্রই আপনার সাথে যোগাযোগ করব।' 
                      : 'We have received your message and our team will get back to you as soon as possible.'}
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn btn-primary" style={{ background: 'var(--grad-red)', border: 'none' }}>
                    {isBn ? 'আরেকটি বার্তা পাঠান' : 'Send Another Message'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-2" style={{ color: 'var(--text-dim)' }}>
                        {isBn ? 'আপনার নাম' : 'Your Name'}
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="form-input" 
                        placeholder={isBn ? 'উদা: সাকিব রহমান' : 'e.g. Sakib Rahman'} 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase mb-2" style={{ color: 'var(--text-dim)' }}>
                        {isBn ? 'আপনার ইমেইল' : 'Your Email'}
                      </label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="form-input" 
                        placeholder="sakib@gmail.com" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-2" style={{ color: 'var(--text-dim)' }}>
                      {isBn ? 'বিষয়' : 'Subject'}
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="form-input" 
                      placeholder={isBn ? 'যোগাযোগের কারণ' : 'Reason for contact'} 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-2" style={{ color: 'var(--text-dim)' }}>
                      {isBn ? 'বার্তা' : 'Message'}
                    </label>
                    <textarea 
                      required
                      rows="5"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="form-input resize-none" 
                      placeholder={isBn ? 'আপনার বার্তাটি বিস্তারিত লিখুন...' : 'Write your message in detail...'}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 font-bold py-4 rounded-xl text-white transition-all active:scale-95 border-none cursor-pointer"
                    style={{ background: 'var(--grad-red)', boxShadow: 'var(--shadow-red)', opacity: loading ? 0.8 : 1 }}
                  >
                    {loading ? (
                      isBn ? 'পাঠানো হচ্ছে...' : 'Sending...'
                    ) : (
                      <>
                        <FiSend size={15} />
                        {isBn ? 'বার্তা পাঠান' : 'Send Message'}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
