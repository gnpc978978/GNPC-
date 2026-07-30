"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import SettingsSidebar from "@/components/admin/settings/SettingsSidebar";
import FileUpload from "@/components/admin/settings/FileUpload";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const authOptions = () => ({
  credentials: "include" as RequestCredentials,
  headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
});

interface Settings {
  siteName: string;
  heroTitle: string;
  heroDescription: string;
  email: string;
  phone: string;
  address: string;
  socialLinks?: { facebook?: string; twitter?: string; instagram?: string; linkedin?: string };
  seo?: { title?: string; description?: string; keywords?: string[] };
}

export default function WebsiteSettings() {
  const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    siteName: "",
    heroTitle: "",
    heroDescription: "",
    email: "",
    phone: "",
    address: "",
    socialLinks: {},
    seo: {},
  });

  const [logo, setLogo] =
    useState<File | null>(null);

  const [favicon, setFavicon] =
    useState<File | null>(null);

  const [heroImage, setHeroImage] =
    useState<File | null>(null);

  const [membershipPdf, setMembershipPdf] =
    useState<File | null>(null);
  const [aboutImage, setAboutImage] = useState<File | null>(null);

  const fetchSettings = async () => {
    try {
      const res = await fetch(
        `${API_URL}/settings`
      );

      const data = await res.json();

      if (data.success) {
        setSettings({
          siteName: data.data.siteName || "",
          heroTitle: data.data.heroTitle || "",
          heroDescription:
            data.data.heroDescription || "",
          email: data.data.email || "",
          phone: data.data.phone || "",
          address: data.data.address || "",
          socialLinks: data.data.socialLinks || {},
          seo: data.data.seo || {},
        });
      }
    } catch (error) {
      toast.error("Unable to load website settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

 const updateSettings = async () => {
  const res = await fetch(
    `${API_URL}/settings`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authOptions().headers,
      },
      credentials: "include",
      body: JSON.stringify(settings),
    }
  );

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(
      data.message || "Failed to update settings."
    );
  }

  return data;
};

  const uploadFiles = async () => {
  if (
    !logo &&
    !favicon &&
    !heroImage &&
    !membershipPdf
    && !aboutImage
  ) {
    return;
  }

  const formData = new FormData();

  if (logo) {
    formData.append("logo", logo);
  }

  if (favicon) {
    formData.append("favicon", favicon);
  }

  if (heroImage) {
    formData.append("heroImage", heroImage);
  }

  if (membershipPdf) {
    formData.append(
      "membershipPdf",
      membershipPdf
    );
  }
  if (aboutImage) formData.append("aboutImage", aboutImage);

  const res = await fetch(
    `${API_URL}/settings/upload`,
    {
      method: "PUT",
      ...authOptions(),
      body: formData,
    }
  );

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(
      data.message || "File upload failed."
    );
  }

  return data;
};

  const handleSave = async () => {
  try {
    if (!settings.siteName.trim()) {
      toast.error("Site name is required.");
      return;
    }

    setSaving(true);

    await updateSettings();

    await uploadFiles();

    await fetchSettings();

    toast.success(
      "Website settings updated successfully."
    );
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Something went wrong."
    );
  } finally {
    setSaving(false);
  }
};

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Website Settings
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <SettingsSidebar />
        </div>

        <div className="rounded-xl bg-white p-8 shadow md:col-span-2">
          {loading ? <div className="space-y-5"><div className="h-10 w-1/3 animate-pulse rounded bg-slate-200" /><div className="h-12 animate-pulse rounded bg-slate-200" /><div className="h-32 animate-pulse rounded bg-slate-200" /></div> :
          <div className="space-y-8">
            <div>
              <h2 className="mb-4 text-2xl font-semibold">
                Site Information
              </h2>

              <input
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                className="mb-4 w-full rounded-lg border p-3"
                placeholder="Site Name"
              />

              <FileUpload
                label="Logo"
                accept="image/*"
                onChange={setLogo}
              />

              <div className="mt-4">
                <FileUpload
                  label="Favicon"
                  accept="image/*"
                  onChange={setFavicon}
                />
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-semibold">
                Hero Section
              </h2>

              <input
                name="heroTitle"
                value={settings.heroTitle}
                onChange={handleChange}
                className="mb-4 w-full rounded-lg border p-3"
                placeholder="Hero Title"
              />

              <textarea
                name="heroDescription"
                value={
                  settings.heroDescription
                }
                onChange={handleChange}
                rows={4}
                className="mb-4 w-full rounded-lg border p-3"
                placeholder="Hero Description"
              />

              <FileUpload
                label="Hero Image"
                accept="image/*"
                onChange={setHeroImage}
              />
              <div className="mt-4"><FileUpload label="About Image" accept="image/*" onChange={setAboutImage} /></div>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-semibold">
                Contact Information
              </h2>

              <input
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="mb-4 w-full rounded-lg border p-3"
                placeholder="Email"
              />

              <input
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                className="mb-4 w-full rounded-lg border p-3"
                placeholder="Phone"
              />

              <textarea
                name="address"
                value={settings.address}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border p-3"
                placeholder="Address"
              />
            </div>
            <div>
              <h2 className="mb-4 text-2xl font-semibold">Social Links</h2>
              {(["facebook", "twitter", "instagram", "linkedin"] as const).map((network) => <input key={network} value={settings.socialLinks?.[network] || ""} onChange={(event) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, [network]: event.target.value } })} className="mb-3 w-full rounded-lg border p-3" placeholder={`${network.charAt(0).toUpperCase()}${network.slice(1)} URL`} />)}
            </div>
            <div>
              <h2 className="mb-4 text-2xl font-semibold">SEO Settings</h2>
              <input value={settings.seo?.title || ""} onChange={(event) => setSettings({ ...settings, seo: { ...settings.seo, title: event.target.value } })} className="mb-3 w-full rounded-lg border p-3" placeholder="SEO title" />
              <textarea value={settings.seo?.description || ""} onChange={(event) => setSettings({ ...settings, seo: { ...settings.seo, description: event.target.value } })} className="w-full rounded-lg border p-3" placeholder="SEO description" />
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-semibold">
                Membership
              </h2>

              <FileUpload
                label="Membership PDF"
                accept=".pdf"
                onChange={setMembershipPdf}
              />
            </div>

            <button
  onClick={handleSave}
  disabled={saving}
  className="
    rounded-lg
    bg-blue-600
    px-6
    py-3
    text-white
    transition
    hover:bg-blue-700
    disabled:cursor-not-allowed
    disabled:opacity-60
  "
>
  {saving ? "Saving..." : "Save Changes"}
</button>
          </div>}
        </div>
      </div>
    </div>
  );
}
