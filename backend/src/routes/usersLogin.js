import express from "express"

import userLoginController from "../controllers/userLoginController.js"

const router = express.Router()

router.route("/").post(userLoginController.login)

export default router