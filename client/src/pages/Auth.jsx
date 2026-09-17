import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Briefcase, ArrowRight, Sparkles, CheckCircle2, Shield, Lock, Mail, User, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGoogleHelp, setShowGoogleHelp] = useState(false);

  const { login, register, loginWithGoogle, demoLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // If already logged in, redirect
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Initialize Google Sign-In SDK if available
  useEffect(() => {
    if (window.google?.accounts?.id && googleClientId && googleClientId !== "YOUR_GOOGLE_CLIENT_ID") {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            if (response.credential) {
              setLoading(true);
              await loginWithGoogle(response.credential);
              setLoading(false);
            }
          }
        });

        const btnContainer = document.getElementById("googleSignInBtn");
        if (btnContainer) {
          window.google.accounts.id.renderButton(btnContainer, {
            theme: "filled_black",
            size: "large",
            width: 380,
            text: "continue_with",
            shape: "pill"
          });
        }
      } catch (err) {
        console.warn("Google Sign-In initialization error:", err);
      }
    }
  }, [googleClientId, isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const res = await login(email, password);
      if (res.success) {
        navigate("/");
      }
    } else {
      if (!name.trim()) {
        toast.error("Please enter your name");
        setLoading(false);
        return;
      }
      const res = await register(name, email, password);
      if (res.success) {
        navigate("/");
      }
    }
    setLoading(false);
  };

  const handleDemoClick = async () => {
    setLoading(true);
    const res = await demoLogin();
    if (res.success) {
      navigate("/");
    }
    setLoading(false);
  };

  const handleGoogleClick = () => {
    if (!googleClientId || googleClientId === "YOUR_GOOGLE_CLIENT_ID") {
      setShowGoogleHelp(true);
      return;
    }

    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      setShowGoogleHelp(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B11] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[300px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 mb-4 shadow-sm">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]">
              <Briefcase size={14} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-semibold text-slate-200 tracking-wide">JobTracker OS</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-slate-400 mt-1.5">
            {isLogin 
              ? "Track your applications, interview pipelines, and offers"
              : "Start organizing your dream job search in minutes"
            }
          </p>
        </div>

        {/* Card Container */}
        <div className="jt-card p-6 sm:p-8 relative">
          
          {/* Google OAuth Button */}
          <div className="space-y-3">
            <div id="googleSignInBtn" className="w-full flex justify-center min-h-[44px]">
              {/* Fallback button if Google script is loading or Client ID needs prompt */}
              <button
                type="button"
                onClick={handleGoogleClick}
                className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white font-medium text-sm flex items-center justify-center gap-3 transition-all hover:border-white/20 active:scale-[0.99]"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google
              </button>
            </div>

            {/* Quick Demo Login Option */}
            <button
              type="button"
              onClick={handleDemoClick}
              disabled={loading}
              className="w-full py-2 px-4 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-medium text-xs flex items-center justify-center gap-2 transition-all hover:text-white"
            >
              <Sparkles size={13} className="text-indigo-400" />
              1-Click Demo Evaluation Login
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <span className="relative px-3 bg-[#10141E] text-xs uppercase tracking-wider text-slate-500 font-medium">
              Or with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="jt-input pl-10"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="jt-input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="jt-input pl-10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="jt-btn-primary w-full py-3 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? "Sign in" : "Create account"}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div className="mt-6 pt-5 border-t border-white/5 text-center text-xs text-slate-400">
            {isLogin ? (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                >
                  Sign up free
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Footer Security Badges */}
        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <Shield size={13} className="text-emerald-400" />
            <span>Encrypted JWT Sessions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-indigo-400" />
            <span>Zero Data Sharing</span>
          </div>
        </div>
      </div>

      {/* Google OAuth Help Modal */}
      {showGoogleHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="jt-card p-6 max-w-md w-full border border-indigo-500/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-3 text-indigo-400">
              <AlertCircle size={22} />
              <h3 className="text-base font-bold text-white">Google OAuth Setup</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              To enable "Continue with Google" live authentication:
            </p>
            <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside bg-black/40 p-3 rounded-xl border border-white/5 font-mono mb-4">
              <li>Open Google Cloud Console & create an OAuth Client ID.</li>
              <li>Add to <span className="text-indigo-300">client/.env</span>:<br/>
                <code className="text-emerald-400">VITE_GOOGLE_CLIENT_ID=your_id.apps.googleusercontent.com</code>
              </li>
              <li>Add to <span className="text-indigo-300">server/.env</span>:<br/>
                <code className="text-emerald-400">GOOGLE_CLIENT_ID=your_id.apps.googleusercontent.com</code>
              </li>
            </ol>
            <p className="text-xs text-slate-400 mb-5">
              In the meantime, you can test immediately with regular email/password or using the <strong>1-Click Demo Login</strong> button!
            </p>
            <button
              onClick={() => setShowGoogleHelp(false)}
              className="jt-btn-primary w-full py-2 text-xs"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
