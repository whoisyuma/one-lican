'use client'

import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

interface LoadingLinkProps {
    href: string;
    children: React.ReactNode;
    className: string;
}

export default function LoadingCreateLink({ href, children, className }: LoadingLinkProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        startTransition(() => {
            router.push(href);
        });
    };

    return (
        <button onClick={handleClick} disabled={isPending} className={className}>
            {isPending ? '読み込み中...' : children}
        </button>
    )
}