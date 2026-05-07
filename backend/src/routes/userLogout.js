import express from "express"

import userLogoutController from "../controllers/userLogoutController.js"

const router = express.Router()

router.route("/").post(userLogoutController.logout)

export default router