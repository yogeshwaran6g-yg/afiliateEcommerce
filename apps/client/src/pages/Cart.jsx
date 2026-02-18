import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import CartItem from "./cart/CartItem";
import CartSummary from "./cart/CartSummary";
import EmptyCart from "./cart/EmptyCart";

export default function Cart() {
    const {
        cartItems,
        isLoading,
        updateQuantity,
        removeFromCart,
        subtotal,
        shipping,
        tax,
        total,
        totalItemsCount,
        taxRate
    } = useCart();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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

                    {/* Continue Shopping */}
                    <div className="flex justify-start">
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary/80 group transition-all"
                        >
                            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                            Continue Shopping
                        </Link>
                    </div>
                </div>

                {/* Right: Order Summary */}
                <div className="lg:col-span-1">
                    <CartSummary
                        subtotal={subtotal}
                        shipping={shipping}
                        tax={tax}
                        total={total}
                        totalItems={totalItemsCount}
                        taxRate={taxRate}
                    />
                </div>
            </div>
        </div>
    );
}
