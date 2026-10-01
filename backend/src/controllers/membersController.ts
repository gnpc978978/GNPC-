import { Request, Response } from "express";
import * as XLSX from "xlsx";
import Member from "../models/Member";
import cloudinary from "../config/cloudinary";
import { deleteCloudinaryAssets } from "../utils/cloudinaryCleanup";

const statuses = ["active", "inactive"] as const;
type MemberStatus = (typeof statuses)[number];

const DEFAULT_MEMBER_PHOTO = "/images/members/default.png";

const normalizeMember = (body: Request["body"]) => {
  const name =
    typeof body.name === "string"
      ? body.name.trim()
      : "";

  const designation =
    typeof body.designation === "string"
      ? body.designation.trim()
      : "";

  const email =
    typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";

  const phone =
    typeof body.phone === "string"
      ? body.phone.trim()
      : "";

  const organization =
    typeof body.organization === "string"
      ? body.organization.trim()
      : "";

  const state =
    typeof body.state === "string"
      ? body.state.trim()
      : "";

  const displayOrder = Number(
    body.displayOrder
  );

  const status =
    body.status === "inactive"
      ? "inactive"
      : "active";

  if (
    !name ||
    !designation ||
    !email ||
    !/^\S+@\S+\.\S+$/.test(email) ||
    !phone ||
    !Number.isInteger(displayOrder) ||
    displayOrder < 0
  ) {
    return null;
  }

  return {
    name,
    designation,
    email,
    phone,
    organization,
    state,
    displayOrder,
    status: status as MemberStatus,
  };
};

