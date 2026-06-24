import React from 'react';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Smart Inventory System",
  description: "Get in touch with the Smart Inventory support team for sales, questions, or troubleshooting assistance.",
};

const Contact = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold">Contact Us</h1>
            <p className="mt-4">Get in touch with us.</p>
        </div>
    );
};

export default Contact;