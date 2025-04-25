import { Logger } from "../../utils/interface/logger.interface";
import { HttpRequest, HttpResponse, httpError } from "../../utils/types/types";
import utilFunction from "../../utils/utilFunction";
import bcrypt from "bcrypt";

export default function buildCasesRegisterUser({ services }: { services: any }) {
    return async function postCasesRegisterUser(httpRequest: HttpRequest, log: Logger): Promise<HttpResponse> {

        try {
            const { name, email, password, otpCode, expireToken } = httpRequest.body;

            // ✅ Validar datos obligatorios
            if (!name || !email || !password) {
                return utilFunction.httpResponse(400, "Missing required fields", 9);
            }

            // ✅ Verificar si el email ya está registrado
            const existingUser = await services.users.getUsers();
            const emailExists = existingUser.some((user: any) => user.email === email);
            if (emailExists) {
                return utilFunction.httpResponse(409, "Email already registered", 9);
            }

            if (!otpCode || !expireToken) {
                log.warn("Missing otpCode or expireToken");
                return utilFunction.httpResponse(400, "OTP code and token are required", 9);
            }

            log.info(`Verifying OTP: ${otpCode} with token: ${expireToken}`);
            await utilFunction.validTokenOtp(expireToken, otpCode);

            // ✅ Hashear la contraseña antes de guardarla
            const hashedPassword = await bcrypt.hash(password, 10);

            // ✅ Crear el usuario en la base de datos
            const newUser = await services.users.createUser({
                name,
                email,
                password: hashedPassword,
            });

            // ✅ Crear la cuenta del usuario a la par 
            const newAccount = await services.acounts.createAccount({
                userId: newUser.id,
                amount: 0.0,
                subAmount: 0.0,
                sproutCoins: 0,
            });

            // ✅ Retornar la respuesta con el usuario creado
            return utilFunction.httpResponse(201, {
                message: "User registered successfully",
                userId: newUser.id,
                accountId: newAccount.id,
            }, 1);

        } catch (error) {
            const err = error as httpError;
            log.error("Error in register user case" + err);
            return utilFunction.httpResponse(500, "Internal Server Error" + err, 9);
        }
    }
}