"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function PinPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", "", "", ""]);
  const [mode, setMode] = useState<"loading" | "setup" | "confirm" | "enter">("loading");
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!user) return;
    const checkPin = async () => {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data().pinSet) {
        setMode("enter");
      } else {
        setMode("setup");
      }
    };
    checkPin();
  }, [user]);

  const handleInput = (value: string, index: number, isConfirm = false) => {
    if (!/^\d*$/.test(value)) return;
    const arr = isConfirm ? [...confirmPin] : [...pin];
    arr[index] = value;
    if (isConfirm) {
      setConfirmPin(arr);
    } else {
      setPin(arr);
    }
    setError("");

    if (value && index < 5) {
      const refs = isConfirm ? confirmRefs : inputRefs;
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number, isConfirm = false) => {
    if (e.key === "Backspace" && index > 0) {
      const arr = isConfirm ? [...confirmPin] : [...pin];
      if (!arr[index]) {
        const refs = isConfirm ? confirmRefs : inputRefs;
        refs.current[index - 1]?.focus();
      }
    }
  };

  const handleSetupPin = async () => {
    const pinStr = pin.join("");
    const confirmStr = confirmPin.join("");

    if (pinStr.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }
    if (mode === "setup" && confirmPin.every(d => d === "")) {
      setMode("confirm");
      setTimeout(() => confirmRefs.current[0]?.focus(), 100);
      return;
    }
    if (pinStr !== confirmStr) {
      setError("PINs don't match. Please try again.");
      setConfirmPin(["", "", "", "", "", ""]);
      setTimeout(() => confirmRefs.current[0]?.focus(), 100);
      return;
    }

    if (!user) return;
    try {
      await updateDoc(doc(db, "users", user.uid), {
        pin: pinStr, // In production, hash this
        pinSet: true,
      });
      sessionStorage.setItem("pinVerified", "true");
      router.push("/dashboard");
    } catch (err) {
      setError("Failed to save PIN. Please try again.");
      console.error(err);
    }
  };

  const handleVerifyPin = async () => {
    const pinStr = pin.join("");
    if (pinStr.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }
    if (!user) return;
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data().pin === pinStr) {
        sessionStorage.setItem("pinVerified", "true");
        router.push("/dashboard");
      } else {
        setError("Incorrect PIN. Please try again.");
        setPin(["", "", "", "", "", ""]);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
      console.error(err);
    }
  };

  const renderPinInputs = (values: string[], refs: React.MutableRefObject<(HTMLInputElement | null)[]>, isConfirm = false) => (
    <div className="flex gap-3 justify-center">
      {values.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleInput(e.target.value, i, isConfirm)}
          onKeyDown={(e) => handleKeyDown(e, i, isConfirm)}
          className="w-12 h-14 text-center text-xl font-bold bg-navy-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
        />
      ))}
    </div>
  );

  if (mode === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        className="glass-card p-10 max-w-md w-full text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent to-gold flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h1 className="text-2xl font-display font-bold text-white mb-2">
          {mode === "enter" ? "Enter Your PIN" : mode === "confirm" ? "Confirm Your PIN" : "Setup Your PIN"}
        </h1>
        <p className="text-gray-400 mb-8 text-sm">
          {mode === "enter"
            ? "Enter your 6-digit PIN to access the dashboard."
            : mode === "confirm"
            ? "Re-enter your PIN to confirm."
            : "Create a 6-digit PIN for extra security."}
        </p>

        {renderPinInputs(mode === "confirm" ? confirmPin : pin, mode === "confirm" ? confirmRefs : inputRefs, mode === "confirm")}

        {error && (
          <motion.p
            className="text-red-400 text-sm mt-4"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.p>
        )}

        <button
          onClick={mode === "enter" ? handleVerifyPin : handleSetupPin}
          className="btn-primary w-full mt-8"
        >
          {mode === "enter" ? "Verify PIN" : mode === "confirm" ? "Confirm & Save" : "Continue"}
        </button>
      </motion.div>
    </div>
  );
}
