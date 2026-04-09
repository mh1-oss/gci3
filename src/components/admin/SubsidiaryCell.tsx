"use client";

import { useState } from "react";
import SubsidiaryPreviewModal from "@/components/SubsidiaryPreviewModal";

interface Subsidiary {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
}

interface SubsidiaryCellProps {
  subsidiary: Subsidiary | null;
}

export default function SubsidiaryCell({ subsidiary }: SubsidiaryCellProps) {
  const [showModal, setShowModal] = useState(false);

  if (!subsidiary?.name) {
    return <span className="text-gray-300 italic text-xs">بدون مجموعة</span>;
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-gray-600 font-bold text-sm bg-gray-100 px-3 py-1 rounded-lg hover:bg-brand-navy hover:text-white transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap"
      >
        {subsidiary.name}
      </button>

      {showModal && (
        <SubsidiaryPreviewModal
          subsidiary={subsidiary}
          onClose={() => setShowModal(false)}
          isAdmin={true}
        />
      )}
    </>
  );
}
