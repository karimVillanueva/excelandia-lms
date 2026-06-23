"use client";

import { useEffect, useState } from "react";
import { MeResponse } from "@/lib/types";

export function useMe() {
    const [me, setMe] = useState<MeResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/me")
            .then((res) => res.json())
            .then(setMe)
            .finally(() => setLoading(false));
    }, []);

    return {
        me,
        loading,
    };
}