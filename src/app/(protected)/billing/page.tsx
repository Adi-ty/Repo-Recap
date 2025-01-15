"use client";

import { api } from "@/trpc/react";

const BillingPage = () => {
  const { data: user } = api.Project.getMyCredits.useQuery();
  return (
    <>
      <h1 className="text-xl font-semibold">Billing</h1>
      <div className="h-2"></div>
      <p className="text-sm text-gray-500">
        You currently have {user?.credits} credits.
      </p>
      <div className="h-2"></div>
    </>
  );
};

export default BillingPage;
