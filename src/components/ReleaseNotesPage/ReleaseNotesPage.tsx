import React from "react";

const ReleaseNotesPage = () => {
  type ReleaseNote = {
    id: string;
    date: string;
    title: string;
    version: string;
    tag: string;
    description: string;
  };

  const notes: ReleaseNote[] = [
    {
      id: "1",
      date: "JUN 24, 2026",
      title: "ThemeForest Submission Ready Update",
      version: "v1.0.0",
      tag: "Major Release",
      description:
        "Demo data one-click setup, LMS legacy cleanup, SEO improvements, HTML documentation package, and deployment guides added.",
    },
    {
      id: "2",
      date: "JUN 20, 2026",
      title: "Inventory Dashboard & QR Ordering",
      version: "v0.9.0",
      tag: "Feature Update",
      description:
        "Inventory overview, product management, order tracking, restock queue, and QR scan-to-checkout flow.",
    },
    {
      id: "3",
      date: "JUN 15, 2026",
      title: "Authentication & Role-Based Access",
      version: "v0.8.0",
      tag: "Security",
      description:
        "JWT middleware, staff/manager/admin roles, Google OAuth, and secure dashboard route protection.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#05010D] text-gray-800 dark:text-gray-200 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] bg-clip-text text-transparent">
            Release Notes
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Smart Inventory template version history
          </p>
        </div>

        <div className="space-y-6">
          {notes.map((note) => (
            <div
              key={note.id}
              className="rounded-2xl border border-gray-100 dark:border-[#2D2438] bg-gray-50 dark:bg-[#120B1E] p-6"
            >
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF6B35]">
                  {note.version}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] font-semibold">
                  {note.tag}
                </span>
                <span className="text-xs text-gray-500 ml-auto">{note.date}</span>
              </div>
              <h2 className="text-xl font-bold mb-2">{note.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {note.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReleaseNotesPage;
