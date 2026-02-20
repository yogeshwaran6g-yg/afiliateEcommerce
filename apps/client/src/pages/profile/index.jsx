import React, { useState, useContext, useEffect } from "react";
import { ProfileContext } from "../../context/ProfileContext";
import { toast } from "react-toastify";
import PersonalDetails from "./sections/PersonalDetails";
import VerificationStatus from "./VerificationStatus";

import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../../hooks/useAuthService";

export default function Profile() {
  const navigate = useNavigate();
  const forgotPasswordMutation = useForgotPasswordMutation();
  const { user, profile, isLoading, updateProfile } =
    useContext(ProfileContext);

  const [personalData, setPersonalData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    profile_image: "",
  });

  const [isUpdatingPersonal, setIsUpdatingPersonal] = useState(false);

  useEffect(() => {
    if (user) {
      setPersonalData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dob: profile?.dob || "",
        profile_image: profile?.profile_image || "",
      });
    }
  }, [user, profile]);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdatePersonal = async (file) => {
    setIsUpdatingPersonal(true);
    try {
      await updateProfile({
        data: {
          profile: {
            dob: personalData.dob,
            profile_image: personalData.profile_image,
          },
          name: personalData.name,
          email: personalData.email,
          phone: personalData.phone,
        },
        file: file,
      });
      toast.success(`Personal details updated successfully!`);
    } catch (error) {
      toast.error(
        `Failed to update personal details: ${error.message || "Unknown error"}`,
      );
    } finally {
      setIsUpdatingPersonal(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.phone) {
      toast.error("Phone number not found. Please update your profile first.");
      return;
    }

    try {
      const result = await forgotPasswordMutation.mutateAsync(user.phone);
      if (result.success) {
        toast.success("Security code sent successfully!");
        navigate("/reset-password", {
          state: {
            userId: result.data.userId,
            phone: user.phone,
          },
        });
      }
    } catch (error) {
      toast.error(
        error.message || "Failed to initiate password reset. Please try again.",
      );
    }
  };

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-4 md:py-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 mb-6">
        <a href="/dashboard" className="hover:text-primary">
          Dashboard
        </a>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-slate-900 font-medium">Profile & KYC</span>
      </div>

      {/* Page Header */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Account verification
        </h1>
        <p className="text-slate-500 max-w-2xl leading-relaxed mt-2">
          To fully access all features, please complete the identity
          verification process below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Personal, Identity, Address */}
        <div className="lg:col-span-7 space-y-8">
          <PersonalDetails
            data={personalData}
            onChange={handlePersonalChange}
            onUpdate={handleUpdatePersonal}
            isUpdating={isUpdatingPersonal}
            isLoading={isLoading}
          />

          <VerificationStatus section="identity" />

          <VerificationStatus section="address" />
        </div>

        {/* Right Column: Status Summary, Bank */}
        <div className="lg:col-span-5 space-y-8">
          <VerificationStatus section="summary" />

          <VerificationStatus section="bank" />

          {/* Account Security */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <span className="material-symbols-outlined">security</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Account Security
              </h3>
            </div>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Protect your account by regularly updating your password. We will
              send a secure code to your registered mobile number
              <span className="font-semibold text-slate-800 ml-1">
                {user?.phone ? `(***-***-${user.phone.slice(-4)})` : ""}
              </span>
              .
            </p>
            <button
              onClick={handleResetPassword}
              disabled={forgotPasswordMutation.isPending}
              className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3.5 rounded-2xl border border-slate-200 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {forgotPasswordMutation.isPending ? (
                <>
                  <div className="size-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                  <span>Sending Code...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xl">
                    lock_reset
                  </span>
                  <span>Reset Password</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-20 py-8 border-t border-slate-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <div>© 2024 Affiliate Ecommerce. Secure KYC Verification.</div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Help
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
