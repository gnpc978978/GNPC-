"use client";

import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { motion } from "framer-motion";

import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";
import { mergePageSettings } from "@/types/pageSettings";
import {
  apiFetch,
  responseJson,
} from "@/services/api";

type UpdateType =
  | "press-releases"
  | "announcements"
  | "events";

type CalendarType =
  | "event"
  | "press-conference";

type Tab =
  | "all"
  | UpdateType;

type DateFilter =
  | "all"
  | "upcoming"
  | "past";

type Update = {
  _id: string;
  slug?: string;
  title: string;
  content?: string;
  description?: string;
  image?: string;
  banner?: string;
  category?: string;
  createdAt?: string;
  publishedAt?: string;
  date?: string;
  location?: string;
  venue?: string;
  status?: string;
};

type Event = {
  _id: string;
  title: string;
  banner?: string;
  gallery?: string[];
  description?: string;
  content?: string;
  location?: string;
  date: string;
  time?: string;
  organizer?: string;
  slug?: string;
  status?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type PressConference = {
  _id: string;
  title: string;
  venue?: string;
  date: string;
  description?: string;
  content?: string;
  featuredImage?: string;
  pdfFile?: string;
  createdAt?: string;
  updatedAt?: string;
};

type FeedResponse = {
  pressReleases?: Update[];
  announcements?: Update[];
  events?: Update[];
};

type CalendarItem = {
  id: string;
  type: CalendarType;
  title: string;
  description: string;
  date: string;
  location?: string;
  image?: string;
  href: string;
};

const tabValues: Tab[] = [
  "all",
  "press-releases",
  "announcements",
  "events",
];

const typeLabels: Record<
  UpdateType,
  string
> = {
  "press-releases":
    "Press Release",
  announcements:
    "Announcement",
  events: "Event",
};

const detailPaths: Record<
  UpdateType,
  string
> = {
  "press-releases":
    "/press-releases",
  announcements:
    "/announcements",
  events: "/events",
};

const plainText = (
  value?: string
) =>
  (value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

const formatDate = (
  value?: string
) => {
  if (!value) {
    return "Recently published";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Recently published";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(date);
};

const formatShortDate = (
  value: string
) => {
  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "numeric",
      month: "short",
    }
  ).format(date);
};

const isValidDate = (
  value?: string
) => {
  if (!value) {
    return false;
  }

  return !Number.isNaN(
    new Date(value).getTime()
  );
};

const getDayKey = (
  value: Date | string
) => {
  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getMonthStart = (
  date: Date
) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  );

const getMonthEnd = (
  date: Date
) =>
  new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  );

const addMonths = (
  date: Date,
  amount: number
) =>
  new Date(
    date.getFullYear(),
    date.getMonth() + amount,
    1
  );

const getCalendarDays = (
  month: Date
) => {
  const firstDay =
    getMonthStart(month);

  const lastDay =
    getMonthEnd(month);

  const startOffset =
    firstDay.getDay();

  const totalDays =
    lastDay.getDate();

  const days: Date[] = [];

  for (
    let index = 0;
    index < startOffset;
    index++
  ) {
    const date =
      new Date(firstDay);

    date.setDate(
      date.getDate() -
        (startOffset - index)
    );

    days.push(date);
  }

  for (
    let day = 1;
    day <= totalDays;
    day++
  ) {
    days.push(
      new Date(
        month.getFullYear(),
        month.getMonth(),
        day
      )
    );
  }

  while (days.length < 42) {
    const last =
      days[days.length - 1];

    const next =
      new Date(last);

    next.setDate(
      next.getDate() + 1
    );

    days.push(next);
  }

  return days;
};

const getEventHref = (
  event: Event
) =>
  `/events/${encodeURIComponent(
    event.slug || event._id
  )}`;

const getPressConferenceHref = (
  item: PressConference
) =>
  `/press-conference/${encodeURIComponent(
    item._id
  )}`;

