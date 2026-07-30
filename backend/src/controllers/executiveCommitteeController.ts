import { Request, Response } from "express";
import * as XLSX from "xlsx";
import ExecutiveCommittee from "../models/ExecutiveCommittee";
import cloudinary from "../config/cloudinary";
import { deleteCloudinaryAssets } from "../utils/cloudinaryCleanup";

const statuses = ["active", "inactive"] as const;
type MemberStatus = (typeof statuses)[number];

const normalizeMember = (body: Request["body"]) => {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const designation = typeof body.designation === "string" ? body.designation.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const organization = typeof body.organization === "string" ? body.organization.trim() : "";
  const state = typeof body.state === "string" ? body.state.trim() : "";
  const displayOrder = Number(body.displayOrder);
  const status = body.status === "inactive" ? "inactive" : "active";

  if (!name || !designation || !email || !/^\S+@\S+\.\S+$/.test(email) || !phone || !Number.isInteger(displayOrder) || displayOrder < 0) {
    return null;
  }

  return { name, designation, email, phone, organization, state, displayOrder, status: status as MemberStatus };
};

const uploadPhoto = async (file?: Express.Multer.File) => {
  if (!file) return undefined;
  const result = await cloudinary.uploader.upload(
    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
    { folder: "executive-committee" }
  );
  return result.secure_url;
};

export const getExecutiveCommittee = async (req: Request, res: Response) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const designation = typeof req.query.designation === "string" ? req.query.designation.trim() : "";
    const status = typeof req.query.status === "string" ? req.query.status : "";
    const filter: Record<string, unknown> = {};

    if (search) filter.$or = ["name", "designation", "organization"].map((field) => ({ [field]: { $regex: search, $options: "i" } }));
    if (designation) filter.designation = { $regex: designation, $options: "i" };
    const organization = typeof req.query.organization === "string" ? req.query.organization.trim() : "";
    const state = typeof req.query.state === "string" ? req.query.state.trim() : "";
    if (organization) filter.organization = { $regex: organization, $options: "i" };
    if (state) filter.state = { $regex: state, $options: "i" };
    if (status && statuses.includes(status as MemberStatus)) filter.status = status;

    const [data, total] = await Promise.all([
      ExecutiveCommittee.find(filter).sort({ displayOrder: 1, createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      ExecutiveCommittee.countDocuments(filter),
    ]);

    return res.json({ success: true, data, pagination: { page, limit, total, pages: Math.max(Math.ceil(total / limit), 1) } });
  } catch (error) {
    console.error("Get Executive Committee Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch Executive Committee." });
  }
};

export const getPublicExecutiveCommittee = async (req: Request, res: Response) => {
  const requestedLimit = Number(req.query.limit);
  const limit = Number.isInteger(requestedLimit) && requestedLimit > 0 ? Math.min(requestedLimit, 100) : undefined;

  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const designation = typeof req.query.designation === "string" ? req.query.designation.trim() : "";
    const organization = typeof req.query.organization === "string" ? req.query.organization.trim() : "";
    const state = typeof req.query.state === "string" ? req.query.state.trim() : "";
    const filter: Record<string, unknown> = { status: "active" };
    if (search) filter.$or = ["name", "designation", "organization"].map((field) => ({ [field]: { $regex: search, $options: "i" } }));
    if (designation) filter.designation = { $regex: designation, $options: "i" };
    if (organization) filter.organization = { $regex: organization, $options: "i" };
    if (state) filter.state = { $regex: state, $options: "i" };
    const query = ExecutiveCommittee.find(filter)
      .select("name designation organization state email phone photo displayOrder")
      .sort({ displayOrder: 1, createdAt: 1 });
    if (limit) query.limit(limit);
    const data = await query;
    return res.json({ success: true, data });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to fetch Executive Committee." });
  }
};

