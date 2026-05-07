import express from "express"
import userRecoveryPasswordController from "../controllers/userRecoveryPasswordController.js"

const router = express.Router()

router.route("/requestCode").post(userRecoveryPasswordController.requestCode)
router.route("/verifyCode").post(userRecoveryPasswordController.verifyCode)
router.route("/newPassword").post(userRecoveryPasswordController.newPassword)

export default router