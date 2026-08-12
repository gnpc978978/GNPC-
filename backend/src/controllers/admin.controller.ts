import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import User from "../models/User";
import { createActivity } from "../services/activity.service";

const normalizeEmail = (value: unknown) =>
  typeof value === "string"
    ? value.trim().toLowerCase()
    : "";

const normalizeUsername = (value: unknown) =>
  typeof value === "string"
    ? value.trim().toLowerCase()
    : "";

const validRoles = ["ADMIN", "SUPER_ADMIN"] as const;
const validStatuses = ["ACTIVE", "INACTIVE"] as const;

const isValidRole = (
  value: unknown
): value is (typeof validRoles)[number] =>
  typeof value === "string" &&
  validRoles.includes(
    value as (typeof validRoles)[number]
  );

const isValidStatus = (
  value: unknown
): value is (typeof validStatuses)[number] =>
  typeof value === "string" &&
  validStatuses.includes(
    value as (typeof validStatuses)[number]
  );

const isStrongPassword = (
  value: unknown
): value is string =>
  typeof value === "string" &&
  value.length >= 8 &&
  /[a-z]/.test(value) &&
  /[A-Z]/.test(value) &&
  /\d/.test(value);

const getSuperAdminCount = async () =>
  User.countDocuments({
    role: "SUPER_ADMIN",
    status: "ACTIVE",
  });


// ======================================================
// GET ALL ADMINS
// ======================================================

export const getAdmins = async (
  req: Request,
  res: Response
) => {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const role =
      typeof req.query.role === "string"
        ? req.query.role
        : "";

    const status =
      typeof req.query.status === "string"
        ? req.query.status
        : "";

    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number(req.query.limit) || 20,
        1
      ),
      100
    );

    const filter: any = {
      role: {
        $in: [
          "ADMIN",
          "SUPER_ADMIN",
        ],
      },
    };

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          username: {
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
      ];
    }

    if (isValidRole(role)) {
      filter.role = role;
    }

    if (isValidStatus(status)) {
      filter.status = status;
    }

    const [
      admins,
      total,
    ] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({
          createdAt: -1,
        })
        .skip((page - 1) * limit)
        .limit(limit),

      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: admins,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(
          Math.ceil(total / limit),
          1
        ),
      },
    });
  } catch (error) {
    console.error(
      "getAdmins error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admins",
    });
  }
};


// ======================================================
// GET ADMIN BY ID
// ======================================================

export const getAdminById = async (
  req: Request,
  res: Response
) => {
  try {
    const admin =
      await User.findById(
        req.params.id
      ).select("-password");

    if (
      !admin ||
      !validRoles.includes(
        admin.role
      )
    ) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid admin id",
    });
  }
};


// ======================================================
// CREATE ADMIN
// ======================================================

export const createAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      username,
      email,
      password,
      role,
      status,
    } = req.body;

    const cleanName =
      typeof name === "string"
        ? name.trim()
        : "";

    const cleanEmail =
      normalizeEmail(email);

    const cleanUsername =
      normalizeUsername(username);

    const cleanRole =
      isValidRole(role)
        ? role
        : "ADMIN";

    const cleanStatus =
      isValidStatus(status)
        ? status
        : "ACTIVE";

    if (!cleanName) {
      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }

    if (!cleanEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters and include uppercase, lowercase and a number.",
      });
    }

    // Check email first.
    const emailExists =
      await User.findOne({
        email: cleanEmail,
      });

    if (emailExists) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    // Check username separately.
    if (cleanUsername) {
      const usernameExists =
        await User.findOne({
          username: cleanUsername,
        });

      if (usernameExists) {
        return res.status(409).json({
          success: false,
          message:
            "This username is already in use.",
        });
      }
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );

    const admin =
      await User.create({
        name: cleanName,
        username:
          cleanUsername || undefined,
        email: cleanEmail,
        password: hashedPassword,
        role: cleanRole,
        status: cleanStatus,
      });

    await createActivity({
      user: req.user.id,
      action: "CREATE",
      module: "ADMIN",
      description:
        `Created ${cleanRole} ${admin.name}`,
    });

    const safeAdmin =
      await User.findById(
        admin._id
      ).select("-password");

    return res.status(201).json({
      success: true,
      message:
        "Admin created successfully.",
      data: safeAdmin,
    });
  } catch (error: any) {
    console.error(
      "createAdmin error:",
      error
    );

    // Handle MongoDB duplicate-key race safely.
    if (error?.code === 11000) {
      const duplicateField =
        Object.keys(
          error.keyPattern || {}
        )[0];

      return res.status(409).json({
        success: false,
        message:
          duplicateField === "username"
            ? "This username is already in use."
            : "An account with this email already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to create admin.",
    });
  }
};


// ======================================================
// UPDATE ADMIN
// ======================================================

