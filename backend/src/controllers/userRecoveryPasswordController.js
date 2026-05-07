import jsonwebtoken from "jsonwebtoken"
import nodemiler from "nodemailer"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import {config} from "../../config.js"
import { HTMLRecoveryEmail} from "../utils/sendEmailRecovery.js"
import userModel from "../models/users.js"

const recoveryController = {}

recoveryController.requestCode = async (req, res) => {
    try {
        const {email} = req.body

        const userFound = await userModel.findOne({email})

        if(!userFound){
            return res.status(404).json({message: "Email not found"})
        }

        const code = crypto.randomBytes(3).toString("hex")

        const token = jsonwebtoken.sign(
            {email, code, userType: "user", verified: false},
            config.JWT.secret,
            {expiresIn: "15m"}
        )

        res.cookie("recoveryCookie", token, {maxAge: 15*60*60*1000})

        const transporter = nodemiler.createTransport(
            {
                service: "email",
                auth: {
                    user: config.email.user_email,
                    pass: config.email.user_password
                }
            }
        )

        const mailOptions = {
            from: config.email.user_email,
            to: email,
            subject: "Correo de recuperación",
            body: "Usa este código pare recuperar tu cuenta",
            html: HTMLRecoveryEmail(code)
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error", error)
                return res.status(500).json({message: "Error al enviar correo"})
            }
            return res.status(200).json({message: "Correo enviado", success: true})
        })
    } catch (error) {
        console.log("Request code error" + error)
        return res.status(500).json({message: "Internal server error"})
    }
}

recoveryController.verifyCode = async (req, res) => {
    try {
        const { codeRequest} = req.body
        const token = req.cookies.recoveryCode
        const decoded = jsonwebtoken.verify(token, config.JWT.secret)

        if (decoded.code !== codeRequest) {
            return res.status(400).json({message: "Invalid code"})
        }

        const newToken = jsonwebtoken.sign(
            {email: decoded.email, userType: "user", verified: true},
            config.JWT.secret,
            {expiresIn: "15m"}
        )

        res.cookie("recoveryCookie", newToken, {maxAge: 15*60*60*1000})

        return res.status(200).json({message: "Code verified succefuly"})
    } catch (error) {
        console.log("Verify code error" + error)
        return res.status(500).json({message: "Internal server error"})
    }
}

export default recoveryController