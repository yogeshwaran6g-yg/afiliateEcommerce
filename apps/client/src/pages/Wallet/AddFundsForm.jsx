import React, { useState } from "react";
import { useRechargeMutation } from "../../hooks/useWallet";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddFundsForm() {
  const navigate = useNavigate();
  const rechargeMutation = useRechargeMutation();
  const [formData, setFormData] = useState({
    amount: "",
    paymentMethod: "",
    paymentReference: "",
    payslip: null,
  });

  const [payslipPreview, setPayslipPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, payslip: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPayslipPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      newErrors.amount = "Valid amount is required";
    if (!formData.paymentMethod)
      newErrors.paymentMethod = "Please select a payment method";
    if (!formData.paymentReference)
      newErrors.paymentReference = "Transaction ID is required";
    if (!formData.payslip)
      newErrors.payslip = "Please upload a payment proof (payslip)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    data.append("amount", formData.amount);
    data.append("paymentMethod", formData.paymentMethod);
    data.append("paymentReference", formData.paymentReference);
    data.append("proof", formData.payslip);

    try {
      await rechargeMutation.mutateAsync(data);
      toast.success(
        "Funds request submitted successfully! An admin will review your payment shortly.",
      );
      navigate("/wallet");
    } catch (error) {
      toast.error(
        error.message || "Failed to submit payment request. Please try again.",
      );
    }
  };

  const InputLabel = ({ label, required }) => (
    <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 max-w-2xl mx-auto shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">
        Payment Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Field */}
        <div className="space-y-1.5">
          <InputLabel label="Amount to Add (₹)" required />
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
              ₹
            </span>
            <input
              type="number"
              name="amount"
              step="0.01"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="100.00"
              className={`w-full pl-8 pr-4 py-3 bg-slate-50 border ${errors.amount ? "border-red-300 ring-red-50" : "border-slate-200"} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-bold`}
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-red-500 font-medium mt-1">
              {errors.amount}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Payment Method Dropdown */}
          <div className="space-y-1.5">
            <InputLabel label="Payment Method" required />
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              className={`w-full px-4 py-2 bg-slate-50 border ${errors.paymentMethod ? "border-red-300" : "border-slate-200"} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-bold text-slate-700`}
              onChange={handleInputChange}
            >
              <option value="">Select Method</option>
              <option value="gpay">GPay</option>
              <option value="phonepe">PhonePe</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
            {errors.paymentMethod && (
              <p className="text-xs text-red-500 font-medium mt-1">
                {errors.paymentMethod}
              </p>
            )}
          </div>

          {/* Transaction ID */}
          <div className="space-y-1.5">
            <InputLabel label="Transaction ID" required />
            <input
              type="text"
              name="paymentReference"
              value={formData.paymentReference}
              placeholder="e.g. UPI12345678"
              className={`w-full px-4 py-2 bg-slate-50 border ${errors.paymentReference ? "border-red-300" : "border-slate-200"} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium`}
              onChange={handleInputChange}
            />
            {errors.paymentReference && (
              <p className="text-xs text-red-500 font-medium mt-1">
                {errors.paymentReference}
              </p>
            )}
          </div>
        </div>

        {/* Conditional Payment Details */}
        {formData.paymentMethod === "gpay" && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center animate-in slide-in-from-top-2 duration-300">
            <p className="text-sm font-bold text-slate-700 mb-3 text-center">
              Scan QR Code to pay via GPay
            </p>
            <div className="w-48 h-48 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mb-2 shadow-inner">
              <div className="text-slate-400 flex flex-col items-center">
                <span className="material-symbols-outlined text-5xl mb-1 text-primary">
                  qr_code_2
                </span>
                <span className="text-xs font-black tracking-widest text-slate-400">
                  GPAY QR CODE
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Merchant: AI Affiliate Ecom
            </p>
          </div>
        )}

        {formData.paymentMethod === "phonepe" && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center animate-in slide-in-from-top-2 duration-300">
            <p className="text-sm font-bold text-slate-700 mb-3 text-center">
              Scan QR Code to pay via PhonePe
            </p>
            <div className="w-48 h-48 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mb-2 shadow-inner">
              <div className="text-slate-400 flex flex-col items-center">
                <span className="material-symbols-outlined text-5xl mb-1 text-indigo-600">
                  qr_code_2
                </span>
                <span className="text-xs font-black tracking-widest text-indigo-600/50">
                  PHONEPE QR CODE
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Merchant: AI Affiliate Ecom
            </p>
          </div>
        )}

        {formData.paymentMethod === "bank_transfer" && (
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4 animate-in slide-in-from-top-2 duration-300 shadow-inner">
            <p className="text-sm font-bold text-slate-700 text-center">
              Bank Transfer Details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
              <div className="flex flex-col">
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                  Bank Name
                </span>
                <span className="font-bold text-slate-800">
                  State Bank of India
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                  IFSC Code
                </span>
                <span className="font-bold text-slate-800">SBIN0001234</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                  Account Number
                </span>
                <span className="font-bold text-slate-800 tracking-wider">
                  30012345678
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                  Account Type
                </span>
                <span className="font-bold text-slate-800">
                  Current Account
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Payslip Upload Field */}
        {formData.paymentMethod !== "" && (
          <div className="space-y-1.5 pt-2">
            <InputLabel label="Payment Proof (Screenshot)" required />
            <label
              htmlFor="payslip-upload"
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${errors.payslip ? "border-red-300 bg-red-50/30" : "border-slate-300 bg-slate-50"} border-dashed rounded-2xl hover:border-primary transition-all cursor-pointer relative group`}
            >
              <div className="space-y-1 text-center">
                {payslipPreview ? (
                  <div className="relative inline-block">
                    <img
                      src={payslipPreview}
                      alt="Preview"
                      className="mx-auto h-40 w-auto rounded-xl shadow-lg border-2 border-white"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setPayslipPreview(null);
                        setFormData((p) => ({ ...p, payslip: null }));
                      }}
                      className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-xl hover:bg-red-600 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">
                        close
                      </span>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative cursor-pointer bg-transparent rounded-md font-bold text-primary hover:text-primary/80 flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-slate-400 text-3xl">
                          cloud_upload
                        </span>
                      </div>
                      <span className="text-sm">
                        Click to upload screenshot
                      </span>
                      <input
                        id="payslip-upload"
                        type="file"
                        name="payslip"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">
                      PNG, JPG up to 10MB
                    </p>
                  </>
                )}
              </div>
            </label>
            {errors.payslip && (
              <p className="text-xs text-red-500 font-medium mt-1">
                {errors.payslip}
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={rechargeMutation.isPending}
          className={`w-full py-4 rounded-xl font-black text-white transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 ${
            rechargeMutation.isPending || !formData.paymentMethod
              ? "bg-slate-300 cursor-not-allowed shadow-none"
              : "bg-primary hover:bg-primary/90"
          }`}
        >
          {rechargeMutation.isPending ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Submitting...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined font-bold">
                verified_user
              </span>
              Submit Payment Details
            </>
          )}
        </button>
      </form>
    </div>
  );
}