function Skeletons() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from(
        { length: 6 },
        (_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
          >
            <div className="aspect-[16/9] animate-pulse bg-slate-200" />

            <div className="space-y-4 p-6">
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
              <div className="h-7 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        )
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-[#d4b06a]/50 bg-white px-6 py-20 text-center shadow-sm">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f7f2e6] text-[#9a7631]">
        <Sparkles size={36} />
      </div>

      <h2 className="mt-6 text-2xl font-bold text-slate-900">
        No updates available.
      </h2>

      <p className="mx-auto mt-3 max-w-md text-slate-600">
        Please check back soon for press releases,
        announcements, events, and press conferences.
      </p>
    </div>
  );
}

function UpdatesCalendar({
  items,
}: {
  items: CalendarItem[];
}) {
  const today = new Date();

  const [
    currentMonth,
    setCurrentMonth,
  ] = useState(
    new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    )
  );

  const [
    selectedDate,
    setSelectedDate,
  ] = useState<string | null>(
    null
  );

  const [
    dateFilter,
    setDateFilter,
  ] =
    useState<DateFilter>("all");

  const monthDays =
    useMemo(
      () =>
        getCalendarDays(
          currentMonth
        ),
      [currentMonth]
    );

  const filteredItems =
    useMemo(() => {
      const now = new Date();

      return items.filter(
        (item) => {
          const itemDate =
            new Date(item.date);

          if (
            Number.isNaN(
              itemDate.getTime()
            )
          ) {
            return false;
          }

          if (
            dateFilter ===
            "upcoming"
          ) {
            return itemDate >= now;
          }

          if (
            dateFilter === "past"
          ) {
            return itemDate < now;
          }

          return true;
        }
      );
    }, [
      items,
      dateFilter,
    ]);

  const itemsByDay =
    useMemo(() => {
      const map = new Map<
        string,
        CalendarItem[]
      >();

      filteredItems.forEach(
        (item) => {
          const key =
            getDayKey(
              item.date
            );

          if (!key) {
            return;
          }

          const existing =
            map.get(key) || [];

          existing.push(item);

          map.set(
            key,
            existing
          );
        }
      );

      return map;
    }, [filteredItems]);

  const selectedItems =
    selectedDate
      ? itemsByDay.get(
          selectedDate
        ) || []
      : [];

  const monthLabel =
    new Intl.DateTimeFormat(
      "en-IN",
      {
        month: "long",
        year: "numeric",
      }
    ).format(
      currentMonth
    );

  const previousMonth =
    () => {
      setCurrentMonth(
        addMonths(
          currentMonth,
          -1
        )
      );

      setSelectedDate(null);
    };

  const nextMonth = () => {
    setCurrentMonth(
      addMonths(
        currentMonth,
        1
      )
    );

    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentMonth(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );

    setSelectedDate(
      getDayKey(today)
    );
  };

  const visibleItems =
    selectedDate
      ? selectedItems
      : filteredItems
          .slice()
          .sort(
            (a, b) =>
              new Date(
                a.date
              ).getTime() -
              new Date(
                b.date
              ).getTime()
          )
          .slice(0, 6);

  return (
    <section className="mt-14">
      <div className="mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#9a7631]">
              Schedule
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              Events & Press Conferences
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              View upcoming and previous GNPC events and
              press conferences by date.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                ["all", "All"],
                [
                  "upcoming",
                  "Upcoming",
                ],
                ["past", "Past"],
              ] as const
            ).map(
              ([
                value,
                label,
              ]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setDateFilter(
                      value
                    )
                  }
                  className={[
                    "rounded-full px-4 py-2 text-sm font-bold transition",
                    dateFilter ===
                    value
                      ? "bg-[#0b1f3a] text-white shadow-md"
                      : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-[#f7f2e6] hover:text-[#9a7631]",
                  ].join(
                    " "
                  )}
                >
                  {label}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">
        <div className="min-w-0 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 px-3 py-4 sm:px-6">
            <button
              type="button"
              onClick={
                previousMonth
              }
              aria-label="Previous month"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-[#f7f2e6] hover:text-[#9a7631]"
            >
              <ChevronLeft
                size={20}
              />
            </button>

            <div className="min-w-0 text-center">
              <h3 className="truncate text-lg font-black text-slate-900 sm:text-xl">
                {monthLabel}
              </h3>

              <button
                type="button"
                onClick={
                  goToToday
                }
                className="mt-1 text-xs font-bold text-[#9a7631] hover:underline"
              >
                Today
              </button>
            </div>

            <button
              type="button"
              onClick={
                nextMonth
              }
              aria-label="Next month"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-[#f7f2e6] hover:text-[#9a7631]"
            >
              <ChevronRight
                size={20}
              />
            </button>
          </div>

          <div className="p-2 sm:p-5">
            <div className="grid grid-cols-7 border-b border-slate-100 pb-2">
              {[
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
              ].map(
                (day) => (
                  <div
                    key={day}
                    className="min-w-0 py-2 text-center text-[9px] font-extrabold uppercase tracking-wide text-slate-400 sm:text-xs"
                  >
                    {day}
                  </div>
                )
              )}
            </div>

            <div className="grid grid-cols-7">
              {monthDays.map(
                (date) => {
                  const key =
                    getDayKey(
                      date
                    );

                  const dayItems =
                    itemsByDay.get(
                      key
                    ) || [];

                  const isCurrentMonth =
                    date.getMonth() ===
                      currentMonth.getMonth() &&
                    date.getFullYear() ===
                      currentMonth.getFullYear();

                  const isToday =
                    key ===
                    getDayKey(
                      today
                    );

                  const isSelected =
                    key ===
                    selectedDate;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        setSelectedDate(
                          key
                        )
                      }
                      className={[
                        "relative min-w-0 min-h-[68px] overflow-hidden border-b border-r border-slate-100 p-1 text-left transition sm:min-h-[92px] sm:p-2",
                        "hover:bg-[#f7f2e6]",
                        !isCurrentMonth
                          ? "bg-slate-50/60 text-slate-300"
                          : "text-slate-700",
                        isSelected
                          ? "bg-[#f7f2e6] ring-2 ring-inset ring-[#d4b06a]"
                          : "",
                      ].join(
                        " "
                      )}
                    >
                      <span
                        className={[
                          "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold sm:h-8 sm:w-8 sm:text-sm",
                          isToday
                            ? "bg-[#0b1f3a] text-white"
                            : "",
                        ].join(
                          " "
                        )}
                      >
                        {date.getDate()}
                      </span>

                      {dayItems.length >
                        0 && (
                        <div className="mt-1 space-y-1">
                          {dayItems
                            .slice(
                              0,
                              2
                            )
                            .map(
                              (
                                item
                              ) => (
                                <span
                                  key={`${item.type}-${item.id}`}
                                  className={[
                                    "block max-w-full truncate rounded px-1 py-1 text-[8px] font-bold leading-none sm:px-1.5 sm:text-[10px]",
                                    item.type ===
                                    "event"
                                      ? "bg-[#f0e5c9] text-[#7c5e25]"
                                      : "bg-purple-100 text-purple-800",
                                  ].join(
                                    " "
                                  )}
                                >
                                  {
                                    item.title
                                  }
                                </span>
                              )
                            )}

                          {dayItems.length >
                            2 && (
                            <span className="block px-1 text-[8px] font-bold text-slate-400 sm:text-[9px]">
                              +
                              {dayItems.length -
                                2}{" "}
                              more
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 border-t border-slate-100 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span className="h-3 w-3 rounded-full bg-[#d4b06a]" />
              Events
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span className="h-3 w-3 rounded-full bg-purple-500" />
              Press Conferences
            </div>
          </div>
        </div>

        <div className="min-w-0 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#9a7631]">
                {selectedDate
                  ? "Selected Date"
                  : "Schedule"}
              </p>

              <h3 className="mt-2 break-words text-xl font-black text-slate-900">
                {selectedDate
                  ? formatDate(
                      selectedDate
                    )
                  : "Events & Press Conferences"}
              </h3>
            </div>

            {selectedDate && (
              <button
                type="button"
                onClick={() =>
                  setSelectedDate(
                    null
                  )
                }
                className="shrink-0 text-xs font-bold text-slate-500 hover:text-[#9a7631]"
              >
                Clear
              </button>
            )}
          </div>

          <div className="mt-6 space-y-3">
            {visibleItems
              .length === 0 ? (
              <div className="rounded-2xl bg-slate-50 px-5 py-10 text-center">
                <CalendarDays
                  className="mx-auto text-slate-400"
                  size={32}
                />

                <p className="mt-3 text-sm font-semibold text-slate-500">
                  No events on this date.
                </p>
              </div>
            ) : (
              visibleItems.map(
                (item) => (
                  <Link
                    key={`${item.type}-${item.id}`}
                    href={
                      item.href
                    }
                    className="group block rounded-2xl border border-slate-200 p-4 transition hover:border-[#d4b06a]/50 hover:bg-[#f7f2e6]/50"
                  >
                    <div className="flex min-w-0 gap-3 sm:gap-4">
                      <div
                        className={[
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                          item.type ===
                          "event"
                            ? "bg-[#f0e5c9] text-[#9a7631]"
                            : "bg-purple-100 text-purple-700",
                        ].join(
                          " "
                        )}
                      >
                        <CalendarDays
                          size={20}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={[
                              "text-[10px] font-extrabold uppercase tracking-wide",
                              item.type ===
                              "event"
                                ? "text-[#9a7631]"
                                : "text-purple-700",
                            ].join(
                              " "
                            )}
                          >
                            {item.type ===
                            "event"
                              ? "Event"
                              : "Press Conference"}
                          </span>

                          <span className="text-xs text-slate-400">
                            {formatShortDate(
                              item.date
                            )}
                          </span>
                        </div>

                        <h4 className="mt-1 line-clamp-2 text-sm font-extrabold text-slate-900 group-hover:text-[#9a7631]">
                          {
                            item.title
                          }
                        </h4>

                        {item.location && (
                          <p className="mt-1 flex min-w-0 items-center gap-1 truncate text-xs text-slate-500">
                            <MapPin
                              size={13}
                              className="shrink-0"
                            />
                            <span className="truncate">
                              {
                                item.location
                              }
                            </span>
                          </p>
                        )}
                      </div>

                      <ChevronRight
                        size={18}
                        className="mt-1 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#9a7631]"
                      />
                    </div>
                  </Link>
                )
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LatestUpdatesPage() {
  const { settings } = useWebsiteSettings();
  const pageSettings = mergePageSettings(
    settings.pageSettings
  ).latestUpdates;

  const tabs = tabValues.map((value) => ({
    value,
    label:
      value === "all"
        ? pageSettings.allTabLabel
        : value === "press-releases"
          ? pageSettings.pressReleasesTabLabel
          : value === "announcements"
            ? pageSettings.announcementsTabLabel
            : pageSettings.eventsTabLabel,
  }));

  const router =
    useRouter();

  const pathname =
    usePathname();

  const searchParams =
    useSearchParams();

  const requestedTab =
    searchParams.get(
      "tab"
    );

  const tab: Tab = tabs.some(
    ({ value }) =>
      value ===
      requestedTab
  )
    ? (requestedTab as Tab)
    : "all";

  const [feed, setFeed] =
    useState<FeedResponse>({
      pressReleases: [],
      announcements: [],
      events: [],
    });

  const [events, setEvents] =
    useState<Event[]>([]);

  const [
    pressConferences,
    setPressConferences,
  ] =
    useState<
      PressConference[]
    >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(
      null
    );

  const [query, setQuery] =
    useState("");

  const [
    sortOrder,
    setSortOrder,
  ] =
    useState<
      "newest" | "oldest"
    >("newest");

  const loadFeed =
    async () => {
      setLoading(true);
      setError(null);

      try {
        const [
          latestResponse,
          eventsResponse,
          conferencesResponse,
        ] = await Promise.all([
          apiFetch(
            "/latest-updates"
          ),
          apiFetch("/events"),
          apiFetch(
            "/press-conferences"
          ),
        ]);

        const latest =
          await responseJson<FeedResponse>(
            latestResponse
          );

        const eventsPayload =
          await responseJson<{
            success?: boolean;
            data?: Event[];
          }>(
            eventsResponse
          );

        const conferencesPayload =
          await responseJson<{
            success?: boolean;
            data?: PressConference[];
          }>(
            conferencesResponse
          );

        setFeed({
          pressReleases:
            latest.pressReleases ||
            [],
          announcements:
            latest.announcements ||
            [],
          events:
            latest.events ||
            [],
        });

        setEvents(
          Array.isArray(
            eventsPayload.data
          )
            ? eventsPayload.data
            : []
        );

        setPressConferences(
          Array.isArray(
            conferencesPayload.data
          )
            ? conferencesPayload.data
            : []
        );
      } catch (err) {
        console.error(
          "Failed to load latest updates:",
          err
        );

        setError(
          "We couldn’t load the latest updates. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    void loadFeed();
  }, []);

  const calendarItems =
    useMemo<
      CalendarItem[]
    >(() => {
      const normalizedEvents =
        events
          .filter(
            (event) =>
              event._id &&
              isValidDate(
                event.date
              )
          )
          .map(
            (
              event
            ): CalendarItem => ({
              id: event._id,
              type: "event",
              title:
                event.title,
              description:
                plainText(
                  event.description ||
                    event.content
                ) ||
                "GNPC event",
              date:
                event.date,
              location:
                event.location,
              image:
                event.banner,
              href:
                getEventHref(
                  event
                ),
            })
          );

      const normalizedConferences =
        pressConferences
          .filter(
            (item) =>
              item._id &&
              isValidDate(
                item.date
              )
          )
          .map(
            (
              item
            ): CalendarItem => ({
              id: item._id,
              type:
                "press-conference",
              title:
                item.title,
              description:
                plainText(
                  item.description ||
                    item.content
                ) ||
                "GNPC press conference",
              date:
                item.date,
              location:
                item.venue,
              image:
                item.featuredImage,
              href:
                getPressConferenceHref(
                  item
                ),
            })
          );

      return [
        ...normalizedEvents,
        ...normalizedConferences,
      ].sort(
        (a, b) =>
          new Date(
            a.date
          ).getTime() -
          new Date(
            b.date
          ).getTime()
      );
    }, [
      events,
      pressConferences,
    ]);

  const updates =
    (() => {
      const source: Array<
        Update & {
          type: UpdateType;
        }
      > = [
        ...(feed.pressReleases ||
          []).map(
          (item) => ({
            ...item,
            type:
              "press-releases" as const,
          })
        ),

        ...(feed.announcements ||
          []).map(
          (item) => ({
            ...item,
            type:
              "announcements" as const,
          })
        ),

        ...(feed.events ||
          []).map(
          (item) => ({
            ...item,
            type:
              "events" as const,
          })
        ),
      ];

      const normalizedQuery =
        query
          .trim()
          .toLowerCase();

      return source
        .filter(
          (item) => {
            const searchableText =
              `${item.title} ${
                item.description ||
                item.content ||
                ""
              }`.toLowerCase();

            return (
              (tab ===
                "all" ||
                item.type ===
                  tab) &&
              (!normalizedQuery ||
                searchableText.includes(
                  normalizedQuery
                ))
            );
          }
        )
        .sort(
          (a, b) => {
            const aDate =
              new Date(
                a.publishedAt ||
                  a.date ||
                  a.createdAt ||
                  0
              ).getTime();

            const bDate =
              new Date(
                b.publishedAt ||
                  b.date ||
                  b.createdAt ||
                  0
              ).getTime();

            return sortOrder ===
              "newest"
              ? bDate - aDate
              : aDate - bDate;
          }
        )
        .slice(
          0,
          Math.max(1, Math.min(100, Number(pageSettings.pageSize) || 12))
        );
    })();

  const selectTab = (
    value: Tab
  ) => {
    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    if (
      value === "all"
    ) {
      params.delete(
        "tab"
      );
    } else {
      params.set(
        "tab",
        value
      );
    }

    router.replace(
      params.size
        ? `${pathname}?${params}`
        : pathname,
      {
        scroll: false,
      }
    );
  };

  return (
    <main>
      <PageHero
        eyebrow={pageSettings.pageEyebrow}
        title={pageSettings.pageTitle}
        description={pageSettings.pageDescription}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: pageSettings.pageTitle },
        ]}
      />

      <section className="min-h-screen bg-[#f4f7fb] py-14 sm:py-20">
      <Container>
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {tabs.map(
              ({
                value,
                label,
              }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    selectTab(
                      value
                    )
                  }
                  className={[
                    "rounded-full px-4 py-2.5 text-sm font-bold transition",
                    tab === value
                      ? "bg-[#0b1f3a] text-white shadow-lg shadow-blue-700/20"
                      : "text-slate-600 hover:bg-[#f7f2e6] hover:text-[#9a7631]",
                  ].join(
                    " "
                  )}
                >
                  {label}
                </button>
              )
            )}
          </div>

          {pageSettings.showSearch || pageSettings.showSort ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            {pageSettings.showSearch && (
            <label className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <input
                value={query}
                onChange={(
                  event
                ) =>
                  setQuery(
                    event.target
                      .value
                  )
                }
                placeholder={pageSettings.searchPlaceholder}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#d4b06a] focus:ring-4 focus:ring-[#d4b06a]/20 sm:w-60"
              />
            </label>
            )}

            {pageSettings.showSort && (
            <select
              value={sortOrder}
              onChange={(
                event
              ) =>
                setSortOrder(
                  event.target
                    .value as
                    | "newest"
                    | "oldest"
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-[#d4b06a]"
            >
              <option value="newest">
                Newest first
              </option>

              <option value="oldest">
                Oldest first
              </option>
            </select>
            )}
          </div>
          ) : null}
        </div>

        {pageSettings.showCalendar &&
          !loading &&
          !error && (
            <UpdatesCalendar
              items={
                calendarItems
              }
            />
          )}

        <div className="mt-14">
          {loading ? (
            <Skeletons />
          ) : error ? (
            <div className="rounded-3xl bg-red-50 px-6 py-12 text-center text-red-700">
              <p className="font-semibold">
                {error}
              </p>

              <button
                type="button"
                onClick={
                  loadFeed
                }
                className="mt-4 rounded-xl bg-red-700 px-4 py-2 text-sm font-bold text-white"
              >
                Try again
              </button>
            </div>
          ) : updates.length ===
            0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {updates.map(
                (
                  item,
                  index
                ) => {
                  const image =
                    item.image ||
                    item.banner;

                  const date =
                    item.publishedAt ||
                    item.date ||
                    item.createdAt;

                  const description =
                    plainText(
                      item.description ||
                        item.content
                    ) ||
                    "Read the latest update from Greater Noida Press Club.";

                  return (
                    <motion.article
                      key={`${item.type}-${item._id}`}
                      initial={{
                        opacity: 0,
                        y: 24,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration:
                          0.38,
                        delay: Math.min(
                          index *
                            0.05,
                          0.25
                        ),
                      }}
                      className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-xl"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                        {image ? (
                          <img
                            src={image}
                            alt={
                              item.title
                            }
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[#9a7631]">
                            <FileText
                              size={48}
                            />
                          </div>
                        )}

                        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-[#7c5e25] shadow-sm">
                          {item.category ||
                            typeLabels[
                              item.type
                            ]}
                        </span>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                          <CalendarDays
                            size={16}
                            className="text-[#b08a3e]"
                          />

                          {formatDate(
                            date
                          )}
                        </div>

                        <h2 className="mt-4 line-clamp-2 text-xl font-extrabold text-slate-900">
                          {
                            item.title
                          }
                        </h2>

                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                          {
                            description
                          }
                        </p>

                        <Link
                          href={`${detailPaths[item.type]}/${encodeURIComponent(
                            item.slug ||
                              item._id
                          )}`}
                          className="mt-6 inline-flex items-center gap-1 text-sm font-extrabold text-[#9a7631] transition group-hover:gap-2"
                        >
                          {pageSettings.readMoreLabel}
                          <ChevronRight
                            size={
                              17
                            }
                          />
                        </Link>
                      </div>
                    </motion.article>
                  );
                }
              )}
            </div>
          )}
        </div>
      </Container>
      </section>
    </main>
  );
}