export const updateAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const targetId =
      req.params.id;

    const currentUserId =
      req.user.id;

    const {
      name,
      username,
      email,
      role,
      status,
    } = req.body;

    const target =
      await User.findById(
        targetId
      );

    if (
      !target ||
      !validRoles.includes(
        target.role
      )
    ) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    const cleanName =
      typeof name === "string"
        ? name.trim()
        : undefined;

    const cleanEmail =
      typeof email === "string"
        ? normalizeEmail(email)
        : undefined;

    const cleanUsername =
      typeof username === "string"
        ? normalizeUsername(username)
        : undefined;

    // ---------------------------------------------
    // NEVER allow a Super Admin to demote itself.
    // ---------------------------------------------

    if (
      targetId === currentUserId &&
      role === "ADMIN"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot change your own role from SUPER_ADMIN to ADMIN.",
      });
    }

    // ---------------------------------------------
    // NEVER allow a Super Admin to deactivate itself.
    // ---------------------------------------------

    if (
      targetId === currentUserId &&
      status === "INACTIVE"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot deactivate your own account.",
      });
    }

    // ---------------------------------------------
    // Never remove the last active Super Admin.
    // ---------------------------------------------

    if (
      target.role === "SUPER_ADMIN" &&
      (role === "ADMIN" ||
        status === "INACTIVE")
    ) {
      const count =
        await getSuperAdminCount();

      if (count <= 1) {
        return res.status(400).json({
          success: false,
          message:
            "The last active Super Admin cannot be removed or deactivated.",
        });
      }
    }

    const updates: Record<
      string,
      string
    > = {};

    if (cleanName) {
      updates.name =
        cleanName;
    }

    if (cleanEmail) {
      const emailOwner =
        await User.findOne({
          email: cleanEmail,
          _id: {
            $ne: targetId,
          },
        });

      if (emailOwner) {
        return res.status(409).json({
          success: false,
          message:
            "This email is already in use.",
        });
      }

      updates.email =
        cleanEmail;
    }

    if (
      cleanUsername !== undefined
    ) {
      if (cleanUsername) {
        const usernameOwner =
          await User.findOne({
            username: cleanUsername,
            _id: {
              $ne: targetId,
            },
          });

        if (usernameOwner) {
          return res.status(409).json({
            success: false,
            message:
              "This username is already in use.",
          });
        }

        updates.username =
          cleanUsername;
      }
    }

    if (isValidRole(role)) {
      updates.role = role;
    }

    if (isValidStatus(status)) {
      updates.status = status;
    }

    if (
      Object.keys(updates).length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No valid admin fields supplied.",
      });
    }

    const updatedAdmin =
      await User.findByIdAndUpdate(
        targetId,
        updates,
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

    if (!updatedAdmin) {
      return res.status(404).json({
        success: false,
        message:
          "Admin not found.",
      });
    }

    await createActivity({
      user: req.user.id,
      action: "UPDATE",
      module: "ADMIN",
      description:
        `Updated admin ${updatedAdmin.name}`,
    });

    return res.json({
      success: true,
      message:
        "Admin updated successfully.",
      data: updatedAdmin,
    });
  } catch (error: any) {
    console.error(
      "updateAdmin error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update admin.",
    });
  }
};


// ======================================================
// DELETE ADMIN
// ======================================================

export const deleteAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const targetId =
      req.params.id;

    if (
      req.user.id === targetId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot delete your own account.",
      });
    }

    const admin =
      await User.findById(
        targetId
      );

    if (
      !admin ||
      !validRoles.includes(
        admin.role
      )
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Admin not found.",
      });
    }

    if (
      admin.role === "SUPER_ADMIN"
    ) {
      const count =
        await getSuperAdminCount();

      if (count <= 1) {
        return res.status(400).json({
          success: false,
          message:
            "The last active Super Admin cannot be deleted.",
        });
      }
    }

    await User.findByIdAndDelete(
      targetId
    );

    await createActivity({
      user: req.user.id,
      action: "DELETE",
      module: "ADMIN",
      description:
        `Deleted admin ${admin.name}`,
    });

    return res.json({
      success: true,
      message:
        "Admin deleted successfully.",
    });
  } catch (error) {
    console.error(
      "deleteAdmin error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete admin.",
    });
  }
};


// ======================================================
// CHANGE STATUS
// ======================================================

export const changeStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const targetId =
      req.params.id;

    const newStatus =
      req.body.status;

    if (
      !isValidStatus(newStatus)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid admin status.",
      });
    }

    if (
      req.user.id === targetId &&
      newStatus === "INACTIVE"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot deactivate your own account.",
      });
    }

    const target =
      await User.findById(
        targetId
      );

    if (
      !target ||
      !validRoles.includes(
        target.role
      )
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Admin not found.",
      });
    }

    if (
      target.role === "SUPER_ADMIN" &&
      newStatus === "INACTIVE"
    ) {
      const count =
        await getSuperAdminCount();

      if (count <= 1) {
        return res.status(400).json({
          success: false,
          message:
            "The last active Super Admin cannot be deactivated.",
        });
      }
    }

    const updatedAdmin =
      await User.findByIdAndUpdate(
        targetId,
        {
          status: newStatus,
        },
        {
          new: true,
        }
      ).select("-password");

    return res.json({
      success: true,
      message:
        "Admin status updated successfully.",
      data: updatedAdmin,
    });
  } catch (error) {
    console.error(
      "changeStatus error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update admin status.",
    });
  }
};


// ======================================================
// RESET ADMIN PASSWORD
// ======================================================

export const resetAdminPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const targetId =
      req.params.id;

    if (
      req.user.id === targetId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Use your account settings to change your own password.",
      });
    }

    const password =
      req.body.password;

    if (
      !isStrongPassword(password)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters and include uppercase, lowercase and a number.",
      });
    }

    const admin =
      await User.findById(
        targetId
      );

    if (
      !admin ||
      !validRoles.includes(
        admin.role
      )
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Admin not found.",
      });
    }

    admin.password =
      await bcrypt.hash(
        password,
        12
      );

    // Invalidate any password-reset session.
    admin.resetOtpHash =
      undefined;

    admin.resetOtpExpiresAt =
      undefined;

    admin.resetOtpAttempts =
      0;

    admin.resetTokenHash =
      undefined;

    admin.resetTokenExpiresAt =
      undefined;

    await admin.save();

    await createActivity({
      user: req.user.id,
      action: "UPDATE",
      module: "ADMIN",
      description:
        `Reset password for ${admin.name}`,
    });

    return res.json({
      success: true,
      message:
        "Password reset successfully.",
    });
  } catch (error) {
    console.error(
      "resetAdminPassword error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to reset password.",
    });
  }
};
