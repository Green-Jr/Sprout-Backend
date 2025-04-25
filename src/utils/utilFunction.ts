import bcrypt from 'bcryptjs';
import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import axios from 'axios';


class UtilFunction {

    public async encryptedInfo(data: string): Promise<string> {

        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(data, salt);
    }

    public encriptBase64(data: any): any {

        console.log(data)
        return Buffer.from(JSON.stringify(data)).toString('base64');
    }

    public decryptBase64(encryptedBase64: any): any {

        try {
            // Decodificar desde Base64 para obtener el JSON original
            return Buffer.from(encryptedBase64, 'base64').toString();
        } catch (error) {
            return error
        }
    }


    public async generateTokenOtp(expireTime: SignOptions['expiresIn'], keyAuthCode: string, userId: string, auth?: string): Promise<string> {
        const payload = { user: keyAuthCode };
        const secret = keyAuthCode;
        const options: jwt.SignOptions = {
            expiresIn: expireTime,
            algorithm: 'HS256',
            jwtid: userId,
            subject: auth ?? 'otp-auth',
        };

        return jwt.sign(payload, secret, options);
    }

    public validTokenOtp(acessToken: string, keyAuthCode: string) {


        try {

            let verifytoken: string | JwtPayload = jwt.verify(acessToken, keyAuthCode, { algorithms: ['HS256'] });

            if (typeof verifytoken === 'object') {
                return verifytoken;
            } else {
                throw new Error('CODE_EXPIRE');
            }

        } catch (error) {
            throw new Error('CODE_EXPIRE');
        }
    }

    public isTokenExpired(isvalidTokenExpirE: any) {

        try {
            const currentTimestamp = Math.floor(Date.now() / 1000); // Obtener el tiempo actual en segundos
            const expirationTimestamp = isvalidTokenExpirE.exp; // Obtener la marca de tiempo de expiración del token

            // Verificar si el token ha expirado
            const hasExpired = currentTimestamp > expirationTimestamp;

            if (!hasExpired) {

                throw new Error("error Unauthorized")

            }

            return hasExpired

        } catch (error) {

            return error

        }

    }

    public async decryptAuth(encryptedBase64: any): Promise<any> {
        try {
            const decrypted = Buffer.from(encryptedBase64, "base64").toString();
            let data = JSON.parse(decrypted);
            return data;
        } catch (error) {
            throw new Error("authorized");
        }
    }

    public generateRandomCodeEmail(length: number) {
        const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    public httpResponse(statusCode: number, body: Object, timeOut: number): any {
        const responseData = typeof body === "string"
            ? { message: body }
            : body;

        return {
            statusCode: statusCode,
            body: {
                response: responseData,
                waitTime: `${timeOut}ms`,
                Code: Math.floor(Math.random() * 1000 * 1000),
                warning: timeOut > 3000 ? `Waiting time ${timeOut}ms, I take more time` : 0
            }
        }
    }

    public async translateToEnglishWithGemini(query: string): Promise<string | null> {
        try {
          const geminiApiKey = process.env.GEMINI_API_KEY;
          const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
      
          // Prompt para Gemini: solo queremos el JSON con la traducción
          const prompt = `Traduce la siguiente palabra o frase al inglés y responde solo con un JSON así: {"en": "traducción"}\nPalabra: "${query}"`;
      
          const body = {
            contents: [
              {
                parts: [
                  { text: prompt }
                ]
              }
            ]
          };
      
          const response = await axios.post(geminiApiUrl, body, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
      
          // Gemini responde con candidates[0].content.parts[0].text
          const candidates = response.data?.candidates;
          if (
            Array.isArray(candidates) &&
            candidates[0]?.content?.parts &&
            candidates[0].content.parts[0]?.text
          ) {
            let text = candidates[0].content.parts[0].text;
            // Limpia delimitadores de bloque de código Markdown
            text = text.trim();
            if (text.startsWith('```')) {
              // Elimina la primera línea (```json o ```)
              text = text.replace(/^```[a-zA-Z]*\n?/, '');
              // Elimina la última línea (```)
              text = text.replace(/```$/, '');
              text = text.trim();
            }
            try {
              const parsed = JSON.parse(text);
              if (parsed.en) return parsed.en;
            } catch (e) {
              // No es JSON válido
              console.error('❌ La respuesta de Gemini no es un JSON válido:', text);
            }
          }
          return null;
        } catch (error: any) {
          console.error('❌ Error al traducir con Gemini:', error.response?.data || error.message);
          return null;
        }
      }
}

export default new UtilFunction();