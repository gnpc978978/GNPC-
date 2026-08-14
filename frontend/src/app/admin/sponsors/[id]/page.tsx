"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import Image from "next/image";
import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  getSponsor,
  updateSponsor,
} from "@/services/sponsorService";

import type { Sponsor } from "@/types/sponsor";

type SponsorForm = {
  name: string;
  website: string;
  displayOrder: string;
  status: Sponsor["status"];
};

export default function EditSponsorPage() {
  const params = useParams();
  const router = useRouter();

  const id =
    typeof params.id === "string"
      ? params.id
      : "";

  const [form, setForm] =
    useState<SponsorForm>({
      name: "",
      website: "",
      displayOrder: "0",
      status: "ACTIVE",
    });

  const [logo, setLogo] =
    useState<string>("");

  const [newLogo, setNewLogo] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid sponsor ID.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchSponsor = async () => {
      try {
        setLoading(true);
        setError(null);

        const sponsor =
          await getSponsor(id);

        if (cancelled) {
          return;
        }

        setForm({
          name: sponsor.name || "",
          website: sponsor.website || "",
          displayOrder: String(
            sponsor.displayOrder ?? 0
          ),
          status:
            sponsor.status === "INACTIVE"
              ? "INACTIVE"
              : "ACTIVE",
        });

        setLogo(sponsor.logo || "");
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load sponsor."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchSponsor();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } =
      event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleLogo = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file."
      );
      return;
    }

    setError(null);
    setNewLogo(file);

    const previewUrl =
      URL.createObjectURL(file);

    setLogo(previewUrl);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!id) {
      setError("Invalid sponsor ID.");
      return;
    }

    if (!form.name.trim()) {
      setError(
        "Sponsor name is required."
      );
      return;
    }

    const displayOrder =
      Number(form.displayOrder);

    if (
      !Number.isFinite(displayOrder) ||
      displayOrder < 0
    ) {
      setError(
        "Display order must be a valid non-negative number."
      );
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const formData = new FormData();

      formData.append(
        "name",
        form.name.trim()
      );

      formData.append(
        "website",
        form.website.trim()
      );

      formData.append(
        "displayOrder",
        String(displayOrder)
      );

      formData.append(
        "status",
        form.status
      );

      if (newLogo) {
        formData.append(
          "logo",
          newLogo
        );
      }

      await updateSponsor(
        id,
        formData
      );

      alert(
        "Sponsor updated successfully."
      );

      router.push(
        "/admin/sponsors"
      );
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update sponsor."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading sponsor...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Edit Sponsor
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Update sponsor information and
          branding.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl bg-white p-6 shadow"
      >
        <div>
          <label
            htmlFor="name"
            className="font-medium"
          >
            Sponsor Name
          </label>

          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="font-medium">
            Current Logo
          </label>

          <div className="mt-3 flex min-h-24 items-center">
            {logo ? (
              <Image
                src={logo}
                alt={`${form.name || "Sponsor"} logo`}
                width={150}
                height={80}
                className="h-auto max-h-20 w-auto object-contain"
              />
            ) : (
              <span className="text-sm text-gray-500">
                No logo uploaded.
              </span>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleLogo}
            className="mt-4 w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label
            htmlFor="website"
            className="font-medium"
          >
            Website URL
          </label>

          <input
            id="website"
            name="website"
            type="url"
            value={form.website}
            onChange={handleChange}
            placeholder="https://example.com"
            className="mt-1 w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label
            htmlFor="displayOrder"
            className="font-medium"
          >
            Display Order
          </label>

          <input
            id="displayOrder"
            type="number"
            min="0"
            name="displayOrder"
            value={form.displayOrder}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label
            htmlFor="status"
            className="font-medium"
          >
            Status
          </label>

          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border p-3"
          >
            <option value="ACTIVE">
              Active
            </option>

            <option value="INACTIVE">
              Inactive
            </option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Updating..."
              : "Update Sponsor"}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              router.push(
                "/admin/sponsors"
              )
            }
            className="rounded-lg border px-6 py-3 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
