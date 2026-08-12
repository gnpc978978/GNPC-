"use client";

import { useEffect, useState } from "react";

import ContactTable from "@/components/admin/contact-messages/ContactTable";

import {
  getContactMessages,
  deleteContactMessage,
} from "@/services/contactMessageService";

import { ContactMessage } from "@/types/contactMessage";

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const data = await getContactMessages();
      setMessages(data);
    } catch (error) {
      console.error("Failed to load feedback/messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this feedback/message?")) {
      return;
    }

    try {
      await deleteContactMessage(id);

      setMessages((items) =>
        items.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading feedback & messages...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Feedback & Messages
        </h1>

        <p className="text-gray-500">
          Manage website feedback, contact inquiries and
          messages.
        </p>
      </div>

      <ContactTable
        messages={messages}
        onDelete={handleDelete}
      />
    </div>
  );
}
