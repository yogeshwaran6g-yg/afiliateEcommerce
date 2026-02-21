import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { completeRegistration, getCurrentUser, logout, cancelRegistration } from '../services/authApiService';
import { getProducts } from '../services/productService';
import { toast } from 'react-toastify';

import PersonalInfoSection from './registration/components/PersonalInfoSection';
import ProductSelectionSection from './registration/components/ProductSelectionSection';
import ShippingAddressSection from './registration/components/ShippingAddressSection';
import PaymentSection from './registration/components/PaymentSection';
import ProofUploadSection from './registration/components/ProofUploadSection';

export default function CompleteRegistration() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        countryCode: '+91',
        password: '',
        confirmPassword: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        selectedProduct: null,
        paymentType: '',
        proof: null
    });

    const [products, setProducts] = useState([]);
    const [proofPreview, setProofPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [productsLoading, setProductsLoading] = useState(true);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const user = getCurrentUser();
        if (!user || !user.is_phone_verified) {
            toast.warning('Please verify your mobile number first.');
            navigate('/signup');
            return;
        }

        // Fetch real products
        const fetchProducts = async () => {
            try {
                const response = await getProducts();
                if (response.success) {
                    setProducts(response.data);
                } else {
                    setError('Failed to load products');
                }
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please refresh the page.');
            } finally {
                setProductsLoading(false);
            }
        };

        fetchProducts();
    }, [navigate]);

    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case "firstName":
                if (!value.trim()) error = "First name is required";
                break;
            case "lastName":
                if (!value.trim()) error = "Last name is required";
                break;
            case "email":
                if (!value.trim()) {
                    error = "Email is required";
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    error = "Email is invalid";
                }
                break;
            case "password":
                if (!value) {
                    error = "Password is required";
                } else if (value.length < 6) {
                    error = "Password must be at least 6 characters";
                }
                break;
            case "confirmPassword":
                if (value !== formData.password) {
                    error = "Passwords do not match";
                }
                break;
            case "address":
                if (!value.trim()) error = "Street address is required";
                break;
            case "city":
                if (!value.trim()) error = "City is required";
                break;
            case "state":
                if (!value.trim()) error = "State is required";
                break;
            case "pincode":
                if (!value.trim()) {
                    error = "Pincode is required";
                } else if (!/^\d{6}$/.test(value)) {
                    error = "Pincode must be 6 digits";
                }
                break;
            default:
                break;
        }
        return error;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear global error when user starts typing
        if (error) setError('');

        // Field validation
        const fieldError = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: fieldError }));
    };

    const handleProductChange = (e) => {
        const productId = parseInt(e.target.value);
        const product = products.find(p => p.id === productId);
        setFormData(prev => ({ ...prev, selectedProduct: product || null }));
        setErrors(prev => ({ ...prev, product: "" }));
    };

    const handleProofChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileName = (file.name || "").toLowerCase();
            const fileType = (file.type || "").toLowerCase();

            // Allow based on MIME type or Extension (safer for some OS/Browsers)
            const allowedExtensions = ['.jpg', '.jpeg', '.png'];
            const isAllowedExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/pjpeg', 'image/x-png'];
            const isAllowedType = allowedTypes.includes(fileType);

            if (!isAllowedType && !isAllowedExtension) {
                toast.error(`Invalid file format (${fileName}). Only JPG, JPEG, and PNG images are allowed.`);
                e.target.value = '';
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                toast.error(`File too large: ${(file.size / (1024 * 1024)).toFixed(2)}MB. Maximum size is 2MB.`);
                e.target.value = '';
                return;
            }

            setFormData(prev => ({ ...prev, proof: file }));
            setErrors(prev => ({ ...prev, proof: "" }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setProofPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeProof = () => {
        setFormData(prev => ({ ...prev, proof: null }));
        setProofPreview(null);
    };

    const validateForm = () => {
        const newErrors = {};

        // Personal Info
        ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'address', 'city', 'state', 'pincode'].forEach(field => {
            const err = validateField(field, formData[field]);
            if (err) newErrors[field] = err;
        });

        // Product
        if (!formData.selectedProduct) {
            newErrors.product = "Please select a package";
        }

        // Payment
        if (!formData.paymentType) {
            newErrors.paymentType = "Please select a payment method";
        }

        // Proof
        if (!formData.proof) {
            newErrors.proof = "Account cannot be activated without payment proof screenshot";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            setError('Please correct the highlighted errors before submitting.');
            return;
        }

        setLoading(true);
        try {
            const registrationData = {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                password: formData.password,
                shippingAddress: {
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode
                },
                selectedProductId: formData.selectedProduct.id,
                paymentMethod: 'MANUAL', // New users always pay manually
                paymentType: formData.paymentType,
                proof: formData.proof
            };

            const response = await completeRegistration(registrationData);

            if (response.success) {
                setIsSubmitting(true);
                toast.success('Registration completed and activation order created! Your account is under review.');
                logout(); // Still logout to clear session, but setIsSubmitting(true) prevents cleanup effect
                navigate('/login');
            } else {
                setError(response.message || 'Registration failed');
            }
        } catch (err) {
            console.error('Registration failed:', err);
            setError(err.message || 'An error occurred during registration. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-12 px-4 sm:px-6 lg:px-8 font-display">
            <div className="max-w-5xl mx-auto">
                {/* Header Card */}
                <div className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 rounded-3xl shadow-2xl overflow-hidden mb-8 relative">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
                    <div className="relative p-10 text-center text-white">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 shadow-lg">
                            <span className="material-symbols-outlined text-5xl">person_add</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">Complete Your Profile</h1>
                        <p className="text-lg opacity-95 font-medium max-w-2xl mx-auto">Join our exclusive network and unlock unlimited earning potential</p>
                    </div>
                </div>

                {/* Main Form Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3 animate-shake">
                                <span className="material-symbols-outlined">error</span>
                                {error}
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
                                setFormData(prev => ({ ...prev, paymentType: type }));
                                setErrors(prev => ({ ...prev, paymentType: "" }));
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

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-5 bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-white text-xl font-black rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden group ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <span>Complete Registration</span>
                                            <span className="material-symbols-outlined text-2xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                        </>
                                    )}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
