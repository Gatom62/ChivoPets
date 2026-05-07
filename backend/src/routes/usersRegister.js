import express from "express"

import usersRegisterController from "../controllers/userRegisterController.js"

const router = express.Router()

router.route("/").post(usersRegisterController.register)
router.route("/verifyCodeEmail").post(usersRegisterController.verifyCode)

export default router