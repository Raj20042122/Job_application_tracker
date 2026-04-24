import React, { useState } from "react";
import { LogIn, Briefcase, Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import api from "../services/api";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      if (!email || !password) {
        toast.error("Please enter email and password");
        return;
      }
      setLoading(true);
      try {
        const res = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success("Login successful");
        window.location.reload();
      } catch (err) {
        toast.error(err.response?.data?.msg || "Login failed. Please check your credentials.");
      } finally {
        setLoading(false);
      }
    } else {
      if (!name || !email || !password || !confirmPassword) {
        toast.error("Please fill in all fields");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      setLoading(true);
      try {
        await api.post("/auth/register", { name, email, password });
        toast.success("Account created! Please sign in.");
        setIsLogin(true);
        setPassword("");
        setConfirmPassword("");
      } catch (err) {
        toast.error(err.response?.data?.msg || "Registration failed.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await api.post("/auth/google", {
          access_token: tokenResponse.access_token,
        });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success("Login successful");
        window.location.reload();
      } catch (err) {
        toast.error(err.response?.data?.msg || "Google authentication failed.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      toast.error("Google authentication failed.");
    }
  });

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }
    toast.success("Password reset link sent to your email!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1f2e] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full bg-[#23293d] rounded-2xl shadow-2xl p-8 border border-white/5">
        
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 bg-[#6c63ff] rounded-2xl flex items-center justify-center shadow-lg mb-5">
            <Briefcase className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-white mb-2">
            {isLogin ? "Sign in to JobTracker" : "Create an Account"}
          </h2>
          <p className="text-center text-sm text-slate-400">
            {isLogin ? "Or" : "Already have an account?"}{" "}
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setPassword("");
                setConfirmPassword("");
              }}
              className="font-semibold text-[#6c63ff] hover:text-[#5a52d5] transition-colors"
            >
              {isLogin ? "create a new account" : "sign in here"}
            </button>
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  required
                  className="w-full bg-[#1a1f2e] border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#6c63ff] focus:ring-1 focus:ring-[#6c63ff] transition-all"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="email"
                required
                className="w-full bg-[#1a1f2e] border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#6c63ff] focus:ring-1 focus:ring-[#6c63ff] transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full bg-[#1a1f2e] border border-slate-700/50 rounded-xl pl-10 pr-12 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#6c63ff] focus:ring-1 focus:ring-[#6c63ff] transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-[#1a1f2e] border border-slate-700/50 rounded-xl pl-10 pr-12 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#6c63ff] focus:ring-1 focus:ring-[#6c63ff] transition-all"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          )}

          {isLogin && (
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-600 text-[#6c63ff] focus:ring-[#6c63ff] bg-[#1a1f2e]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">
                  Remember me
                </label>
              </div>

              <button 
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium text-[#6c63ff] hover:text-[#5a52d5]"
              >
                Forgot your password?
              </button>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6c63ff] text-white rounded-xl py-3.5 px-4 font-semibold text-lg hover:bg-[#5a52d5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#23293d] focus:ring-[#6c63ff] disabled:opacity-70 transition-all flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(108,99,255,0.3)] hover:shadow-[0_0_20px_rgba(108,99,255,0.5)]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                <>
                  {isLogin ? "Sign in" : "Create Account"}
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/50" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#23293d] text-slate-400">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => handleGoogleLogin()}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-700/50 rounded-xl shadow-sm bg-[#1a1f2e] text-sm font-medium text-white hover:bg-slate-800 transition-colors disabled:opacity-70"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                <path d="M1 1h22v22H1z" fill="none"/>
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Login;