import React, { useState } from "react";
import { Clock, Pizza, Search } from "lucide-react";

import menuData from "./data/menu.json";
import MenuTitle from "./components/MenuTitle";
import CartSidebar from "./components/CartSidebar";
import OrderHistory from "./components/OrderHistory";
import Receipt from "./components/Receipt";

const App = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [showPrinter, setShowPrinter] = useState(false);

  const categories = ["ALL", ...new Set(menuData.map((item) => item.category))];

  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMenu = menuData.filter((item) => {
    const matchesCategory =
      selectedCategory === "ALL" || item.category === selectedCategory;

    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Cart state with localStorage persistence

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("hotel-pos-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem("hotel-pos-orders");
    return savedOrders ? JSON.parse(savedOrders) : [];
  });
  const [printOrder, setPrintOrder] = useState(null);
  const [previewOrder, setPreviewOrder] = useState(null);
  // Update localStorage whenever cart changes
  //update Cart Item
  const updateCart = (item, delta = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) return prev.filter((i) => i.id !== item.id);
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: newQty } : i,
        );
      }

      if (delta > 0) return [...prev, { ...item, quantity: delta }];
      return prev;
    });
  };

  React.useEffect(() => {
    localStorage.setItem("hotel-pos-cart", JSON.stringify(cart));
  }, [cart]);

  React.useEffect(() => {
    localStorage.setItem("hotel-pos-orders", JSON.stringify(orders));
  }, [orders]);

  const handlePrinter = () => {
    if (!cart || cart.length === 0) {
      alert("Cart is empty. Add items before printing.");
      return;
    }

    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    const itemsHtml = cart
      .map(
        (i) => `<tr>
          <td style="padding:6px;border-bottom:1px solid #eee">${i.name}</td>
          <td style="padding:6px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
          <td style="padding:6px;border-bottom:1px solid #eee;text-align:right">Rs. ${i.price.toFixed(2)}</td>
          <td style="padding:6px;border-bottom:1px solid #eee;text-align:right">Rs. ${(i.price * i.quantity).toFixed(2)}</td>
        </tr>`,
      )
      .join("");

    const html = `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Receipt</title>
        <style>
          body{font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; padding:20px}
          h2{margin-bottom:0}
          table{width:100%;border-collapse:collapse;margin-top:12px}
          td,th{padding:6px}
        </style>
      </head>
      <body>
        <div id="printable-area">
          <h2>Foodie POS</h2>
          <div>Table #04 · cashier: admin</div>
          <table>
            <thead>
              <tr>
                <th style="text-align:left">Item</th>
                <th style="text-align:center">Qty</th>
                <th style="text-align:right">Price</th>
                <th style="text-align:right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div style="margin-top:12px;text-align:right">
            <div>Subtotal: Rs. ${subtotal.toFixed(2)}</div>
            <div>Tax (5%): Rs. ${tax.toFixed(2)}</div>
            <h3>Total: Rs. ${total.toFixed(2)}</h3>
          </div>
        </div>
      </body>
    </html>`;

    const w = window.open("", "_blank", "width=600,height=800");
    if (!w) return alert("Please allow popups to print the receipt.");
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();

    w.onload = () => {
      w.print();
      w.close();
    };

    const newOrder = {
      id: "pos" + Date.now().toString(),
      date: new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      items: cart,
      total,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setShowPrinter(null);
  };

  const handlePrintOrder = (order) => {
    if (!order || !order.items || order.items.length === 0) {
      alert("Order has no items to print.");
      return;
    }

    const subtotal = (order.items || []).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    const itemsHtml = (order.items || [])
      .map(
        (i) => `<tr>
          <td style="padding:6px;border-bottom:1px solid #eee">${i.name}</td>
          <td style="padding:6px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
          <td style="padding:6px;border-bottom:1px solid #eee;text-align:right">Rs. ${i.price.toFixed(2)}</td>
          <td style="padding:6px;border-bottom:1px solid #eee;text-align:right">Rs. ${(i.price * i.quantity).toFixed(2)}</td>
        </tr>`,
      )
      .join("");

    const html = `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Receipt ${order.id}</title>
        <style>
          body{font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; padding:20px}
          table{width:100%;border-collapse:collapse;margin-top:12px}
          td,th{padding:6px}
        </style>
      </head>
      <body>
        <div id="printable-area">
          <h2>Foodie POS</h2>
          <div>Order #{order.id}</div>
          <div>${order.date || ""}</div>
          <table>
            <thead>
              <tr>
                <th style="text-align:left">Item</th>
                <th style="text-align:center">Qty</th>
                <th style="text-align:right">Price</th>
                <th style="text-align:right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div style="margin-top:12px;text-align:right">
            <div>Subtotal: Rs. ${subtotal.toFixed(2)}</div>
            <div>Tax (5%): Rs. ${tax.toFixed(2)}</div>
            <h3>Total: Rs. ${total.toFixed(2)}</h3>
          </div>
        </div>
      </body>
    </html>`;

    const w = window.open("", "_blank", "width=600,height=800");
    if (!w) return alert("Please allow popups to print the receipt.");
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    w.onload = () => {
      w.print();
      w.close();
    };
  };

  const handleHistoryPrint = (order) => {
    setPrintOrder(order);
    setTimeout(() => {
      window.print();
      setPrintOrder(null);
    }, 500);
  };

  const openPreview = (order) => setPreviewOrder(order);
  const closePreview = () => setPreviewOrder(null);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2 text-orange-500 mb-2">
              <Pizza size={32} />
              Foodie POS
            </h1>
            <p className="text-gray-600">Table #04 · cashier: admin</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 font-bold text-sm"
              onClick={() => setShowHistory(true)}
            >
              <Clock size={18} />
              History
            </button>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search menu..."
                className="pl-9 pr-4 py-2 bg-slate-100 rounded-md text-sm focus:ring-2 focus:ring-slate-900 w-64 outline-none"
              />
            </div>

            <button
              onClick={handlePrinter}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
            >
              Receipt
            </button>
          </div>
        </header>

        {/* Categories */}
        <div className="p-6 overflow-x-auto bg-white border-b border-slate-100 no-scrollbar">
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-xl border transition-all
                  ${
                    selectedCategory === category
                      ? "bg-slate-900 text-white shadow-lg scale-105"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-6 h-[calc(100vh-160px)] overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMenu.map((item) => (
              <MenuTitle key={item.id} item={item} onUpdateCart={updateCart} />
            ))}
          </div>
        </div>
      </main>

      {/* Cart Sidebar */}

      <aside className="w-96 shrink-0 bg-white border-l border-gray-200">
        <CartSidebar cart={cart} setCart={setCart} toPrint={handlePrinter} />
      </aside>
      {/* print area */}

      <div id="printable-area" className="invisible hidden">
        <Receipt
          cart={printOrder?.items || cart}
          orderDetails={printOrder}
          orders={orders}
        />
      </div>

      {showHistory && (
        <OrderHistory
          orders={orders}
          setShowHistory={setShowHistory}
          onPrint={handleHistoryPrint}
          onPreview={openPreview}
        />
      )}

      {previewOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl overflow-auto max-h-[90vh]">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold">
                Receipt Preview — Order #{previewOrder.id}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 bg-slate-100 rounded"
                  onClick={() => closePreview()}
                >
                  Close
                </button>
                <button
                  className="px-3 py-1 bg-emerald-600 text-white rounded"
                  onClick={() => {
                    handleHistoryPrint(previewOrder);
                    closePreview();
                  }}
                >
                  Print
                </button>
              </div>
            </div>
            <div className="p-4">
              <Receipt
                cart={previewOrder.items || []}
                orderDetails={previewOrder}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
