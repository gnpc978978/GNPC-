"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MainLayout from "../../components/layout/MainLayout";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import EventCalendar from "../../components/home/EventCalendar";
import AnnouncementBanner from "../../components/home/AnnouncementBanner";
import AdvertisementBanner from "../../components/home/AdvertisementBanner";
import HeroBanner from "../../components/home/HeroBanner";
import {
  Newspaper,
  Calendar,
  Award,
  Users,
  ArrowRight,
  TrendingUp,
  Image as ImageIcon,
} from "lucide-react";

interface LatestUpdateItem {
  _id: string;
  title: string;
  category: string;
  imageUrl?: string;
  image?: string;
  createdAt?: string;
  date?: string;
}

interface GalleryItem {
  _id: string;
  title: string;
  imageUrl?: string;
  url?: string;
  category?: string;
  createdAt?: string;
}

export default function Home() {
  const [latestUpdates, setLatestUpdates] = useState<LatestUpdateItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loadingUpdates, setLoadingUpdates] = useState(true);
  const [loadingGallery, setLoadingGallery] = useState(true);

  useEffect(() => {
    const fetchLatestUpdates = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const res = await fetch(
          `${apiUrl}/api/latest-updates/public`
        );

        if (res.ok) {
          const result = await res.json();

          const items = Array.isArray(result)
            ? result
            : result.data || result.updates || [];

          setLatestUpdates(items.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching latest updates:", error);
      } finally {
        setLoadingUpdates(false);
      }
    };

    const fetchGallery = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const res = await fetch(
          `${apiUrl}/api/gallery/public`
        );

        if (res.ok) {
          const result = await res.json();

          const items = Array.isArray(result)
            ? result
            : result.data || result.images || [];

          setGalleryItems(items.slice(0, 6));
        }
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoadingGallery(false);
      }
    };

    fetchLatestUpdates();
    fetchGallery();
  }, []);

  const quickStats = [
    {
      label: "Active Members",
      value: "500+",
      icon: Users,
    },
    {
      label: "Years of Excellence",
      value: "25+",
      icon: Award,
    },
    {
      label: "Events Organized",
      value: "100+",
      icon: Calendar,
    },
    {
      label: "Press Releases",
      value: "200+",
      icon: Newspaper,
    },
  ];

  return (
    <MainLayout>
      {/* Announcement Banner */}
      <AnnouncementBanner />

      {/* Hero Banner Carousel */}
      <HeroBanner />

      {/* Quick Stats Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {quickStats.map((stat, idx) => {
              const Icon = stat.icon;

              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center transform hover:-translate-y-1 transition-all duration-200 border border-gray-100 dark:border-gray-700"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 mb-4">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates & Event Calendar Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Latest Updates Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                    Latest Updates
                  </h2>

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Stay informed with our recent announcements and developments
                  </p>
                </div>

                <Button variant="outline" asChild size="sm">
                  <Link
                    href="/latest-updates"
                    className="flex items-center gap-1"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>

              {loadingUpdates ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg"
                    />
                  ))}
                </div>
              ) : latestUpdates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {latestUpdates.map((item) => {
                    const imageSrc =
                      item.imageUrl ||
                      item.image ||
                      "/placeholder.jpg";

                    const displayDate = item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : item.date || "";

                    return (
                      <Card
                        key={item._id}
                        className="overflow-hidden hover:shadow-md transition-shadow dark:bg-gray-800"
                      >
                        <div className="relative h-40 w-full bg-gray-100 dark:bg-gray-700">
                          <Image
                            src={imageSrc}
                            alt={item.title || "Update image"}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span className="bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded font-medium">
                              {item.category || "General"}
                            </span>

                            {displayDate && (
                              <span>{displayDate}</span>
                            )}
                          </div>

                          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 hover:text-blue-600 transition-colors">
                            {item.title}
                          </h3>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">
                    No recent updates available at the moment.
                  </p>
                </div>
              )}
            </div>

            {/* Event Calendar Sidebar */}
            <div className="space-y-6">
              <EventCalendar />
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement Banner */}
      <AdvertisementBanner />

      {/* Photo & Video Gallery Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-blue-600" />
                Media Gallery
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Glimpses of our activities and events
              </p>
            </div>

            <Button variant="outline" asChild size="sm">
              <Link
                href="/gallery"
                className="flex items-center gap-1"
              >
                Explore Gallery
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {loadingGallery ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : galleryItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryItems.map((item) => {
                const imageSrc =
                  item.imageUrl ||
                  item.url ||
                  "/placeholder.jpg";

                return (
                  <div
                    key={item._id}
                    className="group relative h-48 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-sm"
                  >
                    <Image
                      src={imageSrc}
                      alt={item.title || "Gallery photo"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                      <p className="text-white font-medium text-sm line-clamp-1">
                        {item.title}
                      </p>

                      {item.category && (
                        <p className="text-gray-300 text-xs">
                          {item.category}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">
                No gallery images found.
              </p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