const uploadPhoto = async (
  file?: Express.Multer.File
) => {
  if (!file) {
    return undefined;
  }

  const result =
    await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString(
        "base64"
      )}`,
      {
        folder: "members",
      }
    );

  return result.secure_url;
};

/*
|--------------------------------------------------------------------------
| ADMIN - GET MEMBERS
|--------------------------------------------------------------------------
*/

export const getMembers = async (
  req: Request,
  res: Response
) => {
  try {
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number(req.query.limit) || 10,
        1
      ),
      100
    );

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const designation =
      typeof req.query.designation === "string"
        ? req.query.designation.trim()
        : "";

    const organization =
      typeof req.query.organization === "string"
        ? req.query.organization.trim()
        : "";

    const state =
      typeof req.query.state === "string"
        ? req.query.state.trim()
        : "";

    const status =
      typeof req.query.status === "string"
        ? req.query.status
        : "";

    const filter: Record<
      string,
      unknown
    > = {};

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          fullName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          designation: {
            $regex: search,
            $options: "i",
          },
        },
        {
          organization: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (designation) {
      filter.designation = {
        $regex: designation,
        $options: "i",
      };
    }

    if (organization) {
      filter.organization = {
        $regex: organization,
        $options: "i",
      };
    }

    if (state) {
      filter.state = {
        $regex: state,
        $options: "i",
      };
    }

    if (
      status &&
      statuses.includes(
        status as MemberStatus
      )
    ) {
      filter.status = status;
    }

    const [
      documents,
      total,
    ] = await Promise.all([
      Member.find(filter)
        .sort({
          displayOrder: 1,
          createdAt: -1,
        })
        .skip(
          (page - 1) * limit
        )
        .limit(limit)
        .lean(),

      Member.countDocuments(filter),
    ]);

    const data = documents.map(
      (member: any) => ({
        ...member,

        name:
          member.name ||
          member.fullName ||
          "GNPC Member",

        designation:
          member.designation ||
          "GNPC Member",

        email:
          member.email || "",

        phone:
          member.phone || "",

        organization:
          member.organization || "",

        state:
          member.state || "",

        photo:
          member.photo ||
          DEFAULT_MEMBER_PHOTO,

        displayOrder:
          Number(
            member.displayOrder
          ) || 0,

        status:
          member.status ||
          "active",
      })
    );

    return res.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(
          Math.ceil(
            total / limit
          ),
          1
        ),
      },
    });
  } catch (error) {
    console.error(
      "Get Members Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch members.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| PUBLIC - GET MEMBERS
|--------------------------------------------------------------------------
|
| IMPORTANT:
| This endpoint must NOT require authentication.
|
| It also supports old member documents that used:
|
|   fullName
|
| instead of:
|
|   name
|
| and old records where status was not present.
|--------------------------------------------------------------------------
*/

export const getPublicMembers = async (
  req: Request,
  res: Response
) => {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const designation =
      typeof req.query.designation === "string"
        ? req.query.designation.trim()
        : "";

    const organization =
      typeof req.query.organization === "string"
        ? req.query.organization.trim()
        : "";

    const state =
      typeof req.query.state === "string"
        ? req.query.state.trim()
        : "";

    const requestedLimit =
      Number(req.query.limit);

    const limit =
      Number.isInteger(
        requestedLimit
      ) &&
      requestedLimit > 0
        ? Math.min(
            requestedLimit,
            100
          )
        : 100;

    /*
     * Existing records may not have status.
     *
     * Therefore:
     *
     * status = active
     *
     * OR
     *
     * status does not exist
     */
    const filter: Record<
      string,
      unknown
    > = {
      $or: [
        {
          status: "active",
        },
        {
          status: {
            $exists: false,
          },
        },
        {
          status: null,
        },
      ],
    };

    /*
     * SEARCH
     */
    if (search) {
      filter.$and = [
        {
          $or: [
            {
              name: {
                $regex: search,
                $options: "i",
              },
            },
            {
              fullName: {
                $regex: search,
                $options: "i",
              },
            },
            {
              designation: {
                $regex: search,
                $options: "i",
              },
            },
            {
              organization: {
                $regex: search,
                $options: "i",
              },
            },
            {
              email: {
                $regex: search,
                $options: "i",
              },
            },
          ],
        },
      ];
    }

    if (designation) {
      filter.$and = [
        ...(Array.isArray(
          filter.$and
        )
          ? filter.$and
          : []),

        {
          designation: {
            $regex: designation,
            $options: "i",
          },
        },
      ];
    }

    if (organization) {
      filter.$and = [
        ...(Array.isArray(
          filter.$and
        )
          ? filter.$and
          : []),

        {
          organization: {
            $regex: organization,
            $options: "i",
          },
        },
      ];
    }

    if (state) {
      filter.$and = [
        ...(Array.isArray(
          filter.$and
        )
          ? filter.$and
          : []),

        {
          state: {
            $regex: state,
            $options: "i",
          },
        },
      ];
    }

    /*
     * IMPORTANT:
     *
     * Do not use Member.find().select(...)
     * here because old migrated documents may
     * contain fields not defined in the current
     * Mongoose schema.
     *
     * Access the documents using lean().
     */
    const documents =
      await Member.find(filter)
        .sort({
          displayOrder: 1,
          createdAt: 1,
        })
        .limit(limit)
        .lean();

    const data =
      documents.map(
        (member: any) => ({
          _id:
            String(
              member._id
            ),

          name:
            member.name ||
            member.fullName ||
            "GNPC Member",

          designation:
            member.designation ||
            "GNPC Member",

          email:
            member.email ||
            "",

          phone:
            member.phone ||
            "",

          organization:
            member.organization ||
            "",

          state:
            member.state ||
            "",

          photo:
            member.photo ||
            member.photoUrl ||
            DEFAULT_MEMBER_PHOTO,

          displayOrder:
            Number(
              member.displayOrder
            ) || 0,

          status:
            member.status ===
            "inactive"
              ? "inactive"
              : "active",

          createdAt:
            member.createdAt
              ? new Date(
                  member.createdAt
                ).toISOString()
              : new Date().toISOString(),

          updatedAt:
            member.updatedAt
              ? new Date(
                  member.updatedAt
                ).toISOString()
              : new Date().toISOString(),
        })
      );

    console.log(
      `[PUBLIC MEMBERS] ${data.length} member(s) returned`
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "Get Public Members Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch members.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| MEMBER STATS
|--------------------------------------------------------------------------
*/

export const getMembersStats = async (
  _req: Request,
  res: Response
) => {
  try {
    const [
      total,
      active,
      inactive,
    ] = await Promise.all([
      Member.countDocuments(),

      Member.countDocuments({
        $or: [
          {
            status: "active",
          },
          {
            status: {
              $exists: false,
            },
          },
        ],
      }),

      Member.countDocuments({
        status: "inactive",
      }),
    ]);

    return res.json({
      success: true,
      data: {
        total,
        active,
        inactive,
      },
    });
  } catch (error) {
    console.error(
      "Get Members Stats Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch member statistics.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET SINGLE MEMBER
|--------------------------------------------------------------------------
*/

export const getMember = async (
  req: Request,
  res: Response
) => {
  try {
    const data =
      await Member.findById(
        req.params.id
      ).lean();

    if (!data) {
      return res.status(404).json({
        success: false,
        message:
          "Member not found.",
      });
    }

    return res.json({
      success: true,
      data: {
        ...data,

        name:
          (data as any).name ||
          (data as any).fullName ||
          "GNPC Member",

        photo:
          (data as any).photo ||
          DEFAULT_MEMBER_PHOTO,

        status:
          (data as any).status ||
          "active",
      },
    });
  } catch {
    return res.status(400).json({
      success: false,
      message:
        "Invalid member id.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| CREATE MEMBER
|--------------------------------------------------------------------------
*/

export const createMember = async (
  req: Request,
  res: Response
) => {
  try {
    const member =
      normalizeMember(
        req.body
      );

    if (!member) {
      return res.status(400).json({
        success: false,
        message:
          "Name, designation, valid email, phone, and non-negative display order are required.",
      });
    }

    const existing =
      await Member.exists({
        email: member.email,
      });

    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          "A member with this email already exists.",
      });
    }

    const photo =
      await uploadPhoto(
        req.file
      );

    const data =
      await Member.create({
        ...member,
        photo:
          photo ||
          DEFAULT_MEMBER_PHOTO,
      });

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "Create GNPC Member Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create GNPC Member.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE MEMBER
|--------------------------------------------------------------------------
*/

export const updateMember = async (
  req: Request,
  res: Response
) => {
  try {
    const member =
      normalizeMember(
        req.body
      );

    if (!member) {
      return res.status(400).json({
        success: false,
        message:
          "Name, designation, valid email, phone, and non-negative display order are required.",
      });
    }

    const existing =
      await Member.findById(
        req.params.id
      );

    if (!existing) {
      return res.status(404).json({
        success: false,
        message:
          "Member not found.",
      });
    }

    const duplicate =
      await Member.exists({
        email: member.email,
        _id: {
          $ne: existing._id,
        },
      });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message:
          "A member with this email already exists.",
      });
    }

    const photo =
      await uploadPhoto(
        req.file
      );

    const data =
      await Member.findByIdAndUpdate(
        req.params.id,
        {
          ...member,
          ...(photo
            ? { photo }
            : {}),
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (
      photo &&
      existing.photo &&
      existing.photo !== photo
    ) {
      await deleteCloudinaryAssets([
        existing.photo,
      ]);
    }

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "Update GNPC Member Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update GNPC Member.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| DELETE MEMBER
|--------------------------------------------------------------------------
*/

export const deleteMember = async (
  req: Request,
  res: Response
) => {
  try {
    const data =
      await Member.findByIdAndDelete(
        req.params.id
      );

    if (!data) {
      return res.status(404).json({
        success: false,
        message:
          "Member not found.",
      });
    }

    if (data.photo) {
      await deleteCloudinaryAssets([
        data.photo,
      ]);
    }

    return res.json({
      success: true,
      message:
        "Member deleted successfully.",
    });
  } catch {
    return res.status(400).json({
      success: false,
      message:
        "Invalid member id.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| IMPORT / EXPORT
|--------------------------------------------------------------------------
|
| Keep your existing importMembers() and
| exportMembers() functions below this point.
|--------------------------------------------------------------------------
*/

export const importMembers = async (
  req: Request,
  res: Response
) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message:
        "An .xlsx or .xls file is required.",
    });
  }

  try {
    const workbook =
      XLSX.read(
        req.file.buffer,
        {
          type: "buffer",
        }
      );

    const sheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

    const rows =
      XLSX.utils.sheet_to_json<
        unknown[]
      >(sheet, {
        header: 1,
        defval: "",
        blankrows: true,
        raw: false,
      });

    if (
      !rows.length ||
      !Array.isArray(rows[0])
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Excel file is empty or invalid.",
      });
    }

    const headers =
      rows[0].map(
        (value: unknown) =>
          String(
            value ?? ""
          )
            .trim()
            .toLowerCase()
      );

    const columns =
      new Set(headers);

    const requiredColumns = [
      "name",
      "designation",
      "email",
      "phone",
      "display order",
    ];

    if (
      !requiredColumns.every(
        (column) =>
          columns.has(column)
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Required columns: Name, Designation, Email, Phone, Display Order.",
      });
    }

    const failedRows: Array<{
      row: number;
      reason: string;
    }> = [];

    const validRows: Array<
      Record<string, unknown>
    > = [];

    rows
      .slice(1)
      .forEach(
        (
          row,
          index
        ) => {
          if (
            !Array.isArray(
              row
            )
          ) {
            return;
          }

          const value =
            (
              column: string
            ) => {
              const position =
                headers.indexOf(
                  column
                );

              return position >=
                0
                ? String(
                    row[
                      position
                    ] ??
                      ""
                  ).trim()
                : "";
            };

          const name =
            value("name");

          const designation =
            value(
              "designation"
            );

          const email =
            value("email").toLowerCase();

          const phone =
            value("phone");

          const organization =
            value(
              "organization"
            );

          const state =
            value("state");

          const displayOrder =
            Number(
              value(
                "display order"
              ) || 0
            );

          const status =
            value(
              "status"
            ) ===
            "inactive"
              ? "inactive"
              : "active";

          if (
            !name ||
            !designation ||
            !email ||
            !/^\S+@\S+\.\S+$/.test(
              email
            ) ||
            !phone ||
            !Number.isInteger(
              displayOrder
            ) ||
            displayOrder < 0
          ) {
            failedRows.push({
              row:
                index + 2,
              reason:
                "Name, designation, valid email, phone, and non-negative display order are required.",
            });

            return;
          }

          validRows.push({
            name,
            designation,
            email,
            phone,
            organization,
            state,
            displayOrder,
            status,
            photo:
              DEFAULT_MEMBER_PHOTO,
          });
        }
      );

    if (validRows.length) {
      await Member.insertMany(
        validRows,
        {
          ordered: false,
        }
      );
    }

    return res.json({
      success: true,
      data: {
        totalRows:
          rows.length - 1,
        imported:
          validRows.length,
        failed:
          failedRows.length,
        failedRows,
      },
    });
  } catch (error) {
    console.error(
      "Import Members Error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        "Unable to read the import file.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| EXPORT MEMBERS
|--------------------------------------------------------------------------
*/

export const exportMembers = async (
  req: Request,
  res: Response
) => {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const filter: Record<
      string,
      unknown
    > = {};

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          fullName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          designation: {
            $regex: search,
            $options: "i",
          },
        },
        {
          organization: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const members =
      await Member.find(
        filter
      )
        .sort({
          displayOrder: 1,
          createdAt: 1,
        })
        .lean();

    const rows =
      members.map(
        (member: any) => ({
          Name:
            member.name ||
            member.fullName ||
            "",

          Designation:
            member.designation ||
            "",

          Email:
            member.email || "",

          Phone:
            member.phone || "",

          Organization:
            member.organization ||
            "",

          State:
            member.state || "",

          "Display Order":
            member.displayOrder ||
            0,

          Status:
            member.status ||
            "active",

          "Photo URL":
            member.photo ||
            DEFAULT_MEMBER_PHOTO,
        })
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(
        rows
      ),
      "Members"
    );

    const content =
      XLSX.write(
        workbook,
        {
          type: "buffer",
          bookType: "xlsx",
        }
      );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="members.xlsx"'
    );

    return res.send(
      content
    );
  } catch (error) {
    console.error(
      "Export Members Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to export members.",
    });
  }
};
