import { Suspense } from "react";
import DataDeletionContent from "@/components/DataDeletionContent";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "User Data Deletion Instructions & Request | Vnoirs Meta Compliance",
  description:
    "Official user data deletion instructions and automated self-service request portal for Vnoirs in compliance with Meta Platform Terms, WhatsApp Cloud API standards, and Facebook Login policies.",
  alternates: {
    canonical: "/data-deletion",
  },
};

export default function DataDeletionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#090d16] text-violet-400">
          <div className="flex items-center gap-3 text-sm">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading Data Deletion Portal...</span>
          </div>
        </div>
      }
    >
      <DataDeletionContent />
    </Suspense>
  );
}
