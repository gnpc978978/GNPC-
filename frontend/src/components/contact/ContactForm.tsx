"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  apiFetch,
  responseJson,
} from "@/services/api";
import Button from "@/components/ui/Button";

const initialValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

type Feedback = {
  type: "success" | "error";
  message: string;
};

type ContactResponse = {
  success?: boolean;
  message?: string;
};

export default function ContactForm() {
  const [values, setValues] =
    useState(initialValues);

  const [submitting, setSubmitting] =
    useState(false);

  const [feedback, setFeedback] =
    useState<Feedback | null>(null);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const name =
      values.name.trim();

    const email =
      values.email.trim();

    const subject =
      values.subject.trim();

    const message =
      values.message.trim();

    if (
      !name ||
      !email ||
      !subject ||
      !message
    ) {
      setFeedback({
        type: "error",
        message:
          "Please complete all fields before sending your message.",
      });

      return;
    }

    if (
      !/^\S+@\S+\.\S+$/.test(
        email
      )
    ) {
      setFeedback({
        type: "error",
        message:
          "Please enter a valid email address.",
      });

      return;
    }

    try {
      setSubmitting(true);
      setFeedback(null);

      const response =
        await apiFetch(
          "/contact-messages",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Accept:
                "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              subject,
              message,
            }),
          }
        );

      const data =
        await responseJson<ContactResponse>(
          response
        );

      if (
        data.success === false
      ) {
        throw new Error(
          data.message ||
            "Unable to send your message. Please try again."
        );
      }

      setValues(
        initialValues
      );

      setFeedback({
        type: "success",
        message:
          data.message ||
          "Your message has been sent successfully.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to send your message. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Send Us a Message
          </h2>

          <p className="mt-3 text-slate-600">
            Fill out the form below and our
            team will get back to you as soon
            as possible.
          </p>
        </div>

        <form
          className="space-y-6"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="contact-name"
                className="mb-2 block font-medium text-slate-700"
              >
                Full Name
              </label>

              <input
                id="contact-name"
                value={values.name}
                onChange={(event) =>
                  setValues({
                    ...values,
                    name: event.target
                      .value,
                  })
                }
                type="text"
                placeholder="Enter your name"
                autoComplete="name"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                disabled={submitting}
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="mb-2 block font-medium text-slate-700"
              >
                Email Address
              </label>

              <input
                id="contact-email"
                value={values.email}
                onChange={(event) =>
                  setValues({
                    ...values,
                    email: event.target
                      .value,
                  })
                }
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                disabled={submitting}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="contact-subject"
              className="mb-2 block font-medium text-slate-700"
            >
              Subject
            </label>

            <input
              id="contact-subject"
              value={values.subject}
              onChange={(event) =>
                setValues({
                  ...values,
                  subject:
                    event.target.value,
                })
              }
              type="text"
              placeholder="Subject"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              disabled={submitting}
            />
          </div>

          <div>
            <label
              htmlFor="contact-message"
              className="mb-2 block font-medium text-slate-700"
            >
              Message
            </label>

            <textarea
              id="contact-message"
              value={values.message}
              onChange={(event) =>
                setValues({
                  ...values,
                  message:
                    event.target.value,
                })
              }
              rows={6}
              placeholder="Write your message..."
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              disabled={submitting}
            />
          </div>

          {feedback && (
            <p
              role={
                feedback.type ===
                "error"
                  ? "alert"
                  : "status"
              }
              className={`rounded-lg p-3 text-sm ${
                feedback.type ===
                "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {feedback.message}
            </p>
          )}

          <Button type="submit" loading={submitting} loadingText="Sending..." className="w-full" size="lg">Send Message</Button>
        </form>
      </div>
    </section>
  );
}
