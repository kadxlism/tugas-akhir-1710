import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && Object.keys(user).length > 0) navigate("/dashboard");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password, rememberMe);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login gagal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-700 to-black p-4 sm:p-6">
      <div className=" bg-white/10 shadow-2xl rounded-3xl p-6 sm:p-8 w-full max-w-md border border-white/300 transition-all duration-500">
        
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-pink-400 to-indigo-400 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              PM
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
            Welcome Back
          </h1>
          <p className="text-white/80 text-sm mt-1">
            Login to your Project Manager
          </p>
        </div>

        {/* Error message */}
        {error && (
          <p className="bg-red-500/20 text-red-200 border border-red-400/50 p-3 rounded-lg mb-5 text-sm text-center shadow-sm">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:border-green-500 focus:ring-2 focus:ring-green-400 outline-none transition duration-200"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:border-gre-400 focus:ring-2 focus:ring-green-400 outline-none transition duration-200"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm text-white/80">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="mr-2 rounded border-white/30 bg-white/10 focus:ring-pink-400"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <a href="#" className="hover:underline hover:text-white">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white p-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:opacity-90 transition-transform duration-200 hover:scale-[1.02]"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-white/80">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-pink-300 font-medium hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;