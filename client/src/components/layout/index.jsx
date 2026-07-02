import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import AIAssistant from '../ui/AIAssistant';
import { Spinner } from '../ui';

/* ── Main public layout ──────────────────────────────────────── */
export const Layout = ({ children }) => (
  <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
    <Navbar />
    <main style={{ flex:1 }}>
      {children}
    </main>
    <Footer />
    <AIAssistant />
  </div>
);

/* ── Admin layout (no navbar/footer) ────────────────────────── */
export const AdminLayout = ({ children }) => (
  <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
    {children}
  </div>
);

/* ── Auth guard — redirect to /login ─────────────────────────── */
export const ProtectedRoute = ({ children }) => {
  const { isAuth, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh' }}><Spinner /></div>;
  if (!isAuth) return <Navigate to="/login" replace />;
  return children;
};

/* ── Admin guard — 403 if not admin ─────────────────────────── */
export const AdminRoute = ({ children }) => {
  const { isAuth, isAdmin, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh' }}><Spinner /></div>;
  if (!isAuth)  return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

/* ── Guest guard — redirect to home if already logged in ─────── */
export const GuestRoute = ({ children }) => {
  const { isAuth, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh' }}><Spinner /></div>;
  if (isAuth) return <Navigate to="/" replace />;
  return children;
};
