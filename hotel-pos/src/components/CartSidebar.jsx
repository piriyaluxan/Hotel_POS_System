import {
  LucideShoppingBasket,
  LucideShoppingCart,
  MinusIcon,
  PlusIcon,
  PrinterCheck,
  ShoppingBagIcon,
  ShoppingBasket,
  ShoppingBasketIcon,
  ShoppingCart,
  ShoppingCartIcon,
  Trash2,
} from "lucide-react";
import React from "react";

const CartSidebar = ({ cart, setCart, toPrint }) => {
  const increase = (id) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)),
    );
  };

  const decrease = (id) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === id);
      if (!found) return prev;
      if (found.quantity <= 1) return prev.filter((i) => i.id !== id);
      return prev.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity - 1 } : i,
      );
    });
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.05; // Assuming 10% tax
  const total = subtotal + tax;
  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200 shadow-xl px-0.5">
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        <h2 className="font-bold text-lg text-slate-700">New Order</h2>

        <div>
          <button
            className="flex-1 px-3 bg-red-100 text-red-700 py-2 rounded-lg hover:bg-red-200 transition-colors font-bold disabled:opacity-50"
            onClick={() => setCart([])}
            disabled={cart.length === 0}
          >
            <Trash2 className="mr-2 inline-block mb-1" /> Clear All
          </button>
        </div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto no-scrollbar">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="mb-4">
              <LucideShoppingCart size={48} className="text-slate-300" />
            </div>
            <p className="text-slate-500">Your cart is empty.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-slate-700">{item.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Rs. {item.price.toFixed(2)} · Qty: {item.quantity}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-slate-700 font-semibold">
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decrease(item.id)}
                      className="cursor-pointer w-8 h-8 bg-slate-100 rounded-md flex items-center justify-center text-slate-700 hover:bg-red-200"
                      aria-label={`Decrease ${item.name}`}
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-slate-500">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increase(item.id)}
                      className="cursor-pointer w-8 h-8 bg-slate-100 rounded-md flex items-center justify-center text-slate-700 hover:bg-green-200"
                      aria-label={`Increase ${item.name}`}
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <footer className="p-6 border-t border-slate-200">
        <div className="mb-4">
          <div className="flex justify-between text-slate-600 mb-2">
            <span>Subtotal:</span>
            <span>Rs. {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600 mb-2">
            <span>Tax (5%):</span>
            <span>Rs. {tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-slate-800">
            <span>Total:</span>
            <span>Rs. {total.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            className="w-full bg-emerald-600 flex-1  text-white py-3 rounded-lg hover:bg-emerald-800  transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
            disabled={cart.length === 0}
            onClick={toPrint}
          >
            <PrinterCheck className="mr-4 inline-block mb-1" />
            Print Receipt
          </button>
        </div>
      </footer>
    </div>
  );
};

export default CartSidebar;
