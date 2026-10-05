import React, { useState } from "react";
import { User, Mail, Lock, CheckCircle2, AlertCircle, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/userService";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage("");
    if (successMessage) setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMessage("Name and email cannot be empty.");
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setErrorMessage("New password must be at least 6 characters.");
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        ...(formData.password && { password: formData.password }),
      };

      const res = await userService.updateProfile(payload);
      if (res.success && res.data?.user) {
        updateUser(res.data.user);
        setSuccessMessage("Profile updated successfully!");
        setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const formattedJoinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Account Settings
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Manage your personal profile and account credentials.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-700 font-extrabold text-xl flex items-center justify-center border-2 border-brand-200 flex-shrink-0">
          {user?.name
            ? user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .substring(0, 2)
            : "U"}
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
          <p className="text-xs text-slate-500">{user?.email}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Member since: {formattedJoinedDate}
          </p>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
          Update Profile Information
        </h3>

        {successMessage && (
          <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-3 text-sm">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            required
            icon={User}
            value={formData.name}
            onChange={handleChange}
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            required
            icon={Mail}
            value={formData.email}
            onChange={handleChange}
          />

          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Change Password (Optional)
            </h4>

            <Input
              label="New Password"
              name="password"
              type="password"
              placeholder="Leave blank to keep existing password"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
            />

            {formData.password && (
              <Input
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter new password"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              icon={Save}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
