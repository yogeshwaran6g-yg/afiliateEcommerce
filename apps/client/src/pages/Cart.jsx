import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "./cart/CartItem";
import CartSummary from "./cart/CartSummary";
import EmptyCart from "./cart/EmptyCart";
import Skeleton from "../components/ui/Skeleton";

export default function Cart() {
    const {
        cartItems,
        isLoading,
        updateQuantity,
        removeFromCart,
        subtotal,
        shipping,
        total,
        totalItemsCount,
    } = useCart();

    if (isLoading) {
        return (
            <div className="p-4 md:p-8 space-y-8">
                <div>
                    <Skeleton width="250px" height="36px" className="mb-2" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <Skeleton width="150px" height="24px" />
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-4">
                                    <Skeleton width="80px" height="80px" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton width="60%" height="20px" />
                                        <Skeleton width="40%" height="16px" />
                                    </div>
                                    <Skeleton width="80px" height="24px" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                            <Skeleton width="100%" height="24px" />
                            <div className="space-y-2">
                                <Skeleton width="100%" height="16px" />
                                <Skeleton width="100%" height="16px" />
                                <Skeleton width="100%" height="32px" className="mt-4" />
                            </div>
                            <Skeleton width="100%" height="48px" className="rounded-xl mt-4" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">Shopping Cart</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-start">
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary/80 group transition-all"
                        >
                            Continue Shopping
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </Link>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        {cartItems.length > 0 ? (
                            <>
                                {/* Table Header - Hidden on mobile */}
                                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                                    <div className="col-span-5">Product</div>
                                    <div className="col-span-2">Price</div>
                                    <div className="col-span-2">Quantity</div>
                                    <div className="col-span-2 text-right">Total</div>
                                    <div className="col-span-1"></div>
                                </div>

                                <div className="divide-y divide-slate-200">
                                    {cartItems.map((item) => (
                                        <CartItem
                                            key={item.id}
                                            item={item}
                                            onUpdateQuantity={updateQuantity}
                                            onRemove={removeFromCart}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <EmptyCart />
                        )}
                    </div>

                </div>

                {/* Right: Order Summary */}
                <div className="lg:col-span-1">
                    <CartSummary
                        subtotal={subtotal}
                        shipping={shipping}
                        total={total}
                        totalItems={totalItemsCount}
                    />
                </div>
            </div>
        </div>
    );
}
