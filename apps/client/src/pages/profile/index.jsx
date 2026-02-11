import React, { useState, useContext, useEffect } from "react";
import { ProfileContext } from "../../context/ProfileContext";
import PersonalDetails from "./sections/PersonalDetails";
import IdentityVerification from "./sections/IdentityVerification";
import AddressVerification from "./sections/AddressVerification";
import BankDetails from "./sections/BankDetails";
import KycSummary from "./sections/KycSummary";

export default function Profile() {
    const { 
        user, 
        profile, 
        addresses, 
        kycStatus,
        overallKycStatus,
        kycProgress,
        isLoading, 
        updateProfile,
        updateIdentity,
        updateAddress,
        updateBank
    } = useContext(ProfileContext);

    const [sectionsData, setSectionsData] = useState({
        personal: {
            name: "",
            email: "",
            phone: "",
            dob: "",
            profile_image: ""
        },
        identity: {
            idType: "",
            idNumber: "",
            identityFile: null
        },
        address: {
            address_line1: "",
            city: "",
            state: "",
            pincode: "",
            country: "",
            addressFile: null
        },
        bank: {
            account_name: "",
            bank_name: "",
            account_number: "",
            ifsc_code: "",
            bankFile: null
        }
    });

    const [isUpdating, setIsUpdating] = useState({
        personal: false,
        identity: false,
        address: false,
        bank: false
    });

    useEffect(() => {
        if (user) {
            const defaultAddress = addresses?.find(a => a.is_default) || addresses?.[0] || {};
            setSectionsData(prev => ({
                ...prev,
                personal: {
                    ...prev.personal,
                    name: user.name || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    dob: profile?.dob || "",
                    profile_image: profile?.profile_image || ""
                },
                identity: {
                    ...prev.identity,
                    idType: profile?.id_type || "",
                    idNumber: profile?.id_number || ""
                },
                address: {
                    ...prev.address,
                    address_line1: defaultAddress.address_line1 || "",
                    city: defaultAddress.city || "",
                    state: defaultAddress.state || "",
                    pincode: defaultAddress.pincode || "",
                    country: defaultAddress.country || ""
                },
                bank: {
                    ...prev.bank,
                    account_name: profile?.bank_account_name || "",
                    bank_name: profile?.bank_name || "",
                    account_number: profile?.bank_account_number || "",
                    ifsc_code: profile?.bank_ifsc || ""
                }
            }));
        }
    }, [user, profile, addresses]);

    const handleSectionChange = (section, e) => {
        const { name, value } = e.target;
        setSectionsData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [name]: value
            }
        }));
    };

    const handleFileChange = (section, file) => {
        setSectionsData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [`${section}File`]: file
            }
        }));
    };

    const handleUpdate = async (section) => {
        setIsUpdating(prev => ({ ...prev, [section]: true }));
        try {
            switch (section) {
                case 'personal':
                    await updateProfile({
                        profile: {
                            dob: sectionsData.personal.dob,
                            profile_image: sectionsData.personal.profile_image
                        },
                        name: sectionsData.personal.name,
                        phone: sectionsData.personal.phone
                    });
                    break;
                case 'identity':
                    await updateIdentity({
                        idType: sectionsData.identity.idType,
                        idNumber: sectionsData.identity.idNumber,
                        file: sectionsData.identity.identityFile
                    });
                    break;
                case 'address':
                    await updateAddress({
                        addressData: {
                            address_line1: sectionsData.address.address_line1,
                            city: sectionsData.address.city,
                            state: sectionsData.address.state,
                            pincode: sectionsData.address.pincode,
                            country: sectionsData.address.country
                        },
                        file: sectionsData.address.addressFile
                    });
                    break;
                case 'bank':
                    await updateBank({
                        bankData: {
                            account_name: sectionsData.bank.account_name,
                            bank_name: sectionsData.bank.bank_name,
                            account_number: sectionsData.bank.account_number,
                            ifsc_code: sectionsData.bank.ifsc_code
                        },
                        file: sectionsData.bank.bankFile
                    });
                    break;
                default:
                    break;
            }
            alert(`${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully!`);
        } catch (error) {
            alert(`Failed to update ${section}: ${error.message || "Unknown error"}`);
        } finally {
            setIsUpdating(prev => ({ ...prev, [section]: false }));
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
                <a href="/dashboard" className="hover:text-primary">Dashboard</a>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <span className="text-slate-900 font-medium">Profile & KYC</span>
            </div>

            {/* Page Header */}
            <div className="mb-8 md:mb-12">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">Account verification</h1>
                <p className="text-slate-500 max-w-2xl leading-relaxed">
                    Complete your profile and identity verification to unlock full platform features including withdrawals and higher transaction limits.
                </p>
            </div>

            <div className="space-y-8 md:space-y-12">
                <PersonalDetails 
                    data={sectionsData.personal} 
                    onChange={(e) => handleSectionChange('personal', e)}
                    onUpdate={handleUpdate}
                    isUpdating={isUpdating.personal}
                />

                <IdentityVerification 
                    data={sectionsData.identity}
                    status={kycStatus.identity}
                    onChange={(e) => handleSectionChange('identity', e)}
                    onFileChange={handleFileChange}
                    onUpdate={handleUpdate}
                    isUpdating={isUpdating.identity}
                />

                <AddressVerification 
                    data={sectionsData.address}
                    status={kycStatus.address}
                    onChange={(e) => handleSectionChange('address', e)}
                    onFileChange={handleFileChange}
                    onUpdate={handleUpdate}
                    isUpdating={isUpdating.address}
                />

                <BankDetails 
                    data={sectionsData.bank}
                    status={kycStatus.bank}
                    onChange={(e) => handleSectionChange('bank', e)}
                    onFileChange={handleFileChange}
                    onUpdate={handleUpdate}
                    isUpdating={isUpdating.bank}
                />

                <KycSummary 
                    status={overallKycStatus}
                    progress={kycProgress}
                    canWithdraw={overallKycStatus === 'VERIFIED'}
                />
            </div>

            <footer className="mt-20 py-8 border-t border-slate-200">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
                    <div>© 2024 Affiliate Ecommerce. Secure KYC Verification.</div>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms</a>
                        <a href="#" className="hover:text-primary transition-colors">Help</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
