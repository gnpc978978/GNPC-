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
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[320px_1fr] lg:gap-14">
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
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">
              President's Message
            </p>

            {name && (
              <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                {name}
              </h2>
            )}

            {designation && (
              <p className="mt-2 font-semibold text-slate-500">
                {designation}
              </p>
            )}

            {message && (
              <div className="mt-6 whitespace-pre-line text-base leading-8 text-slate-600">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
