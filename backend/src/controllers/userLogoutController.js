const userLogoutController = {}

userLogoutController.logout = async (req, res) => {
    try {
        res.clearCookie("authCookie")
        return res.status(200).json({message: "Session closed"})
    } catch (error) {
        console.log("Logout error" + error)
        return res.status(500).json({message: "Internal server error"})
    }
}

export default userLogoutController