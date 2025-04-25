// services/emailBrevoTemplate.ts
import axios from 'axios';
import dotenv from 'dotenv';
import settings from "../../data/settings.json"

dotenv.config();

interface EmailParams {
  [key: string]: string | number;
}

const API_KEY = process.env.EMAIL_API_KEY!;
const API_URL = settings.url_services.email.otp.url;

export const emailService = {

    async sendEmailWithTemplate(to: string, params: Record<string, string>) {

        try {
          await axios.post(
            API_URL,
            {
              to: [{ email: to }],
              templateId: settings.url_services.email.otp.template_id,
              params: params,
              headers: {
                name: 'Sprout Found', // opcional
                email: 'junikoescobar11@gmail.com',
              },
            },
            {
              headers: {
                'api-key': API_KEY,
                'Content-Type': 'application/json',
              },
            }
          );
      
          console.log(`✅ Correo enviado a ${to} con plantilla #${settings.url_services.email.otp.template_id}`);
        } catch (error: any) {
          console.error('❌ Error al enviar el correo:', error.response?.data || error.message);
        }
    },

    async sendRedemptionEmail(to: string, params: {
      title: string;
      message: string;
      asset: string;
      amount: string;
      performance: string;
      reason: string;
  }): Promise<boolean> {
      try {
          await axios.post(
              API_URL,
              {
                  to: [{ email: to }],
                  templateId: settings.url_services.email.redemption_template_id, // ID de tu plantilla de redención
                  params: {
                      TITLE: params.title,
                      MESSAGE: params.message,
                      ASSET: params.asset,
                      AMOUNT: params.amount,
                      PERFORMANCE: params.performance,
                      REASON: params.reason
                  },
                  headers: {
                      name: 'Sprout Found',
                      email: 'junikoescobar11@gmail.com'
                  }
              },
              {
                  headers: {
                      'api-key': API_KEY,
                      'Content-Type': 'application/json',
                  },
              }
          );
          return true;
      } catch (error) {
          console.error('Error sending redemption email:', error);
          return false;
      }
  }
 
}
