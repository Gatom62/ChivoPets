import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

// Importaciones
import userLoginRoutes from "./src/routes/usersLogin.js"
import userRegisterRoutes from "./src/routes/usersRegister.js"
import userLogoutRoutes from "./src/routes/userLogout.js"

const app = express()

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}))

app.use(cookieParser())

app.use(express.json())

// Rutas
app.use("/api/login", userLoginRoutes)
app.use("/api/userRegister", userRegisterRoutes)
app.use("/api/logout", userLogoutRoutes)

export default app