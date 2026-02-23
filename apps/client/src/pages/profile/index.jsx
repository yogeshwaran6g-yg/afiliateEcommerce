import React, { useState, useContext, useEffect } from "react";
import { ProfileContext } from "../../context/ProfileContext";
import { toast } from "react-toastify";
import PersonalDetails from "./sections/PersonalDetails";
import VerificationStatus from "./VerificationStatus";

import { useNavigate } from "react-router-dom";
export default function Profile() {
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


  // Full page spinner removed, components handle loading internally

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

        </div>
      </div>

    </div>
  );
}