export const getExecutiveCommitteeStats = async (_req: Request, res: Response) => {
  try {
    const [total, active, inactive] = await Promise.all([
      ExecutiveCommittee.countDocuments(),
      ExecutiveCommittee.countDocuments({ status: "active" }),
      ExecutiveCommittee.countDocuments({ status: "inactive" }),
    ]);
    return res.json({ success: true, data: { total, active, inactive } });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to fetch member statistics." });
  }
};

export const getExecutiveCommitteeMember = async (req: Request, res: Response) => {
  try {
    const data = await ExecutiveCommittee.findById(req.params.id);
    return data ? res.json({ success: true, data }) : res.status(404).json({ success: false, message: "Member not found." });
  } catch {
    return res.status(400).json({ success: false, message: "Invalid member id." });
  }
};

export const createExecutiveCommittee = async (req: Request, res: Response) => {
  try {
    const member = normalizeMember(req.body);
    if (!member) return res.status(400).json({ success: false, message: "Name, designation, valid email, phone, and non-negative display order are required." });
    const existing = await ExecutiveCommittee.exists({ email: member.email });
    if (existing) return res.status(409).json({ success: false, message: "A member with this email already exists." });
    const photo = await uploadPhoto(req.file);
    const data = await ExecutiveCommittee.create({ ...member, photo: photo || "" });
    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error("Create GNPC Member Error:", error);
    return res.status(500).json({ success: false, message: "Failed to create GNPC Member." });
  }
};

export const updateExecutiveCommittee = async (req: Request, res: Response) => {
  try {
    const member = normalizeMember(req.body);
    if (!member) return res.status(400).json({ success: false, message: "Name, designation, valid email, phone, and non-negative display order are required." });
    const existing = await ExecutiveCommittee.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Member not found." });
    const duplicate = await ExecutiveCommittee.exists({ email: member.email, _id: { $ne: existing._id } });
    if (duplicate) return res.status(409).json({ success: false, message: "A member with this email already exists." });
    const photo = await uploadPhoto(req.file);
    const data = await ExecutiveCommittee.findByIdAndUpdate(req.params.id, { ...member, ...(photo ? { photo } : {}) }, { returnDocument: "after", runValidators: true });
    if (photo && existing.photo !== photo) await deleteCloudinaryAssets([existing.photo]);
    return res.json({ success: true, data });
  } catch (error) {
    console.error("Update GNPC Member Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update GNPC Member." });
  }
};

export const deleteExecutiveCommittee = async (req: Request, res: Response) => {
  try {
    const data = await ExecutiveCommittee.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Member not found." });
    await deleteCloudinaryAssets([data.photo]);
    return res.json({ success: true, message: "Member deleted successfully." });
  } catch {
    return res.status(400).json({ success: false, message: "Invalid member id." });
  }
};

export const importExecutiveCommittee = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ success: false, message: "An .xlsx or .xls file is required." });
  try {
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
  header: 1,
  defval: "",
  blankrows: true,
  raw: false
});

if (!rows.length || !Array.isArray(rows[0])) {
  return res.status(400).json({
    success: false,
    message: "Excel file is empty or invalid.",
  });
}

const headers = (Array.isArray(rows[0]) ? rows[0] : []).map((value: unknown) =>
  String(value ?? "").trim().toLowerCase()
);
    const columns = new Set(headers);
    const requiredColumns = ["name", "designation", "email", "phone", "display order"];
    if (!requiredColumns.every((column) => columns.has(column))) return res.status(400).json({ success: false, message: "Required columns: Name, Designation, Email, Phone, Display Order." });
    const headerIndex = (name: string) => headers.indexOf(name);
    const records = rows.slice(1);
    const existing = await ExecutiveCommittee.find({}, { email: 1, displayOrder: 1 }).lean();
    const existingEmails = new Set(
  existing
    .map((member) => String(member.email ?? "").trim().toLowerCase())
    .filter((email) => email.length > 0)
);

