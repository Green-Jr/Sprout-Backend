import cron from 'node-cron';
import { Logger } from "./interface/logger.interface";
import sequelize from '../services/config/database';
import utilFunction from './utilFunction';
import { ServicesGateway } from '../services/index.services'

export class CronJobs {
    private static instance: CronJobs;
    private log: Logger;
    private services: typeof ServicesGateway;

    private constructor(log: Logger, services: typeof ServicesGateway = ServicesGateway) {
        this.log = log;
        this.services = services;
        this.initCronJobs();
    }

    public static getInstance(log: Logger, services?: typeof ServicesGateway): CronJobs {
        if (!CronJobs.instance) {
            CronJobs.instance = new CronJobs(log, services);
        }
        return CronJobs.instance;
    }

    private async executeDbFunction(funcName: string) {
        const startTime = Date.now();
        try {
            await sequelize.query(`SELECT "USERS"."${funcName}"()`);
            this.log.info(`✅ Función ${funcName} ejecutada correctamente`);
        } catch (error: any) {
            this.log.error(`Error ejecutando ${funcName}: ${error.message}`);
            throw utilFunction.httpResponse(500, `Error en ${funcName}`, Date.now() - startTime);
        }
    }

    private async executeRiskManagement() {
        const startTime = Date.now();
        try {
            const { executeAutomaticRiskManagement } = await import('./utilServices');
            await executeAutomaticRiskManagement(this.services, this.log);
            this.log.info(`✅ Gestión de riesgo automática ejecutada correctamente`);
        } catch (error: any) {
            this.log.error(`Error en gestión de riesgo automática: ${error.message}`);
            throw utilFunction.httpResponse(500, 'Error en gestión de riesgo', Date.now() - startTime);
        }
    }

    private initCronJobs() {
        // AUTO_INVEST - Segundo 15 de cada minuto
        cron.schedule('15 * * * * *', async () => {
            try {
                this.log.debug('🔄 Ejecutando AUTO_INVEST (15s)');
                await this.executeDbFunction('AUTO_INVEST');
                this.log.debug('✅ AUTO_INVEST completado');
            } catch (error) {
                this.log.error(`❌ Error en AUTO_INVEST: ${error instanceof Error ? error.message : String(error)}`);
            }
        });

        // SIMULATE_MARKET - Segundo 30 de cada minuto
        cron.schedule('30 * * * * *', async () => {
            try {
                this.log.debug('🔄 Ejecutando SIMULATE_MARKET (30s)');
                await this.executeDbFunction('SIMULATE_MARKET');
                this.log.debug('✅ SIMULATE_MARKET completado');
            } catch (error) {
                this.log.error(`❌ Error en SIMULATE_MARKET: ${error instanceof Error ? error.message : String(error)}`);
            }
        });

        // Risk Management - Segundo 45 de cada minuto (cada 5 minutos para pruebas)
        // cron.schedule('45 */5 * * * *', async () => {
        cron.schedule('45 * * * * *', async () => {
            try {
                this.log.debug('🔄 Ejecutando Risk Management (45s cada 5min)');
                await this.executeRiskManagement();
                this.log.debug('✅ Risk Management completado');
            } catch (error) {
                this.log.error(`❌ Error en Risk Management: ${error instanceof Error ? error.message : String(error)}`);
            }
        });

        this.log.info("🕒 Cron jobs configurados:");
    }
}