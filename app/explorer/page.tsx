"use client";
export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ExplorerContent() {
  const searchParams = useSearchParams();
  return (
    <div className="min-h-screen bg-[#08081a] text-white p-20">
      <h1 className="text-4xl font-bold">NETWORK TRACE ACTIVE</h1>
      <p className="mt-4 font-mono text-blue-400">Shard: {searchParams.get("shards") || "Primary"}</p>
      <div className="mt-10 glass-panel p-10">Secure Ledger Trace in Progress...</div>
    </div>
  );
}

export default function ExplorerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExplorerContent />
    </Suspense>
  );
}
