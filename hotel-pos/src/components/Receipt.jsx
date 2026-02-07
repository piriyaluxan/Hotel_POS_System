import React from "react";

const Receipt = ({ cart = [], orderDetails = {}, orders = [] }) => {
  const items =
    cart && cart.length ? cart : orderDetails?.items || orders[0]?.items || [];

  const subtotal = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0,
  );
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const date =
    orderDetails?.date ||
    orders[0]?.date ||
    new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div
      id="printable-area"
      className="p-8 bg-white text-slate-800 font-sans text-sm"
    >
      <div className="text-center border-b-2 border-dashed border-slate-300 pb-4 mb-4">
        <h1 className="text-2xl font-bold uppercase tracking-widest">
          GRAND USHA HOTEL
        </h1>
        <p className="text-slate-500">NO:23 galle Road, Colombo City</p>
        <p className="text-slate-500">Tel: +94 78 123 4567</p>
      </div>

      <div className="flex justify-between mb-4 text-xs">
        <span>
          Order # {orderDetails?.id || orders[0]?.id || `POS${Date.now()}`}
        </span>
        <span>{date}</span>
      </div>

      <div className="border-b border-slate-200 pb-2 mb-2">
        <div className="flex justify-between font-bold mb-1">
          <span className="flex-1">Item</span>
          <span className="w-16 text-center">Qty</span>
          <span className="w-24 text-right">Price</span>
        </div>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between py-1">
            <span className="flex-1 truncate">{item.name}</span>
            <span className="w-16 text-center">{item.quantity}</span>
            <span className="w-24 text-right">
              Rs. {(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-1 mb-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>Rs. {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>GST (5%)</span>
          <span>Rs. {tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t-2 border-dashed">
          <span>Total</span>
          <span>Rs. {total.toFixed(2)}</span>
        </div>
      </div>

      <div className="text-center text-xs mt-8">
        <p className="font-bold">Thank You!</p>
        <p>Visit Again</p>
      </div>
    </div>
  );
};

export default Receipt;
