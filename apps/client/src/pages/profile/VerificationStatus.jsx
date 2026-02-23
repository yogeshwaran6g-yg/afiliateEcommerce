import React, { useState, useEffect, useContext } from "react";
import profileService from "../../services/profileService";
import { ProfileContext } from "../../context/ProfileContext";
import { toast } from "react-toastify";
import Skeleton from "../../components/ui/Skeleton";

export default function VerificationStatus({ section = "all" }) {
  const {
    profile,
    addresses,
    kycStatus,
    kycProgress,
    isLoading: contextLoading,
    refetchProfile,
    updateIdentity,
    updateAddress,
    updateBank,
  } = useContext(ProfileContext);

  const [editMode, setEditMode] = useState({
    identity: false,
    address: false,
    bank: false,
  });

  // Extracting data for easier access
  const identity = {
    idType: profile?.id_type || "",
    idNumber: profile?.id_number || "",
    docUrl: profile?.id_document_url || null,
    status: (profile?.identity_status || "NOT_SUBMITTED").toLowerCase(),
  };

  const address = {
    addressData: {
      address_line1: addresses[0]?.address_line1 || "",
      city: addresses[0]?.city || "",
      state: addresses[0]?.state || "",
      pincode: addresses[0]?.pincode || "",
      country: addresses[0]?.country || "India",
    },
    docUrl: profile?.address_document_url || null,
    status: (profile?.address_status || "NOT_SUBMITTED").toLowerCase(),
  };

  const bank = {
    bankData: {
      account_name: profile?.bank_account_name || "",
      bank_name: profile?.bank_name || "",
      account_number: profile?.bank_account_number || "",
      ifsc_code: profile?.bank_ifsc || "",
    },
    docUrl: profile?.bank_document_url || null,
    status: (profile?.bank_status || "NOT_SUBMITTED").toLowerCase(),
  };

  // State for forms
  const [identityForm, setIdentityForm] = useState({
    idType: identity.idType,
    idNumber: identity.idNumber,
    file: null,
  });
  const [addressForm, setAddressForm] = useState({
    ...address.addressData,
    file: null,
  });
  const [bankForm, setBankForm] = useState({ ...bank.bankData, file: null });
  const [uploadStatus, setUploadStatus] = useState({
    identity: "idle",
    address: "idle",
    bank: "idle",
  });

  // Sync forms with profile data when it loads
  useEffect(() => {
    if (profile) {
      setIdentityForm((prev) => ({
        ...prev,
        idType: profile.id_type || "",
        idNumber: profile.id_number || "",
      }));

      setBankForm((prev) => ({
        ...prev,
        account_name: profile.bank_account_name || "",
        bank_name: profile.bank_name || "",
        account_number: profile.bank_account_number || "",
        ifsc_code: profile.bank_ifsc || "",
      }));
    }

    if (addresses && addresses.length > 0) {
      const defaultAddr = addresses[0];
      setAddressForm((prev) => ({
        ...prev,
        address_line1: defaultAddr.address_line1 || "",
        city: defaultAddr.city || "",
        state: defaultAddr.state || "",
        pincode: defaultAddr.pincode || "",
        country: defaultAddr.country || "India",
      }));
    }
  }, [profile, addresses]);

  const toggleEdit = (key) => {
    setEditMode((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFileChange = (key, e) => {
    const file = e.target.files[0];
    if (key === "identity") setIdentityForm({ ...identityForm, file });
    if (key === "address") setAddressForm({ ...addressForm, file });
    if (key === "bank") setBankForm({ ...bankForm, file });
  };

  const handleSubmit = async (key, e) => {
    e.preventDefault();
    setUploadStatus((prev) => ({ ...prev, [key]: "uploading" }));
    try {
      if (key === "identity") {
        await updateIdentity({
          idType: identityForm.idType,
          idNumber: identityForm.idNumber,
          file: identityForm.file,
        });
      }
      if (key === "address") {
        const { file, ...addressData } = addressForm;
        await updateAddress({ addressData, file });
      }
      if (key === "bank") {
        const { file, ...bankData } = bankForm;
        await updateBank({ bankData, file });
      }

      toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} submitted successfully!`);
      setEditMode((prev) => ({ ...prev, [key]: false }));
      await refetchProfile();
    } catch (error) {
      toast.error(`Update failed: ${error.message}`);
    } finally {
      setUploadStatus((prev) => ({ ...prev, [key]: "idle" }));
    }
  };

  const renderStatusIcon = (status) => {
    if (status === "verified")
      return (
        <span className="material-symbols-outlined text-emerald-500">
          check_circle
        </span>
      );
    return (
      <span className="material-symbols-outlined text-orange-400">
        schedule
      </span>
    );
  };

  if (contextLoading && !profile) {
    if (section === "summary") {
      return (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <Skeleton width="40%" height="24px" className="mb-6" />
          <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <Skeleton variant="circular" width="48px" height="48px" className="rounded-xl" />
              <div className="space-y-2">
                <Skeleton width="120px" height="16px" />
                <Skeleton width="60px" height="12px" />
              </div>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton variant="circular" width="24px" height="24px" />
                    <div className="space-y-2">
                      <Skeleton width="80px" height="14px" />
                      <Skeleton width="60px" height="10px" />
                    </div>
                  </div>
                  <Skeleton width="50px" height="14px" />
                </div>
              ))}
            </div>
            <Skeleton width="100%" height="6px" className="mt-8 rounded-full" />
          </div>
        </div>
      );
    }
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <Skeleton width="50%" height="28px" />
        </div>
        <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton width="40%" height="12px" />
              <Skeleton width="80%" height="16px" />
            </div>
            <div className="space-y-2">
              <Skeleton width="40%" height="12px" />
              <Skeleton width="80%" height="16px" />
            </div>
          </div>
          <Skeleton width="100%" height="20px" />
        </div>
      </div>
    );
  }

  const renderSummarySection = () => (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-6">
        Verification Status
      </h3>
      <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">
              fact_check
            </span>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">
              Verification Status
            </h4>
            <p className="text-xs text-slate-500 font-medium">3 steps</p>
          </div>
        </div>

        <div className="space-y-4 relative">
          {/* Vertical line connector */}
          <div className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-slate-100"></div>

          {[
            { label: "Identity", status: identity.status },
            { label: "Address", status: address.status },
            { label: "Bank", status: bank.status },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between relative z-10 group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center bg-white border-2 ${item.status === "verified" ? "border-emerald-500" : "border-orange-400"}`}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${item.status === "verified" ? "bg-emerald-500" : "bg-orange-400"}`}
                  ></div>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 leading-none mb-1">
                    {item.label}
                  </p>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                    {item.status.replace("_", " ")}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-400 capitalize">
                {item.status === "verified" ? "Verified" : "Pending"}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary ease-out duration-500 transition-all rounded-full shadow-[0_0_8px_rgba(37,99,235,0.3)]"
              style={{ width: `${kycProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIdentitySection = () => (
    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900">Identity Document</h3>
        {(identity.status === "verified" || identity.status === "pending") &&
          !editMode.identity && (
            <button
              onClick={() => toggleEdit("identity")}
              className="p-2 text-slate-400 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-xl">edit</span>
            </button>
          )}
      </div>

      {!editMode.identity &&
        (identity.status === "verified" || identity.status === "pending") ? (
        <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                ID Type
              </p>
              <p className="text-slate-900 font-bold">{identity.idType}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                ID Number
              </p>
              <p className="text-slate-900 font-bold">{identity.idNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <span className="material-symbols-outlined text-lg">
              description
            </span>
            <span>Document Uploaded</span>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => handleSubmit("identity", e)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
                ID Type
              </label>
              <select
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                value={identityForm.idType}
                onChange={(e) =>
                  setIdentityForm({ ...identityForm, idType: e.target.value })
                }
                required
              >
                <option value="">Select document type</option>
                <option value="Aadhar Card">Aadhar Card</option>
                <option value="Pan Card">Pan Card</option>
                <option value="Passport">Passport</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
                ID Number
              </label>
              <input
                type="text"
                placeholder="Enter ID number"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                value={identityForm.idNumber}
                onChange={(e) =>
                  setIdentityForm({ ...identityForm, idNumber: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="border-2 border-dashed border-slate-100 bg-slate-50/30 rounded-2xl p-10 text-center hover:bg-slate-50/50 transition-all cursor-pointer relative group">
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => handleFileChange("identity", e)}
              required={!identity.docUrl}
            />
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2 group-hover:text-primary transition-colors">
              cloud_upload
            </span>
            <p className="text-sm font-bold text-slate-600">
              {identityForm.file
                ? identityForm.file.name
                : "Drag and drop file here, or Browse"}
            </p>
          </div>
          <button
            type="submit"
            disabled={uploadStatus.identity === "uploading"}
            className="w-full bg-[#0F172A] text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-70"
          >
            {uploadStatus.identity === "uploading"
              ? "Submitting..."
              : "Submit Identity"}
          </button>
          {editMode.identity && (
            <button
              type="button"
              onClick={() => toggleEdit("identity")}
              className="w-full text-slate-500 font-bold text-sm py-2"
            >
              Cancel
            </button>
          )}
        </form>
      )}
    </div>
  );

  const renderAddressSection = () => (
    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900">Proof of Residence</h3>
        {(address.status === "verified" || address.status === "pending") &&
          !editMode.address && (
            <button
              onClick={() => toggleEdit("address")}
              className="p-2 text-slate-400 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-xl">edit</span>
            </button>
          )}
      </div>

      {!editMode.address &&
        (address.status === "verified" || address.status === "pending") ? (
        <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="col-span-2">
              <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                Address Line 1
              </p>
              <p className="text-slate-900 font-bold">
                {address.addressData.address_line1}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                City
              </p>
              <p className="text-slate-900 font-bold">
                {address.addressData.city}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                State
              </p>
              <p className="text-slate-900 font-bold">
                {address.addressData.state}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                Pincode
              </p>
              <p className="text-slate-900 font-bold">
                {address.addressData.pincode}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                Country
              </p>
              <p className="text-slate-900 font-bold">
                {address.addressData.country}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <span className="material-symbols-outlined text-lg">
              description
            </span>
            <span>Proof of Address Uploaded</span>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => handleSubmit("address", e)}
          className="space-y-4"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
                Address Line 1
              </label>
              <input
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                placeholder="House no, Street name"
                value={addressForm.address_line1}
                onChange={(e) =>
                  setAddressForm({
                    ...addressForm,
                    address_line1: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
                  City
                </label>
                <input
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  placeholder="City"
                  value={addressForm.city}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, city: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
                  State
                </label>
                <input
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  placeholder="State"
                  value={addressForm.state}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, state: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
                  Pincode
                </label>
                <input
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  placeholder="Pincode"
                  value={addressForm.pincode}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, pincode: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
                  Country
                </label>
                <input
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  placeholder="Country"
                  value={addressForm.country}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, country: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>
          <div className="border-2 border-dashed border-slate-100 bg-slate-50/30 rounded-2xl p-10 text-center hover:bg-slate-50/50 transition-all cursor-pointer relative group">
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => handleFileChange("address", e)}
              required={!address.docUrl}
            />
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2 group-hover:text-primary transition-colors">
              cloud_upload
            </span>
            <p className="text-sm font-bold text-slate-600">
              {addressForm.file
                ? addressForm.file.name
                : "Drag and drop file here, or Browse"}
            </p>
          </div>
          <button
            type="submit"
            disabled={uploadStatus.address === "uploading"}
            className="w-full bg-[#0F172A] text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-70"
          >
            {uploadStatus.address === "uploading"
              ? "Submitting..."
              : "Submit Proof of Address"}
          </button>
          {editMode.address && (
            <button
              type="button"
              onClick={() => toggleEdit("address")}
              className="w-full text-slate-500 font-bold text-sm py-2"
            >
              Cancel
            </button>
          )}
        </form>
      )}
    </div>
  );

  const renderBankSection = () => (
    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900">Bank Verification</h3>
        {(bank.status === "verified" || bank.status === "pending") &&
          !editMode.bank && (
            <button
              onClick={() => toggleEdit("bank")}
              className="p-2 text-slate-400 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-xl">edit</span>
            </button>
          )}
      </div>

      {!editMode.bank &&
        (bank.status === "verified" || bank.status === "pending") ? (
        <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                Account Holder Name
              </p>
              <p className="text-slate-900 font-bold">
                {bank.bankData.account_name}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                Bank Name
              </p>
              <p className="text-slate-900 font-bold">
                {bank.bankData.bank_name}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                Account Number
              </p>
              <p className="text-slate-900 font-bold">
                {bank.bankData.account_number}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                IFSC/Swift Code
              </p>
              <p className="text-slate-900 font-bold">
                {bank.bankData.ifsc_code}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <span className="material-symbols-outlined text-lg">
              description
            </span>
            <span>Bank Statement Uploaded</span>
          </div>
        </div>
      ) : (
        <form onSubmit={(e) => handleSubmit("bank", e)} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
                Account Holder Name
              </label>
              <input
                type="text"
                placeholder="Enter account holder name"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                value={bankForm.account_name}
                onChange={(e) =>
                  setBankForm({ ...bankForm, account_name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
                Bank Name
              </label>
              <select
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                value={bankForm.bank_name}
                onChange={(e) =>
                  setBankForm({ ...bankForm, bank_name: e.target.value })
                }
                required
              >
                <option value="">Select bank</option>
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="SBI">SBI</option>
                <option value="ICICI Bank">ICICI Bank</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
                Account Number
              </label>
              <input
                type="text"
                placeholder="Enter account number"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                value={bankForm.account_number}
                onChange={(e) =>
                  setBankForm({ ...bankForm, account_number: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
                IFSC or Swift Code
              </label>
              <input
                type="text"
                placeholder="Enter IFSC or Swift code"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                value={bankForm.ifsc_code}
                onChange={(e) =>
                  setBankForm({ ...bankForm, ifsc_code: e.target.value })
                }
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={uploadStatus.bank === "uploading"}
            className="w-full bg-[#0F172A] text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-70"
          >
            {uploadStatus.bank === "uploading"
              ? "Submitting..."
              : "Submit Bank Details"}
          </button>
          {editMode.bank && (
            <button
              type="button"
              onClick={() => toggleEdit("bank")}
              className="w-full text-slate-500 font-bold text-sm py-2"
            >
              Cancel
            </button>
          )}
        </form>
      )}
    </div>
  );

  if (section === "summary") return renderSummarySection();
  if (section === "identity") return renderIdentitySection();
  if (section === "address") return renderAddressSection();
  if (section === "bank") return renderBankSection();

  return (
    <div className="space-y-8">
      {renderSummarySection()}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {renderIdentitySection()}
        {renderAddressSection()}
        {renderBankSection()}
      </div>
      <p className="text-xs text-center text-slate-500 mt-8 pt-6 border-t border-slate-100">
        By submitting, you agree to our{" "}
        <a href="#" className="text-primary hover:underline font-medium">
          Terms of Verification
        </a>
        . Your data is securely stored.
      </p>
    </div>
  );
}
