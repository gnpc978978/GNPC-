use client;

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Images, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { authenticatedApiFetch, responseJson } from "@/services/api";
import type { HomeSectionMediaKey } from "@/types/homeSettings";

type Props = {
  section: HomeSectionMediaKey;
  label?: string;
  media: string[];
  onChange: (media: string[]) => void;
  max?: number;
};

type SettingsResponse = {
  success?: boolean;
  data?: {
    home?: Record<string, { media?: string[] }>;
  };
};

const safeMedia = (value: string[]) =>
  value.filter(
    (item) =>
      typeof item === "string" &&
      item.trim().length > 0
  );

export default function HomeMediaManager({
  section,
  label = "Section Photos",
  media,
  onChange,
  max = 4,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [uploading, setUploading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const remaining =
    Math.max(0, max - media.length);

  const canAdd =
    remaining > 0 && !uploading && !saving;

  const hasMedia =
    media.length > 0;

  const helperText = useMemo(() => {
    if (media.length === 0) {
      return `Add up to ${max} photos. The redesigned homepage section can use these photos as its editorial media layer.`;
    }

    if (media.length >= max) {
      return `Maximum of ${max} photos reached for this section.`;
    }

    return `${media.length} of ${max} photos configured. ${remaining} more can be added.`;
  }, [media.length, max, remaining]);

  const uploadFiles = async (
    files: File[]
  ) => {
    const selected =
      files.slice(0, remaining);

    if (selected.length === 0) {
      toast.error(
        `This section can contain a maximum of ${max} photos.`
      );
      return;
    }

    try {
      setUploading(true);

      const formData =
        new FormData();

      selected.forEach(
        (file, offset) => {
          formData.append(
            `homeMedia_${section}_${media.length + offset}`,
            file
          );
        }
      );

      const response =
        await authenticatedApiFetch(
          "/settings/upload",
          {
            method: "PUT",
            body: formData,
          }
        );

      const payload =
        await responseJson<SettingsResponse>(
          response
        );

      const nextMedia =
        safeMedia(
          payload.data?.home?.[
            section
          ]?.media || []
        );

      onChange(nextMedia);

      window.dispatchEvent(
        new Event(
          "website-settings-updated"
        )
      );

      toast.success(
        selected.length === 1
          ? "Section photo uploaded."
          : `${selected.length} section photos uploaded.`
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to upload section photos."
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files =
      Array.from(
        event.target.files || []
      );

    void uploadFiles(files);
  };

  const saveMedia = async (
    nextMedia: string[]
  ) => {
    try {
      setSaving(true);

      const response =
        await authenticatedApiFetch(
          "/settings",
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              home: {
                [section]: {
                  media: nextMedia,
                },
              },
            }),
          }
        );

      const payload =
        await responseJson<{
          success?: boolean;
          data?: {
            home?: Record<
              string,
              { media?: string[] }
            >;
          };
        }>(response);

      const saved =
        safeMedia(
          payload.data?.home?.[
            section
          ]?.media || nextMedia
        );

      onChange(saved);

      window.dispatchEvent(
        new Event(
          "website-settings-updated"
        )
      );

      toast.success(
        "Section photo order saved."
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save section photos."
      );
    } finally {
      setSaving(false);
    }
  };

  const removePhoto = (
    index: number
  ) => {
    const nextMedia =
      media.filter(
        (_, itemIndex) =>
          itemIndex !== index
      );

    void saveMedia(nextMedia);
  };

  const movePhoto = (
    index: number,
    direction: -1 | 1
  ) => {
    const nextIndex =
      index + direction;

    if (
      nextIndex < 0 ||
      nextIndex >= media.length
    ) {
      return;
    }

    const nextMedia = [
      ...media,
    ];

    [
      nextMedia[index],
      nextMedia[nextIndex],
    ] = [
      nextMedia[nextIndex],
      nextMedia[index],
    ];

    void saveMedia(nextMedia);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Images
              size={18}
              className="text-slate-700"
            />

            <h3 className="font-bold text-slate-900">
              {label}
            </h3>
          </div>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            {helperText}
          </p>
        </div>

        <button
          type="button"
          disabled={!canAdd}
          onClick={() =>
            inputRef.current?.click()
          }
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#171717] px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {uploading ? (
            <Loader2
              size={16}
              className="animate-spin"
            />
          ) : (
            <Upload size={16} />
          )}

          Add Photos

          <span className="text-white/45">
            {remaining > 0
              ? `(${remaining} left)`
              : ""}
          </span>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={
            handleFileChange
          }
          className="hidden"
          disabled={!canAdd}
        />
      </div>

      {!hasMedia ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
          <Images
            size={28}
            className="mx-auto text-slate-300"
          />

          <p className="mt-3 text-sm font-semibold text-slate-600">
            No photos configured
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Add the photos required by the section design.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {media.map(
            (image, index) => (
              <div
                key={`${image}-${index}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <Image
                    src={image}
                    alt={`${label} photo ${index + 1}`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute left-3 top-3 flex h-8 min-w-8 items-center justify-center rounded-full bg-black/65 px-2 text-[10px] font-black text-white backdrop-blur">
                    {String(
                      index + 1
                    ).padStart(2, "0")}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3">
                  <button
                    type="button"
                    onClick={() =>
                      movePhoto(
                        index,
                        -1
                      )
                    }
                    disabled={
                      index ===
                        0 ||
                      saving ||
                      uploading
                    }
                    aria-label="Move photo earlier"
                    className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-2 text-slate-700 transition hover:bg-slate-50 disabled:opacity-30"
                  >
                    <ArrowUp size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      movePhoto(
                        index,
                        1
                      )
                    }
                    disabled={
                      index ===
                        media.length -
                          1 ||
                      saving ||
                      uploading
                    }
                    aria-label="Move photo later"
                    className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-2 text-slate-700 transition hover:bg-slate-50 disabled:opacity-30"
                  >
                    <ArrowDown size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      removePhoto(index)
                    }
                    disabled={
                      saving ||
                      uploading
                    }
                    aria-label="Remove photo"
                    className="flex items-center justify-center rounded-xl border border-red-100 bg-white py-2 text-red-600 transition hover:bg-red-50 disabled:opacity-30"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )
          )}

          {remaining > 0 && (
            <button
              type="button"
              disabled={!canAdd}
              onClick={() =>
                inputRef.current?.click()
              }
              className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 transition hover:border-slate-400 hover:bg-white disabled:opacity-40"
            >
              <Plus size={24} />

              <span className="mt-2 text-sm font-bold">
                Add another photo
              </span>

              <span className="mt-1 text-xs">
                {remaining} remaining
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
