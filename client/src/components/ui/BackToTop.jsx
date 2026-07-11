import { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-[999] flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 border-none cursor-pointer ${
          visible ? 'translate-y-0 opacity-100 visible' : 'translate-y-12 opacity-0 invisible'
        }`}
        style={{
          background: 'var(--grad-red)',
          boxShadow: '0 8px 24px -6px rgba(230,57,70,0.6)',
        }}
        aria-label="Back to Top"
      >
        <FiArrowUp size={18} className="animate-bounce" />
      </button>
    </>
  );
}
