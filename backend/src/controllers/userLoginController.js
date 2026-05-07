import bcrypt from "bcryptjs"
import jsonwebtoken from "jsonwebtoken"
import {config} from "../../config.js"
import userModel from "../models/users.js"

const loginUserController = {}

loginUserController.login = async (req, res) => {
    try {
        const {email, password} = req.body

        const userFound = await userModel.findOne({email})

         if (!userFound) {
            return res.status(404).json({message: "Email not found"})
         }

         const isMacth = await bcrypt.compare(password, userFound.password)

         await userFound.save()

         const token = jsonwebtoken.sign(
            {
                id: userFound._id,
                userType: "user",
            },
            config.JWT.secret,
            {expiresIn: "30d"}
         )

         res.cookie("authCookie", token)

         return res.status(200).json({message: "Succesfuly login"})

    } catch (error) {
        console.log("Login error" + error)
        return res.status(500),json({message: "Internal server error"})
    }
}

export default loginUserController