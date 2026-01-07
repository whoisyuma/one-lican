'use client'

import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

interface HomeButtonProps {
  href: string;
  children: React.ReactNode;
  className: string;
}

export default function GoHomeButton({ href, children, className }: HomeButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <button 
      onClick={handleClick} 
      disabled={isPending} 
      className={className}
    >
      {isPending ? '読み込み中...' : children}
    </button>
  )
}