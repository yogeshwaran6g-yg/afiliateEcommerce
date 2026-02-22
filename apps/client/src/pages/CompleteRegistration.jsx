import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUser,
} from "../services/authApiService";
import { toast } from "react-toastify";

import PersonalInfoSection from "./registration/components/PersonalInfoSection";
import ProductSelectionSection from "./registration/components/ProductSelectionSection";
import ShippingAddressSection from "./registration/components/ShippingAddressSection";
import PaymentSection from "./registration/components/PaymentSection";
import ProofUploadSection from "./registration/components/ProofUploadSection";

// Refactored components and utils
import RegistrationHeader from "./registration/components/RegistrationHeader";
import RegistrationSubmitButton from "./registration/components/RegistrationSubmitButton";
import { validateField, validateRegistrationForm } from "./registration/utils/validation";

// Hooks
import { useGetProducts } from "../hooks/useProductService";
import { useCompleteRegistrationMutation, useLogoutMutation } from "../hooks/useAuthService";

export default function CompleteRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: 91,
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    selectedProduct: null,
    paymentType: "",
    proof: null,
  });

  // Hooks usage
  const { data: productsData, isLoading: productsLoading, error: productsError } = useGetProducts();
  const completeRegMutation = useCompleteRegistrationMutation();
  const logoutMutation = useLogoutMutation();

  const [proofPreview, setProofPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || !user.is_phone_verified) {
      toast.warning("Please verify your mobile number first.");
      navigate("/signup");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (productsError) {
      setError("Failed to load products. Please refresh the page.");
    }
  }, [productsError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear global error when user starts typing
    if (error) setError("");

    // Field validation using extracted logic
    const fieldError = validateField(name, value, { ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleProductChange = (e) => {
    const productId = parseInt(e.target.value);
    const products = productsData?.data || [];
    const product = products.find((p) => p.id === productId);
    setFormData((prev) => ({ ...prev, selectedProduct: product || null }));
    setErrors((prev) => ({ ...prev, product: "" }));
  };

  const handleProofChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileName = (file.name || "").toLowerCase();
      const fileType = (file.type || "").toLowerCase();

      // Allow based on MIME type or Extension (safer for some OS/Browsers)
      const allowedExtensions = [".jpg", ".jpeg", ".png"];
      const isAllowedExtension = allowedExtensions.some((ext) =>
        fileName.endsWith(ext),
      );
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/pjpeg",
        "image/x-png",
      ];
      const isAllowedType = allowedTypes.includes(fileType);

      if (!isAllowedType && !isAllowedExtension) {
        toast.error(
          `Invalid file format (${fileName}). Only JPG, JPEG, and PNG images are allowed.`,
        );
        e.target.value = "";
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error(
          `File too large: ${(file.size / (1024 * 1024)).toFixed(2)}MB. Maximum size is 2MB.`,
        );
        e.target.value = "";
        return;
      }

      setFormData((prev) => ({ ...prev, proof: file }));
      setErrors((prev) => ({ ...prev, proof: "" }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProof = () => {
    setFormData((prev) => ({ ...prev, proof: null }));
    setProofPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formErrors = validateRegistrationForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setError("Please correct the highlighted errors before submitting.");
      return;
    }

    try {
      const registrationData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        selectedProductId: formData.selectedProduct.id,
        paymentMethod: "MANUAL", // New users always pay manually
        paymentType: formData.paymentType,
        proof: formData.proof,
      };

      const response = await completeRegMutation.mutateAsync(registrationData);

      if (response.success) {
        setIsSubmitting(true);
        toast.success(
          "Registration completed and activation order created! Your account is under review.",
        );
        await logoutMutation.mutateAsync();
        navigate("/login");
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      setError(
        err.message ||
          "An error occurred during registration. Please try again.",
      );
    }
  };

  const products = productsData?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-12 px-4 sm:px-6 lg:px-8 font-display">
      <div className="max-w-5xl mx-auto">
        <RegistrationHeader />

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
            {(error || completeRegMutation.error) && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3 animate-shake">
                <span className="material-symbols-outlined">error</span>
                {error || completeRegMutation.error?.message}
              </div>
            )}

            <PersonalInfoSection
              formData={formData}
              handleInputChange={handleInputChange}
              errors={errors}
            />

            <div className="border-t border-slate-100"></div>

            <ProductSelectionSection
              products={products}
              selectedProduct={formData.selectedProduct}
              handleProductChange={handleProductChange}
              errors={errors}
              loading={productsLoading}
            />

            <div className="border-t border-slate-100"></div>

            <ShippingAddressSection
              formData={formData}
              handleInputChange={handleInputChange}
              errors={errors}
            />

            <div className="border-t border-slate-100"></div>

            <PaymentSection
              paymentType={formData.paymentType}
              setPaymentType={(type) => {
                setFormData((prev) => ({ ...prev, paymentType: type }));
                setErrors((prev) => ({ ...prev, paymentType: "" }));
              }}
              errors={errors}
            />

            <div className="border-t border-slate-100"></div>

            <ProofUploadSection
              proofPreview={proofPreview}
              handleProofChange={handleProofChange}
              removeProof={removeProof}
              errors={errors}
            />

            <RegistrationSubmitButton loading={completeRegMutation.isPending} />
          </form>
        </div>
      </div>
    </div>
  );
}
