"use client";

import React from "react";
import {
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  CreditCard,
  Ban,
} from "lucide-react";
import { motion } from "framer-motion";

const RefundPolicy = () => {
  const steps = [
    {
      title: "7-Day Full Refund",
      icon: <Clock className="w-6 h-6 text-[#FF0F7B]" />,
      desc: "Full refund if requested within 7 days of ThemeForest purchase, provided the item has not been used in a published end product beyond evaluation.",
    },
    {
      title: "Partial Credit",
      icon: <RefreshCcw className="w-6 h-6 text-[#E3436B]" />,
      desc: "Refund requests after 7 days are handled according to Envato Market refund policies and item support terms.",
    },
    {
      title: "No Refunds",
      icon: <Ban className="w-6 h-6 text-[#832388]" />,
      desc: "After the Envato refund window or once the license has been used in a live production deployment, standard refunds may not apply.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#05010D] text-gray-800 dark:text-gray-200 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-pink-100 dark:bg-[#120B1E]">
            <CreditCard className="w-8 h-8 text-[#FF0F7B]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FF0F7B] via-[#E3436B] to-[#F89B29] bg-clip-text text-transparent">
            Refund Policy
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            We want you to be confident with Smart Inventory. If the template is not
            the right fit, here is how returns and support are handled.
          </p>
        </motion.div>

        {/* Policy Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-2xl border border-gray-100 dark:border-[#2D2438] bg-gray-50 dark:bg-[#120B1E] flex flex-col items-center text-center"
            >
              <div className="mb-4">{step.icon}</div>
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Eligibility Criteria */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-[#0b1120] border border-gray-100 dark:border-[#1f2937] rounded-2xl p-8 shadow-sm mb-12"
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <CheckCircle2 className="text-[#00C48C]" /> Eligibility Criteria
          </h2>
          <ul className="space-y-4">
            <li className="flex gap-3 text-sm">
              <span className="font-bold text-[#FF0F7B]">01.</span>
              <span>
                The request must be submitted via the{" "}
                <strong>Support Ticket</strong> system in your Student
                Dashboard.
              </span>
            </li>
            <li className="flex gap-3 text-sm">
              <span className="font-bold text-[#FF0F7B]">02.</span>
              <span>
                Course materials (PDFs, Source Code) must not have been
                downloaded extensively.
              </span>
            </li>
            <li className="flex gap-3 text-sm">
              <span className="font-bold text-[#FF0F7B]">03.</span>
              <span>
                Refunds do not apply to subscription-based ALL ACCESS passes or
                discounted bundle deals.
              </span>
            </li>
          </ul>
        </motion.div>

        {/* Warning Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF0F7B] to-[#F89B29] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-white dark:bg-[#05010D] p-8 rounded-2xl border border-gray-100 dark:border-[#2D2438]">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <AlertCircle className="w-6 h-6 text-[#FDE047]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Processing Time</h3>
                <p className="text-sm opacity-80 leading-relaxed">
                  Once approved, refunds are processed back to the original
                  payment method within <strong>5-10 business days</strong>.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mt-16 py-8 border-t border-gray-100 dark:border-[#1f2937] text-center"
        >
          <p className="text-gray-500 mb-4">
            Questions about a specific transaction?
          </p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] text-white font-semibold hover:shadow-lg transition-all"
          >
            Contact Billing Support
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default RefundPolicy;
