export const HTMLRecoveryEmail = (code) => {
    const year = new Date().getFullYear()

    return `
    <div style="font-family: sans-serif; max-width: 600px, margin: auto;">
    <h2> Recuperación de contraseña </h2>
    <p> Utiliza el siguiente código para restablecer tu contraseña: </p>

    <div style="text-align: center; margin: 20px;">
    <b style="font-size: 24px; color: #007bff">
    ${code}
    </b>
    </div>

    <p style="font-size: 12px; color: #777;">
    El código de recuperación expira en 15 minutos. Si no lo pediste ignora este correo electrónico por favor
    </p>
    <hr>
    <p>© ${year}ChivoPets</p>
    `
}