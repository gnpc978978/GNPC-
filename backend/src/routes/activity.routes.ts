import express from "express";

import {
getActivities
}
from "../controllers/activity.controller";


import authMiddleware from "../middleware/auth.middleware";


const router = express.Router();



router.get(
"/",
authMiddleware,
getActivities
);



export default router;