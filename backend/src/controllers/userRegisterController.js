import nodemailer from "nodemailer"
import crypto from "crypto"
import jsonwebtoken from "jsonwebtoken"
import bcrypt from "bcryptjs"
import {config} from "../../config.js"
import userModel from "../models/users.js"
import { error, info } from "console"

const userRegiterController = {}

userRegiterController.register = async (req, res) => {
    const {name, lastName, email, password, phone, address} = req.body

        try {
            const existUser = await userModel.findOne({email})

            if (existUser) {
                return res.status(400).json({message: "User already exist"})
            }

            const passwordHash = await bcrypt.hash(password, 10)

            const newUser = await userModel(
                {
                    name,
                    lastName,
                    email,
                    password: passwordHash,
                    phone,
                    address,
                    isVerified: false
                }
            )

            await newUser.save()

            const verificationCode = crypto.randomBytes(3).toString("hex")

            const tokenCode = jsonwebtoken.sign(
                {email, verificationCode},
                config.JWT.secret,
                {expiresIn: "15m"}
            )

            res.cookie("verificationToken", tokenCode, {maxAge: 15*60*60*1000})

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: config.email.user_email,
                    pass: config.email.user_password
                }
            })

            const mailOptions = {
                from: config.email.user_email,
                to: email,
                subject: "Verificacion de cuenta",
                text: 
                    "Para verificar tu cuenta, utiliza este código: " + verificationCode + " expira en 15 minutos"
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if(error) {
                    console.log("Send email error" + error)
                    return res.status(500).json({message: "Error al enviar el código de verificación"})
                }
                res.status(200).json({message: "Usuario registrado, verifica tu correo electrónico"})
            })
            
    } catch (error) {
        console.log("Login error" + error)
        return res.status(500).json({message: "Internal server error"})
    }
}

userRegiterController.verifyCode = async (req, res) => {
    try {
        const {verificationCodeRequest} = req.body

        const token = req.cookie.verificationToken

        const decoded = jsonwebtoken.verify(token, config.JWT.secret)

        const {email, verificationCode: storedCode} = decoded

        if (verificationCodeRequest !== storedCode) {
            return res.status(400).json({message: "Invalid code"})
        }

        const user = await userModel.findOne({email})
        user.isVerified = true
        await user.save()

        res.clearCookie("verificationToken")

        res.json({message: "Email verified succesfuly"})
    } catch (error) {
        console.log("Verification code error" + error)
        return res.status(500).json({message: "Internal server error"})
    }
}

export default userRegiterController