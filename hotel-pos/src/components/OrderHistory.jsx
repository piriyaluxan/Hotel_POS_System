import { Clock10, ListOrdered, Printer } from "lucide-react";
import React from "react";

const OrderHistory = ({ orders = [], setShowHistory, onPrint }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Order History</h2>
          <button
            className="text-2xl text-slate-500 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors px-3"
            onClick={() => setShowHistory(false)}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="mb-4">
                <ListOrdered size={48} className="text-slate-300" />
              </div>
              <p className="text-slate-500">No orders yet.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="border-b border-slate-100 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">
                        Order #{order.id}
                      </span>
                      <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded font-medium">
                        Completed
                      </span>
                    </div>

                    <p className="text-sm text-slate-500 mt-1">{order.date}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-800">
                      Rs. {Number(order.total || 0).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 justify-end mt-1">
                      <p className="text-xs text-slate-500">
                        {(order.items || []).length} items
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          className="ml-2 p-2 rounded hover:bg-slate-100"
                          onClick={() => onPreview && onPreview(order)}
                          title="Preview receipt"
                        >
                          Preview
                        </button>
                        <button
                          className="ml-2 p-2 rounded hover:bg-slate-100"
                          onClick={() => onPrint && onPrint(order)}
                          title="Print receipt"
                        >
                          <Printer className="w-4 h-4 text-slate-700" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div></div>
                </div>
                <div>
                  {order.items &&
                    order.items.map((item) => (
                      <div key={item.id} className="flex justify-between py-1">
                        <span className="flex-1 truncate">{item.name}</span>
                        <span className="w-16 text-center">
                          {item.quantity}
                        </span>
                        <span className="w-24 text-right">
                          Rs. {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-slate-200 text-sm text-slate-500 flex items-center justify-center">
          Showing {orders.length} {orders.length === 1 ? "order" : "orders"}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
