import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import walletService from "../services/walletService";
import orderService from "../services/orderService";
import profileService from "../services/profileService";
import { toast } from "react-toastify";

export default function Checkout() {
    const navigate = useNavigate();
    const { cartItems, subtotal, total, shipping, isLoading: cartLoading, clearCart } = useCart();

    const [selectedAddress, setSelectedAddress] = useState("profile");
    const [paymentMethod, setPaymentMethod] = useState("wallet"); // 'wallet' or 'direct'
    const [paymentType, setPaymentType] = useState("UPI"); // 'UPI' or 'BANK'
    const [walletStats, setWalletStats] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [proofFile, setProofFile] = useState(null);
    const [proofPreview, setProofPreview] = useState(null);
    const [transactionReference, setTransactionReference] = useState("");
    const [saveToProfile, setSaveToProfile] = useState(false);

    // Form state for custom address
    const [customAddress, setCustomAddress] = useState({
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        pincode: "",
        country: "India"
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [walletRes, profileRes] = await Promise.all([
                    walletService.getWallet(),
                    profileService.getProfile()
                ]);

                if (walletRes.success) {
                    setWalletStats(walletRes.data);
                }

                if (profileRes.success) {
                    setProfile(profileRes.data);
                    // If user has an address, select "profile" as default
                    if (profileRes.data.addresses && profileRes.data.addresses.length > 0) {
                        setSelectedAddress("profile");
                    } else {
                        setSelectedAddress("custom");
                    }
                }
            } catch (error) {
                console.error("Error fetching checkout data:", error);
            }
        };
        fetchData();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProofFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProofPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCustomAddressChange = (e) => {
        const { name, value } = e.target;
        setCustomAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (cartItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        let shippingAddressData = null;

        if (selectedAddress === "profile") {
            const defaultAddress = profile?.addresses?.find(a => a.is_default) || profile?.addresses?.[0];
            if (!defaultAddress) {
                toast.error("No saved address found. Please enter a new address.");
                setSelectedAddress("custom");
                return;
            }
            shippingAddressData = {
                type: "SAVED",
                address: `${defaultAddress.address_line1}${defaultAddress.address_line2 ? ', ' + defaultAddress.address_line2 : ''}, ${defaultAddress.city}, ${defaultAddress.state}, ${defaultAddress.pincode}, ${defaultAddress.country}`,
                raw: defaultAddress
            };
        } else {
            // Validate custom address
            if (!customAddress.address_line1 || !customAddress.city || !customAddress.state || !customAddress.pincode) {
                toast.error("Please fill in all address fields");
                return;
            }
            shippingAddressData = {
                type: "CUSTOM",
                address: `${customAddress.address_line1}${customAddress.address_line2 ? ', ' + customAddress.address_line2 : ''}, ${customAddress.city}, ${customAddress.state}, ${customAddress.pincode}, ${customAddress.country}`,
                raw: customAddress
            };

            // Save to profile if checked
            if (saveToProfile) {
                try {
                    await profileService.updateAddress(customAddress);
                } catch (err) {
                    console.error("Failed to save address to profile", err);
                    // Continue with order anyway
                }
            }
        }

        if (paymentMethod === 'wallet') {
            if (!walletStats || parseFloat(walletStats.balance) < total) {
                toast.error("Insufficient wallet balance");
                return;
            }
        }

        if (paymentMethod === 'direct' && !proofFile) {
            toast.error("Please upload payment proof for direct payment");
            return;
        }

        try {
            setIsSubmitting(true);
            
            // Check activation status for PRODUCT_PURCHASE orders before uploading proof
            if (paymentMethod === 'direct' && (!profile?.is_active || profile?.account_activation_status !== 'ACTIVATED')) {
                toast.error("Your account is not activated. Please complete activation first.");
                setIsSubmitting(false);
                return;
            }

            let proofUrl = null;

            if (paymentMethod === 'direct' && proofFile) {
                const uploadRes = await orderService.uploadProof(proofFile);
                if (uploadRes.success) {
                    proofUrl = uploadRes.data.proofUrl;
                } else {
                    throw new Error("Failed to upload payment proof");
                }
            }

            const orderData = {
                items: cartItems.map(item => ({
                    productId: item.productId || item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: total,
                shippingCost: shipping,
                shippingAddress: shippingAddressData,
                paymentMethod: paymentMethod === 'wallet' ? 'WALLET' : 'MANUAL',
                paymentType: paymentMethod === 'direct' ? paymentType : null,
                transactionReference: paymentMethod === 'direct' ? transactionReference : null,
                proofUrl
            };

            const response = await orderService.createOrder(orderData);
            if (response.success) {
                toast.success("Order placed successfully!");
                await clearCart();
                navigate("/orders");
            }
        } catch (error) {
            console.error("Checkout failed:", error);
            toast.error(error.response?.data?.message || "Failed to complete purchase");
        } finally {
            setIsSubmitting(false);
        }
    };

    const walletBalance = walletStats ? parseFloat(walletStats.balance) : 0;
    const canUseWallet = walletBalance >= total;

    if (cartLoading) return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;

    return (
        <div className="p-4 md:p-8 space-y-8">
            {/* Progress Steps */}
            <div className="bg-white border-b border-slate-200 py-6 md:py-8 -mx-4 md:-mx-8 -mt-4 md:-mt-8">
                <div className="max-w-3xl mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200 -z-10"></div>
                        <div className="absolute top-5 left-0 w-2/3 h-1 bg-primary -z-10"></div>

                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center text-white mb-2">
                                <span className="material-symbols-outlined text-base md:text-lg">check</span>
                            </div>
                            <span className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase">Cart</span>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center text-white mb-2">
                                <span className="material-symbols-outlined text-base md:text-lg">check</span>
                            </div>
                            <span className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase">Shipping</span>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center text-white mb-2">
                                <span className="material-symbols-outlined text-base md:text-lg">credit_card</span>
                            </div>
                            <span className="text-[10px] md:text-xs font-bold text-primary uppercase">Payment</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Checkout Form */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">Secure Checkout</h1>
                        <p className="text-sm md:text-base text-slate-500">Complete your transaction by selecting an address and payment method.</p>
                    </div>

                    {/* Shipping Address */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">location_on</span>
                                <h2 className="text-lg font-bold text-slate-900">Shipping Address</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {profile?.addresses?.map((addr, idx) => (
                                <button
                                    key={addr.id}
                                    onClick={() => setSelectedAddress("profile")}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${selectedAddress === "profile"
                                        ? "border-primary bg-primary/5"
                                        : "border-slate-200 hover:border-slate-300"
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <span className="material-symbols-outlined text-slate-400">home</span>
                                        {selectedAddress === "profile" && (
                                            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                                <span className="material-symbols-outlined text-white text-sm">check</span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-1 text-sm md:text-base">Saved Address</h3>
                                    <p className="text-xs md:text-sm text-slate-500">{addr.address_line1}</p>
                                    <p className="text-xs md:text-sm text-slate-500">{addr.city}, {addr.state}, {addr.pincode}</p>
                                </button>
                            ))}

                            <button
                                onClick={() => setSelectedAddress("custom")}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${selectedAddress === "custom"
                                    ? "border-primary bg-primary/5"
                                    : "border-slate-200 hover:border-slate-300"
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <span className="material-symbols-outlined text-slate-400">add_location</span>
                                    {selectedAddress === "custom" && (
                                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-white text-sm">check</span>
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1 text-sm md:text-base">Custom Address</h3>
                                <p className="text-xs md:text-sm text-slate-500">Enter a new shipping address</p>
                            </button>
                        </div>

                        {/* Custom Address Form */}
                        {selectedAddress === "custom" && (
                            <div className="mt-6 space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-slate-700 mb-2">Address Line 1</label>
                                        <input
                                            type="text"
                                            name="address_line1"
                                            value={customAddress.address_line1}
                                            onChange={handleCustomAddressChange}
                                            placeholder="Street address, P.O. box, company name"
                                            className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-slate-700 mb-2">Address Line 2 (Optional)</label>
                                        <input
                                            type="text"
                                            name="address_line2"
                                            value={customAddress.address_line2}
                                            onChange={handleCustomAddressChange}
                                            placeholder="Apartment, suite, unit, building, floor, etc."
                                            className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={customAddress.city}
                                            onChange={handleCustomAddressChange}
                                            placeholder="City"
                                            className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2">State / Province / Region</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={customAddress.state}
                                            onChange={handleCustomAddressChange}
                                            placeholder="State"
                                            className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2">Postal Code / ZIP</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={customAddress.pincode}
                                            onChange={handleCustomAddressChange}
                                            placeholder="Pincode"
                                            className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={customAddress.country}
                                            onChange={handleCustomAddressChange}
                                            placeholder="Country"
                                            className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="save_to_profile"
                                        checked={saveToProfile}
                                        onChange={(e) => setSaveToProfile(e.target.checked)}
                                        className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary/20"
                                    />
                                    <label htmlFor="save_to_profile" className="text-sm text-slate-600 cursor-pointer">
                                        Save this address to my profile
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-primary">credit_card</span>
                            <h2 className="text-lg font-bold text-slate-900">Payment Method</h2>
                        </div>

                        {/* Payment Options Toggle */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <button
                                onClick={() => setPaymentMethod("wallet")}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === "wallet"
                                    ? "border-primary bg-primary/5"
                                    : "border-slate-200 hover:border-slate-300"
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-2xl ${paymentMethod === "wallet" ? "text-primary" : "text-slate-400"}`}>account_balance_wallet</span>
                                <span className="text-xs md:text-sm font-semibold text-slate-900">Wallet Balance</span>
                                <p className="text-[10px] text-slate-500">Available: <span className={canUseWallet ? "text-emerald-600 font-bold" : "text-red-500 font-bold"}>₹{walletBalance.toFixed(2)}</span></p>
                            </button>

                            <button
                                onClick={() => setPaymentMethod("direct")}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === "direct"
                                    ? "border-primary bg-primary/5"
                                    : "border-slate-200 hover:border-slate-300"
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-2xl ${paymentMethod === "direct" ? "text-primary" : "text-slate-400"}`}>payments</span>
                                <span className="text-xs md:text-sm font-semibold text-slate-900">Direct Payment</span>
                                <p className="text-[10px] text-slate-500">Upload Transfer Proof</p>
                            </button>
                        </div>

                        {/* Wallet Information */}
                        {paymentMethod === "wallet" && (
                            <div className={`p-4 rounded-xl mb-6 ${canUseWallet ? "bg-emerald-50 border border-emerald-100" : "bg-red-50 border border-red-100"}`}>
                                <div className="flex gap-3">
                                    <span className={`material-symbols-outlined ${canUseWallet ? "text-emerald-600" : "text-red-600"}`}>
                                        {canUseWallet ? "check_circle" : "error"}
                                    </span>
                                    <div>
                                        <h4 className={`font-bold text-sm ${canUseWallet ? "text-emerald-900" : "text-red-900"}`}>
                                            {canUseWallet ? "Ready to Pay" : "Insufficient Balance"}
                                        </h4>
                                        <p className={`text-xs ${canUseWallet ? "text-emerald-700" : "text-red-700"}`}>
                                            {canUseWallet
                                                ? `The total amount of ₹${total.toFixed(2)} will be debited from your wallet.`
                                                : `You need ₹${(total - walletBalance).toFixed(2)} more in your wallet. Please use Direct Payment instead.`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Direct Payment Form */}
                        {paymentMethod === "direct" && (
                            <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-sm">info</span>
                                        Payment Instructions
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                        <div className="p-3 bg-white rounded-lg border border-slate-200">
                                            <p className="font-bold text-slate-500 uppercase mb-2">Option 1: UPI Transfer</p>
                                            <p className="text-slate-900 font-bold text-sm mb-1">fintech.merch@upi</p>
                                            <p className="text-slate-500">Scan QR or use UPI ID</p>
                                        </div>
                                        <div className="p-3 bg-white rounded-lg border border-slate-200">
                                            <p className="font-bold text-slate-500 uppercase mb-2">Option 2: Bank Transfer</p>
                                            <p className="text-slate-900 font-bold mb-0.5">HDFC BANK</p>
                                            <p className="text-slate-500">Acc: 50100234123412</p>
                                            <p className="text-slate-500">IFSC: HDFC0001234</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-2">Payment Via</label>
                                            <select
                                                value={paymentType}
                                                onChange={(e) => setPaymentType(e.target.value)}
                                                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            >
                                                <option value="UPI">UPI</option>
                                                <option value="BANK">Bank Transfer</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-2">Transaction Ref (Optional)</label>
                                            <input
                                                type="text"
                                                placeholder="UTR / Ref No"
                                                value={transactionReference}
                                                onChange={(e) => setTransactionReference(e.target.value)}
                                                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2">Upload Proof (Screenshot)</label>
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center group-hover:border-primary transition-colors">
                                                {proofPreview ? (
                                                    <div className="relative inline-block">
                                                        <img src={proofPreview} alt="Preview" className="h-32 rounded-lg" />
                                                        <button
                                                            onClick={(e) => { e.preventDefault(); setProofFile(null); setProofPreview(null); }}
                                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs z-20"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">close</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-primary">upload_file</span>
                                                        <p className="text-sm font-medium text-slate-600">Click to upload or drag and drop</p>
                                                        <p className="text-xs text-slate-400">JPG, PNG up to 2MB</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-8 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>

                        {/* Products */}
                        <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
                            {cartItems.map((item, i) => (
                                <div key={i} className="flex justify-between items-center text-sm">
                                    <div className="flex flex-col">
                                        <span className="text-slate-900 font-semibold">{item.name}</span>
                                        <span className="text-slate-500 text-xs">Qty: {item.quantity}</span>
                                    </div>
                                    <span className="font-bold text-slate-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Subtotal</span>
                                <span className="font-semibold text-slate-900">₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Shipping</span>
                                <span className="font-semibold text-slate-900">₹{shipping.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-lg font-bold text-slate-900">Total</span>
                            <span className="text-2xl font-black text-slate-900">₹{total.toFixed(2)}</span>
                        </div>

                        {/* Place Order Button */}
                        <button
                            disabled={isSubmitting || (paymentMethod === 'wallet' && !canUseWallet)}
                            onClick={handleSubmit}
                            className={`w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all mb-4 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Processing...
                                </span>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">lock</span>
                                    Complete Purchase
                                </>
                            )}
                        </button>

                        {/* Support */}
                        <div className="bg-slate-50 rounded-lg p-4 text-center">
                            <p className="text-[10px] md:text-xs text-slate-500">
                                Secure Transaction Protected by <span className="text-primary font-bold">SSL Encryption</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