const existingOrders = new Set(
  existing
    .map((member) => Number(member.displayOrder))
    .filter((order) => !Number.isNaN(order))
);
    const seenEmails = new Set<string>();
    const seenOrders = new Set<number>();
    const validMembers: Array<{ name: string; designation: string; email: string; phone: string; organization: string; state: string; displayOrder: number; status: MemberStatus; photo: string }> = [];
    const failedRows: Array<{ row: number; reason: string }> = [];
    console.log("Headers:", headers);
console.log("Existing Members:", existing);
    records.forEach((row, index) => {
      const values = Array.isArray(row) ? row : [];
      const value = (name: string) => String(values[headerIndex(name)] ?? "").trim();
      const name = value("name");
      const designation = value("designation");
      const email = value("email").toLowerCase();
      const phone = value("phone");
      const displayOrderText = value("display order");
      const rowNumber = index + 2;
      const reasons: string[] = [];

      if (!name && !designation && !email && !phone && !displayOrderText) reasons.push("Empty row");
      else {
        if (!name) reasons.push("Name is required");
        if (!designation) reasons.push("Designation is required");
        if (!/^\S+@\S+\.\S+$/.test(email)) reasons.push("Valid email is required");
        if (!/^\+?[0-9\s-]{7,20}$/.test(phone) || phone.replace(/\D/g, "").length < 7 || phone.replace(/\D/g, "").length > 15) reasons.push("Valid phone number is required");
        const displayOrder = Number(displayOrderText);
        if (!Number.isInteger(displayOrder) || displayOrder < 0) reasons.push("Valid display order is required");
        else {
          if (existingOrders.has(displayOrder)) reasons.push("Display order already exists");
          if (seenOrders.has(displayOrder)) reasons.push("Duplicate display order in file");
        }
        if (existingEmails.has(email)) reasons.push("Email already exists");
        if (seenEmails.has(email)) reasons.push("Duplicate email in file");

        if (!reasons.length) {
          validMembers.push({ name, designation, email, phone, organization: value("organization"), state: value("state"), displayOrder, status: value("status").toLowerCase() === "inactive" ? "inactive" : "active", photo: "" });
          seenEmails.add(email);
          seenOrders.add(displayOrder);
        }
      }
      if (reasons.length) failedRows.push({ row: rowNumber, reason: reasons.join("; ") });
    });

    if (validMembers.length) await ExecutiveCommittee.insertMany(validMembers, { ordered: true });
    const summary = { totalRows: records.length, imported: validMembers.length, failed: failedRows.length, failedRows };
    return res.json({ success: true, data: summary });
  } catch (error) {
    console.error("Import Executive Committee Error:", error);
    return res.status(400).json({ success: false, message: "Unable to read the import file." });
  }
};

export const exportExecutiveCommittee = async (req: Request, res: Response) => {
  try {
    const status = typeof req.query.status === "string" ? req.query.status : "";
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const designation = typeof req.query.designation === "string" ? req.query.designation.trim() : "";
    const filter: Record<string, unknown> = {};
    if (status && statuses.includes(status as MemberStatus)) filter.status = status;
    if (search) filter.$or = ["name", "designation", "organization"].map((field) => ({ [field]: { $regex: search, $options: "i" } }));
    if (designation) filter.designation = { $regex: designation, $options: "i" };
    const organization = typeof req.query.organization === "string" ? req.query.organization.trim() : "";
    const state = typeof req.query.state === "string" ? req.query.state.trim() : "";
    if (organization) filter.organization = { $regex: organization, $options: "i" };
    if (state) filter.state = { $regex: state, $options: "i" };
    const members = await ExecutiveCommittee.find(filter).sort({ displayOrder: 1, createdAt: -1 }).lean();
    const rows = members.map((member) => ({ Name: member.name, Designation: member.designation, Organization: member.organization || "", State: member.state || "", Email: member.email, Phone: member.phone, "Display Order": member.displayOrder, Status: member.status, "Created Date": member.createdAt.toISOString() }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Executive Committee");
    const content = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=executive-committee.xlsx");
    return res.send(content);
  } catch {
    return res.status(500).json({ success: false, message: "Failed to export members." });
  }
};
