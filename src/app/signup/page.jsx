"use client";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { buildApiUrl } from "@/lib/api";

const ROLE_OPTIONS = [
  {
    value: "client",
    label: "Client",
    helper: "File your own IPR applications",
  },
  {
    value: "agent",
    label: "Agent",
    helper: "File applications on behalf of clients",
  },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SPECIAL_CHAR_REGEX = /[^a-zA-Z0-9]/;
const ROLE_SWIPE_THRESHOLD = 24;

function validateForm(form) {
  const errors = {};
  const trimmedName = form.fullName.trim();
  const trimmedEmail = form.email.trim();

  if (!trimmedName) errors.fullName = "Full name is required";

  if (!trimmedEmail) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = "Please enter a valid email address";
  }

  if (!form.password) {
    errors.password = "Password is required";
  } else {
    if (form.password.length < 8) {
      errors.passwordLength = "Password must be at least 8 characters";
    }
    if (!SPECIAL_CHAR_REGEX.test(form.password)) {
      errors.passwordSpecial = "Password must include special character";
    }
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = "Confirm password is required";
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (!form.role || !ROLE_OPTIONS.some((option) => option.value === form.role)) {
    errors.role = "Please select a role";
  }

  if (!form.agreed) errors.agreed = "You must agree to the terms";

  return errors;
}

function normalizeBackendError(message, statusCode) {
  const text = String(message || "Registration failed").toLowerCase();

  if (text.includes("exist")) return "User already exists";
  if (statusCode === 400 || text.includes("invalid")) return "Invalid input";

  return message || "Registration failed";
}

export default function SignupPage() {
  const router = useRouter();
  const roleToggleRef = useRef(null);
  const roleDragStartXRef = useRef(null);
  const roleDragStartIndexRef = useRef(0);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "client",
    agreed: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRoleDragging, setIsRoleDragging] = useState(false);
  const [roleDragOffset, setRoleDragOffset] = useState(0);

  const fieldErrors = useMemo(() => validateForm(form), [form]);
  const isFormValid = Object.keys(fieldErrors).length === 0;
  const selectedRoleIndex = Math.max(
    0,
    ROLE_OPTIONS.findIndex((option) => option.value === form.role)
  );
  const selectedRole = ROLE_OPTIONS[selectedRoleIndex] || ROLE_OPTIONS[0];

  const normalizeToken = (tokenValue) => {
    if (typeof tokenValue !== "string") return "";
    return tokenValue.replace(/^Bearer\s+/i, "").trim();
  };

  const setFieldTouched = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const shouldShowFieldError = (name) => Boolean((submitted || touched[name]) && fieldErrors[name]);
  const showPasswordErrors = Boolean(submitted || touched.password);
  const hasPasswordError =
    showPasswordErrors &&
    Boolean(fieldErrors.password || fieldErrors.passwordLength || fieldErrors.passwordSpecial);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setError("");
    setSuccess("");
    setFieldTouched(name);
  };

  const setRole = (roleValue) => {
    if (!ROLE_OPTIONS.some((option) => option.value === roleValue)) return;
    setForm((prev) => {
      if (prev.role === roleValue) return prev;
      return { ...prev, role: roleValue };
    });
    setError("");
    setSuccess("");
    setFieldTouched("role");
  };

  const handleRoleKeyDown = (e) => {
    if (
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight" &&
      e.key !== "Home" &&
      e.key !== "End"
    ) {
      return;
    }

    e.preventDefault();

    if (e.key === "Home") {
      setRole(ROLE_OPTIONS[0].value);
      return;
    }

    if (e.key === "End") {
      setRole(ROLE_OPTIONS[ROLE_OPTIONS.length - 1].value);
      return;
    }

    const direction = e.key === "ArrowRight" ? 1 : -1;
    const nextIndex = Math.min(
      ROLE_OPTIONS.length - 1,
      Math.max(0, selectedRoleIndex + direction)
    );
    setRole(ROLE_OPTIONS[nextIndex].value);
  };

  const handleRolePointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    roleDragStartXRef.current = e.clientX;
    roleDragStartIndexRef.current = selectedRoleIndex;
    setIsRoleDragging(true);
    setRoleDragOffset(0);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handleRolePointerMove = (e) => {
    if (!isRoleDragging || roleDragStartXRef.current === null) return;
    const roleToggleWidth = roleToggleRef.current?.getBoundingClientRect().width || 0;
    const segmentWidth = roleToggleWidth / ROLE_OPTIONS.length;
    if (!segmentWidth) return;

    const rawDelta = e.clientX - roleDragStartXRef.current;
    const clampedDelta = Math.max(-segmentWidth, Math.min(segmentWidth, rawDelta));
    setRoleDragOffset(clampedDelta);
  };

  const finalizeRoleDrag = (pointerClientX) => {
    if (roleDragStartXRef.current === null) return;

    const deltaX = pointerClientX - roleDragStartXRef.current;
    let nextRoleIndex = roleDragStartIndexRef.current;

    if (Math.abs(deltaX) >= ROLE_SWIPE_THRESHOLD) {
      nextRoleIndex = deltaX > 0 ? Math.min(ROLE_OPTIONS.length - 1, nextRoleIndex + 1) : Math.max(0, nextRoleIndex - 1);
    } else {
      const rect = roleToggleRef.current?.getBoundingClientRect();
      if (rect) {
        const localX = pointerClientX - rect.left;
        nextRoleIndex = localX >= rect.width / 2 ? 1 : 0;
      }
    }

    setIsRoleDragging(false);
    setRoleDragOffset(0);
    roleDragStartXRef.current = null;
    setRole(ROLE_OPTIONS[nextRoleIndex].value);
  };

  const handleRolePointerUp = (e) => {
    if (!isRoleDragging) return;
    finalizeRoleDrag(e.clientX);
  };

  const handleRolePointerCancel = () => {
    setIsRoleDragging(false);
    setRoleDragOffset(0);
    roleDragStartXRef.current = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isFormValid) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(buildApiUrl("/api/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.fullName.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
        }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        const rawMessage =
          data?.message || data?.error || data?.data?.message || "Registration failed";
        throw new Error(normalizeBackendError(rawMessage, res.status));
      }

      const payload = data?.data || data || {};
      const user = payload?.user || data?.user;
      const token = normalizeToken(payload?.token || data?.token);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      if (token) {
        localStorage.setItem("token", token);
        setSuccess("Account created successfully. Redirecting to dashboard...");
        const role = String(user?.role || form.role || "").toLowerCase();
        if (role === "admin") {
          router.push("/admin");
        } else if (role === "agent") {
          router.push("/agent");
        } else {
          router.push("/dashboard");
        }
      } else {
        setSuccess("Account created successfully. Redirecting to login...");
        router.push("/login");
      }
    } catch (err) {
      setError(
        err?.message === "Failed to fetch"
          ? "Unable to reach server. Please try again in a moment."
          : err?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between py-10 px-6 pt-16">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#0d1b2a] rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-[#f5a623] text-xl">verified_user</span>
          </div>
          <span className="text-sm font-extrabold tracking-tight text-[#0d1b2a]">PATENT-IPR</span>
        </div>

        <h1 className="text-3xl font-bold text-[#0d1b2a] mb-4">Create Your Account</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#0d1b2a]">Full Name</label>
            <div
              className={`flex items-center border rounded-lg px-3 py-3 gap-2 focus-within:border-[#0d1b2a] transition-colors ${
                shouldShowFieldError("fullName") ? "border-red-400" : "border-gray-200"
              }`}
            >
              <span className="material-symbols-outlined text-gray-400 text-base">person</span>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                onBlur={() => setFieldTouched("fullName")}
                placeholder="Full Name"
                className="flex-1 text-sm text-[#0d1b2a] outline-none placeholder:text-gray-400 bg-transparent"
                autoComplete="name"
              />
            </div>
            {shouldShowFieldError("fullName") && (
              <p className="text-xs text-red-500">{fieldErrors.fullName}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#0d1b2a]">Email</label>
            <div
              className={`flex items-center border rounded-lg px-3 py-3 gap-2 focus-within:border-[#0d1b2a] transition-colors ${
                shouldShowFieldError("email") ? "border-red-400" : "border-gray-200"
              }`}
            >
              <span className="material-symbols-outlined text-gray-400 text-base">mail</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={() => setFieldTouched("email")}
                placeholder="name@company.com"
                className="flex-1 text-sm text-[#0d1b2a] outline-none placeholder:text-gray-400 bg-transparent"
                autoComplete="email"
              />
            </div>
            {shouldShowFieldError("email") && <p className="text-xs text-red-500">{fieldErrors.email}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#0d1b2a]">Password</label>
            <div
              className={`flex items-center border rounded-lg px-3 py-3 gap-2 focus-within:border-[#0d1b2a] transition-colors ${
                hasPasswordError ? "border-red-400" : "border-gray-200"
              }`}
            >
              <span className="material-symbols-outlined text-gray-400 text-base">lock</span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                onBlur={() => setFieldTouched("password")}
                placeholder="Enter password"
                className="flex-1 text-sm text-[#0d1b2a] outline-none placeholder:text-gray-400 bg-transparent"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-gray-400 hover:text-[#0d1b2a] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined text-base">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
            {hasPasswordError ? (
              <div className="text-xs text-red-500 space-y-1">
                {fieldErrors.password && <p>{fieldErrors.password}</p>}
                {fieldErrors.passwordLength && <p>{fieldErrors.passwordLength}</p>}
                {fieldErrors.passwordSpecial && <p>{fieldErrors.passwordSpecial}</p>}
              </div>
            ) : (
              <p className="text-xs text-gray-400">
                Must be at least 8 characters and include at least 1 special character
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#0d1b2a]">Confirm Password</label>
            <div
              className={`flex items-center border rounded-lg px-3 py-3 gap-2 focus-within:border-[#0d1b2a] transition-colors ${
                shouldShowFieldError("confirmPassword") ? "border-red-400" : "border-gray-200"
              }`}
            >
              <span className="material-symbols-outlined text-gray-400 text-base">lock_reset</span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                onBlur={() => setFieldTouched("confirmPassword")}
                placeholder="Re-enter password"
                className="flex-1 text-sm text-[#0d1b2a] outline-none placeholder:text-gray-400 bg-transparent"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="text-gray-400 hover:text-[#0d1b2a] transition-colors"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                <span className="material-symbols-outlined text-base">
                  {showConfirmPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
            {shouldShowFieldError("confirmPassword") && (
              <p className="text-xs text-red-500">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="text-xs font-semibold text-[#0d1b2a]">Register as</legend>
            <input type="hidden" name="role" value={form.role} />
            <div
              ref={roleToggleRef}
              role="radiogroup"
              aria-label="Role selection"
              onPointerDown={handleRolePointerDown}
              onPointerMove={handleRolePointerMove}
              onPointerUp={handleRolePointerUp}
              onPointerCancel={handleRolePointerCancel}
              onBlur={() => setFieldTouched("role")}
              className={`relative flex w-full rounded-full border p-1 transition-colors touch-pan-x select-none focus-within:ring-2 focus-within:ring-[#0d1b2a]/20 ${
                shouldShowFieldError("role") ? "border-red-400" : "border-transparent"
              } bg-[#edf2f7]`}
            >
              <span
                aria-hidden="true"
                className="absolute left-1 top-1 bottom-1 rounded-full bg-[#0d1b2a]"
                style={{
                  width: "calc((100% - 8px) / 2)",
                  transform: `translateX(calc(${selectedRoleIndex * 100}% + ${roleDragOffset}px))`,
                  transition: isRoleDragging ? "none" : "transform 300ms ease",
                }}
              />
              {ROLE_OPTIONS.map((option, index) => {
                const isSelected = selectedRoleIndex === index;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => setRole(option.value)}
                    onKeyDown={handleRoleKeyDown}
                    className={`relative z-10 flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d1b2a] focus-visible:ring-offset-2 ${
                      isSelected ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{selectedRole.helper}</p>
            {shouldShowFieldError("role") && <p className="text-xs text-red-500">{fieldErrors.role}</p>}
          </fieldset>

          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                name="agreed"
                id="agreed"
                checked={form.agreed}
                onChange={handleChange}
                onBlur={() => setFieldTouched("agreed")}
                className="mt-0.5 w-4 h-4 accent-[#0d1b2a] cursor-pointer"
              />
              <label htmlFor="agreed" className="text-xs text-gray-600 cursor-pointer leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-[#0d1b2a] font-semibold underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#0d1b2a] font-semibold underline">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>
            {shouldShowFieldError("agreed") && <p className="text-xs text-red-500 ml-6">{fieldErrors.agreed}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full bg-[#0d1b2a] text-white py-3.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#1a2f4a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
          >
            {loading ? (
              "Creating Account..."
            ) : (
              <>
                Create Account <span className="material-symbols-outlined text-base">arrow_forward</span>
              </>
            )}
          </button>

          {error && <p className="text-xs text-red-500 -mt-2">{error}</p>}
          {success && <p className="text-xs text-green-600 -mt-2">{success}</p>}
        </form>
      </div>

      <p className="text-sm text-gray-500 pb-4">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#0d1b2a] hover:text-[#f5a623] transition-colors">
          Log in here
        </Link>
      </p>
    </div>
  );
}
