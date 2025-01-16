import { cn } from "@/lib/utils";
import { BotIcon, SquareDashedBottomCodeIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

function Logo({
  fontSize = "2xl",
  iconSize = 20,
}: {
  fontSize?: string;
  iconSize?: number;
}) {
  return (
    <Link
      href="/dashboard"
      className={cn(
        "flex items-center gap-2 text-2xl font-extrabold",
        fontSize,
      )}
    >
      <div className="rounded-xl bg-gradient-to-r from-teal-400 to-green-600 p-2">
        <BotIcon size={iconSize} className="stroke-white" />
      </div>
      <div>
        <span className="bg-gradient-to-r from-teal-400 to-green-600 bg-clip-text text-transparent">
          Repo
        </span>
        <span className="text-gray-500">Recap</span>
      </div>
    </Link>
  );
}

export default Logo;
