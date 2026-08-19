"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  apiFetch,
  responseJson,
} from "@/services/api";

type PresidentSettings = {
  presidentName?: string;
  presidentDesignation?: string;
  presidentMessage?: string;
  presidentImage?: string;
  image?: string;
  message?: string;
  name?: string;
  designation?: string;
};

const emptyPresident: PresidentSettings =
  {};

export default function PresidentMessage() {
  const [
    president,
    setPresident,
  ] =
    useState<PresidentSettings>(
      emptyPresident
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response =
          await apiFetch(
            "/settings/about"
          );

        const payload =
          await responseJson<{
            success?: boolean;
            data?: PresidentSettings;
          }>(response);

        if (
          cancelled
        ) {
          return;
        }

        setPresident({
          ...emptyPresident,
          ...(payload.data || {}),
        });
      } catch {
        if (
          !cancelled
        ) {
          setPresident(
            emptyPresident
          );
        }
      } finally {
        if (
          !cancelled
        ) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (
    loading ||
    !president
  ) {
    return null;
  }

  const name =
    president.presidentName ||
    president.name ||
    "";

  const designation =
    president.presidentDesignation ||
    president.designation ||
    "";

  const message =
    president.presidentMessage ||
    president.message ||
    "";

  const image =
    president.presidentImage ||
    president.image ||
    "";

  if (
    !name &&
    !designation &&
    !message &&
    !image
  ) {
    return null;
  }

  return (
    <section className="bg-[#f4ede2] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="gnpc-section-heading">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/45">
            President's Message
          </p>
          {name && (
            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#171717] sm:text-4xl">
              {name}
            </h2>
          )}
          {designation && (
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-black/50 sm:text-base">
              {designation}
            </p>
          )}
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl items-center overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_24px_65px_rgba(38,32,23,0.10)] lg:grid-cols-[320px_1fr] lg:gap-0">
          {image ? (
            <div className="overflow-hidden rounded-3xl bg-slate-100">
              <img
                src={image}
                alt={
                  name ||
                  "President"
                }
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          ) : null}

          <div>
            {message && (
              <div className="whitespace-pre-line text-base font-medium leading-7 text-[#30352f] sm:text-lg sm:leading-8">
                “{message}”
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
