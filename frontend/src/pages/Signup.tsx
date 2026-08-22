import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User as UserIcon, ArrowLeft } from "lucide-react";
import { authErrorMessage } from "../lib/auth";

const signupSchema = z
  .object({
    displayName: z.string().trim().min(1, "Display name is required").max(50),
    email: z.string().trim().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Signup = () => {
  const navigate = useNavigate();
  const { user, register } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form error tracking
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  // Real-time validation
  const validateField = (name: string, val: string) => {
    if (name === "displayName") {
      if (!val) {
        setNameError("");
        return;
      }
      if (val.length < 1) {
        setNameError("Name is required");
      } else {
        setNameError("");
      }
    } else if (name === "email") {
      if (!val) {
        setEmailError("");
        return;
      }
      const parsed = z.string().email().safeParse(val);
      if (!parsed.success) {
        setEmailError("Invalid email format");
      } else {
        setEmailError("");
      }
    } else if (name === "password") {
      if (!val) {
        setPasswordError("");
        return;
      }
      if (val.length < 8) {
        setPasswordError("Must be at least 8 characters");
      } else {
        setPasswordError("");
      }
      // Re-validate match if confirmPassword has value
      if (confirmPassword && val !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match");
      } else {
        setConfirmPasswordError("");
      }
    } else if (name === "confirmPassword") {
      if (!val) {
        setConfirmPasswordError("");
        return;
      }
      if (val !== password) {
        setConfirmPasswordError("Passwords do not match");
      } else {
        setConfirmPasswordError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = signupSchema.safeParse({
      displayName,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      // Map errors
      result.error.errors.forEach((err) => {
        if (err.path.includes("displayName")) setNameError(err.message);
        if (err.path.includes("email")) setEmailError(err.message);
        if (err.path.includes("password")) setPasswordError(err.message);
        if (err.path.includes("confirmPassword")) setConfirmPasswordError(err.message);
      });
      toast.error("Please fix the validation errors");
      return;
    }

    setLoading(true);
    try {
      await register({ email, displayName, password });
      toast.success("Your library card is ready ✨");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(authErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 paper-texture relative overflow-hidden">
      {/* Background cozy decorations */}
      <div className="fixed left-3 top-0 bottom-0 flex flex-col justify-center gap-8 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full border-2 border-border bg-background"
          />
        ))}
      </div>
      <div className="fixed left-12 top-0 bottom-0 w-px bg-dusty-rose/20 pointer-events-none" />

      {/* Cozy coffee doodles / stamps */}
      <div className="fixed -bottom-10 -left-10 w-44 h-44 rounded-full border-[6px] border-coffee-stain/10 pointer-events-none select-none -rotate-12" />
      <div className="fixed top-12 right-24 w-32 h-32 rounded-full border border-coffee-stain/5 pointer-events-none select-none" />

      {/* Card Wrapper Container to prevent clipping of washi tape */}
      <div className="relative w-full max-w-md mt-6">
        {/* Washi tape decoration */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-washi-mint/50 rotate-1 rounded-sm shadow-sm border-x-2 border-dashed border-washi-mint/30 flex items-center justify-center z-20">
          <span className="text-[10px] uppercase font-handwritten text-foreground/60 tracking-wider">
            join the shelf
          </span>
        </div>

        {/* Main card wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full bg-card rounded-sm shadow-journal border border-border p-8 md:p-10 relative dog-ear"
        >
          {/* Back navigation */}
          <Link
            to="/"
            className="inline-flex items-center gap-1 font-handwritten text-lg text-muted-foreground hover:text-primary transition-colors group mb-4"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            back to home
          </Link>

          {/* Header section */}
          <div className="text-center mb-6">
            <h1 className="font-handwritten text-4xl text-foreground mb-1">
              Get your library card ✦
            </h1>
            <p className="font-body italic text-xs text-muted-foreground">
              Create an account to save recommendations & exchange reviews
            </p>
          </div>

          {/* Social Authentication Container */}
          <button
            type="button"
            disabled
            title="Google sign-in will be added after the core account flow"
            className="mb-4 flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-sm border border-border bg-background/60 py-2.5 font-handwritten text-lg opacity-60 shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
              />
            </svg>
            <span className="mt-0.5">Google sign-in · coming later</span>
          </button>

          {/* Cozy Separator */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-handwritten text-muted-foreground italic">
              create an account with email
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Display Name Input */}
            <div className="space-y-1">
              <label className="text-xs font-handwritten text-muted-foreground flex justify-between">
                <span>library card name</span>
                {nameError && (
                  <span className="text-destructive font-handwritten text-xs animate-pulse">
                    * {nameError}
                  </span>
                )}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground/60">
                  <UserIcon className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="cozy_reader"
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                    validateField("displayName", e.target.value);
                  }}
                  className={`w-full pl-9 pr-3 py-2 rounded-sm border ${
                    nameError ? "border-destructive bg-destructive/5" : "border-border bg-background"
                  } font-body text-sm placeholder:opacity-40 focus:outline-none focus:ring-1 focus:ring-primary`}
                  required
                  maxLength={50}
                />
              </div>
            </div>

            {/* Email input field */}
            <div className="space-y-1">
              <label className="text-xs font-handwritten text-muted-foreground flex justify-between">
                <span>email address</span>
                {emailError && (
                  <span className="text-destructive font-handwritten text-xs animate-pulse">
                    * {emailError}
                  </span>
                )}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground/60">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  placeholder="reader@brewedtales.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateField("email", e.target.value);
                  }}
                  className={`w-full pl-9 pr-3 py-2 rounded-sm border ${
                    emailError ? "border-destructive bg-destructive/5" : "border-border bg-background"
                  } font-body text-sm placeholder:opacity-40 focus:outline-none focus:ring-1 focus:ring-primary`}
                  required
                />
              </div>
            </div>

            {/* Password input field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-handwritten text-muted-foreground">
                <span>choose password</span>
                {passwordError && (
                  <span className="text-destructive font-handwritten text-xs animate-pulse">
                    * {passwordError}
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground/60">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validateField("password", e.target.value);
                  }}
                  className={`w-full pl-9 pr-10 py-2 rounded-sm border ${
                    passwordError ? "border-destructive bg-destructive/5" : "border-border bg-background"
                  } font-body text-sm placeholder:opacity-40 focus:outline-none focus:ring-1 focus:ring-primary`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground/60 hover:text-primary"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password input field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-handwritten text-muted-foreground">
                <span>confirm password</span>
                {confirmPasswordError && (
                  <span className="text-destructive font-handwritten text-xs animate-pulse">
                    * {confirmPasswordError}
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground/60">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    validateField("confirmPassword", e.target.value);
                  }}
                  className={`w-full pl-9 pr-10 py-2 rounded-sm border ${
                    confirmPasswordError ? "border-destructive bg-destructive/5" : "border-border bg-background"
                  } font-body text-sm placeholder:opacity-40 focus:outline-none focus:ring-1 focus:ring-primary`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground/60 hover:text-primary"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submission action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-4 rounded-sm bg-primary text-primary-foreground font-handwritten text-xl
                hover:shadow-warm active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent" />
              ) : null}
              <span>{loading ? "writing card..." : "Issue library card ✦"}</span>
            </button>
          </form>

          {/* Redirect toggle link */}
          <p className="text-center text-sm mt-6 font-body text-muted-foreground">
            Already have a card?{" "}
            <Link
              to="/login"
              className="text-primary font-handwritten text-xl underline underline-offset-2 ml-1 hover:text-accent transition-colors"
            >
              Log in here
            </Link>
          </p>

          {/* Small ink splatters / detail dots */}
          <div className="ink-dots mt-6" />
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
