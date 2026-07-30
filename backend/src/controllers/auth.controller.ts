import {Request,Response} from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import generateToken from "../utils/generateToken";
import {
  createOtp,
  createResetToken,
  getOtpExpiry,
  getResetTokenExpiry,
  hashResetValue,
  isEmail,
  normalizePhone,
  sendResetOtpEmail,
  sendResetOtpSms,
} from "../utils/passwordReset";

const passwordIsValid = (password: unknown): password is string =>
  typeof password === "string" &&
  password.length >= 8 &&
  /[a-z]/.test(password) &&
  /[A-Z]/.test(password) &&
  /\d/.test(password);

const getResetUser = async (identifier: unknown) => {
  if (typeof identifier !== "string") {
    return null;
  }

  const value = identifier.trim();
  const query = isEmail(value)
    ? { email: value.toLowerCase() }
    : { phone: normalizePhone(value) || "" };

  return User.findOne(query).select(
    "+resetOtpHash +resetOtpExpiresAt +resetOtpAttempts +resetTokenHash +resetTokenExpiresAt"
  );
};



export const login = async(
req:Request,
res:Response
)=>{


try{


const { email, password } = req.body;
if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
return res.status(400).json({ success: false, message: "Email and password are required." });
}



const user = await User.findOne({ email: email.trim().toLowerCase() });



if(!user){

return res.status(401).json({ success: false, message:"Invalid email or password" });

}

if (user.status === "INACTIVE") {

return res.status(403).json({

success: false,
message:"This account is inactive. Please contact an administrator."

});

}



const match = await bcrypt.compare(

password,

user.password

);



if(!match){

return res.status(401).json({

success: false,
message:"Invalid email or password"

});

}
user.lastLogin = new Date();
await user.save();
const token = generateToken(
user._id.toString(),
user.role
);



res.cookie(
"token",
token,
{

httpOnly:true,

secure: process.env.NODE_ENV === "production",

sameSite:"lax",

maxAge:
7*24*60*60*1000

}
);



return res.json({

success: true,
message:"Login Successful",

token: token,

user:{
id:user._id,
name:user.name,
email:user.email,
role:user.role
}

});



}

catch(error:any){

console.error("Login error:", error);
return res.status(500).json({ success: false, message: "Unable to sign in. Please try again." });

}


};





export const me = async(
req:any,
res:Response
)=>{


try {
if (!req.user?.id) {
return res.status(401).json({ success: false, message: "Unauthorized" });
}

if (process.env.NODE_ENV !== "production") {
console.debug("[auth] /me user lookup started", { userId: req.user.id });
}

const user = await User.findById(req.user.id).select("-password").maxTimeMS(5000);
if (!user || user.status !== "ACTIVE") {
return res.status(401).json({ success: false, message: "Unauthorized" });
}

if (process.env.NODE_ENV !== "production") {
console.debug("[auth] /me user lookup completed", { userId: user.id });
}

return res.json({ success: true, data: user });
} catch (error) {
console.error("[auth] /me failed:", error);
return res.status(500).json({ success: false, message: "Unable to verify authentication. Please try again." });
}


};





export const logout = async(
req:Request,
res:Response
)=>{


res.clearCookie("token");


return res.json({

message:"Logout Successful"

});


};

export const requestPasswordReset = async (req: Request, res: Response) => {
  const { identifier } = req.body;
  const user = await getResetUser(identifier);

  // Always return this response for unknown accounts to prevent account enumeration.
  const acceptedResponse = {
    success: true,
    message: "If the account exists, a reset code has been sent.",
  };

  if (!user || user.status !== "ACTIVE") {
    return res.json(acceptedResponse);
  }

  const otp = createOtp();
  user.resetOtpHash = hashResetValue(otp);
  user.resetOtpExpiresAt = getOtpExpiry();
  user.resetOtpAttempts = 0;
  user.resetTokenHash = undefined;
  user.resetTokenExpiresAt = undefined;
  await user.save();

  try {
    if (isEmail(identifier.trim())) {
      await sendResetOtpEmail(user.email, otp);
    } else if (user.phone) {
      await sendResetOtpSms(user.phone, otp);
    }
  } catch (error) {
    user.resetOtpHash = undefined;
    user.resetOtpExpiresAt = undefined;
    user.resetOtpAttempts = 0;
    await user.save();
    console.error("Password reset delivery failed:", error);
    return res.status(503).json({
      success: false,
      message: "Unable to send a reset code. Please try again later.",
    });
  }

  return res.json(acceptedResponse);
};

export const verifyPasswordResetOtp = async (req: Request, res: Response) => {
  const { identifier, otp } = req.body;
  const user = await getResetUser(identifier);

  if (
    !user ||
    typeof otp !== "string" ||
    !/^\d{6}$/.test(otp) ||
    !user.resetOtpHash ||
    !user.resetOtpExpiresAt ||
    user.resetOtpExpiresAt.getTime() < Date.now() ||
    (user.resetOtpAttempts || 0) >= 5
  ) {
    return res.status(400).json({ success: false, message: "Invalid or expired reset code." });
  }

  if (hashResetValue(otp) !== user.resetOtpHash) {
    user.resetOtpAttempts = (user.resetOtpAttempts || 0) + 1;
    await user.save();
    return res.status(400).json({ success: false, message: "Invalid or expired reset code." });
  }

  const resetToken = createResetToken();
  user.resetOtpHash = undefined;
  user.resetOtpExpiresAt = undefined;
  user.resetOtpAttempts = 0;
  user.resetTokenHash = hashResetValue(resetToken);
  user.resetTokenExpiresAt = getResetTokenExpiry();
  await user.save();

  return res.json({ success: true, resetToken });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { identifier, resetToken, password } = req.body;
  const user = await getResetUser(identifier);

  if (
    !user ||
    typeof resetToken !== "string" ||
    !user.resetTokenHash ||
    !user.resetTokenExpiresAt ||
    user.resetTokenExpiresAt.getTime() < Date.now() ||
    hashResetValue(resetToken) !== user.resetTokenHash
  ) {
    return res.status(400).json({ success: false, message: "Password reset session has expired." });
  }

  if (!passwordIsValid(password)) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters and include uppercase, lowercase, and a number.",
    });
  }

  user.password = await bcrypt.hash(password, 12);
  user.resetTokenHash = undefined;
  user.resetTokenExpiresAt = undefined;
  await user.save();

  return res.json({ success: true, message: "Password reset successfully. Please sign in." });
};
