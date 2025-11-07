import React, { useState, forwardRef, useImperativeHandle } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { API_BASE_URL } from "../config/api";

const UpiPay = forwardRef(function UpiPay(_props, ref) {
  const [pa, setPa] = useState("merchant@upi");
  const [pn, setPn] = useState("FinPlay Merchant");
  const [amount, setAmount] = useState("1");
  const [note, setNote] = useState("FinPlay Quick Pay");

  const upiLink = `upi://pay?pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(pn)}${
    amount ? `&am=${encodeURIComponent(amount)}` : ""
  }&tn=${encodeURIComponent(note)}&cu=INR`;

  // simple mobile check
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useImperativeHandle(ref, () => ({
    presetAndPay: async ({ presetPa, presetPn, presetAmount, presetNote } = {}) => {
      if (presetPa) setPa(presetPa);
      if (presetPn) setPn(presetPn);
      if (presetAmount) setAmount(String(presetAmount));
      if (presetNote) setNote(presetNote);
      await openRazorpay();
    }
  }));

  const openRazorpay = async () => {
    try {
      // Create order on backend
      const resp = await fetch(`${API_BASE_URL}/api/createOrder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount) || 1 }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        alert(data.error || 'Failed to create Razorpay order');
        return;
      }

      const order = data.order;
      const rzpKey = process.env.REACT_APP_RAZORPAY_KEY;
      if (!rzpKey) {
        alert('Missing REACT_APP_RAZORPAY_KEY in .env');
        return;
      }

      const options = {
        key: rzpKey,
        amount: order.amount,
        currency: order.currency,
        name: pn || 'Payment',
        description: note || 'UPI Payment',
        order_id: order.id,
        prefill: {
          name: pn,
        },
        theme: { color: '#5b21b6' },
      };

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(script);
    } catch (e) {
      alert('Failed to initialize Razorpay');
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "420px", margin: "auto", backgroundColor: "#1e3c72", marginTop: "2rem", marginBottom: "2rem", borderRadius: "20px", color: "#fff" }}>
      <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>Quick UPI Pay</h3>

      {/* Inputs */}
      <div className="form-group" style={{ marginBottom: "0.75rem" }}>
        <label>Payee UPI ID</label>
        <input
          type="text"
          value={pa}
          onChange={(e) => setPa(e.target.value)}
          placeholder="example@upi"
          style={{
            width: "100%",
            marginTop: 6,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
            color: "#111827",
          }}
        />
      </div>

      <div className="form-group" style={{ marginBottom: "0.75rem" }}>
        <label>Payee Name</label>
        <input
          type="text"
          value={pn}
          onChange={(e) => setPn(e.target.value)}
          placeholder="Receiver Name"
          style={{
            width: "100%",
            marginTop: 6,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
            color: "#111827",
          }}
        />
      </div>

      <div className="form-group" style={{ marginBottom: "0.75rem" }}>
        <label>Amount (INR)</label>
        <input
          type="number"
          min="1"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="199"
          style={{
            width: "100%",
            marginTop: 6,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
            color: "#111827",
          }}
        />
      </div>

      <div className="form-group" style={{ marginBottom: "1rem" }}>
        <label>Note</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Payment Note"
          style={{
            width: "100%",
            marginTop: 6,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
            color: "#111827",
          }}
        />
      </div>

      {/* Pay button (mobile only) */}
      {isMobile && (
        <a href={upiLink} style={{ textDecoration: "none" }}>
          <button
            className="btn-primary"
            style={{ marginTop: "0.5rem", width: "100%", background: "#22c55e", color: "#fff", padding: "12px 14px", borderRadius: 999, fontWeight: 700 }}
          >
            Pay via UPI
          </button>
        </a>
      )}

      {/* QR Code for desktop */}
      {!isMobile && (
        <div style={{ marginTop: "1rem", textAlign: "center", background: "#fff", borderRadius: 16, padding: 16, color: "#111827" }}>
          <p style={{ marginBottom: 8 }}>Scan this QR with any UPI app:</p>
          <QRCodeCanvas value={upiLink} size={200} />
        </div>
      )}

      {/* Razorpay Button */}
      <button
        onClick={openRazorpay}
        style={{ marginTop: "1rem", width: "100%", background: "#111827", color: "#fff", padding: "12px 14px", borderRadius: 999, fontWeight: 700 }}
      >
        Pay with Razorpay (Test)
      </button>
    </div>
  );
});

export default UpiPay;


