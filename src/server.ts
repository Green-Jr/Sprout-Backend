import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import setting from './data/settings.json';
import { Logger } from "./utils/log";
import { connectDB }  from "./services/config/database";
import {RouterUsers} from "./router/users/users.router";
import {RouterAuth} from "./router/auth/auth.routes"
import { RouterAcounts } from "./router/acounts/acount.routes";
import { AuthMiddleware } from "./middlewares/AuthMiddleware";
import { CronJobs } from "./utils/cronJobs";
import { ServicesGateway } from "./services/index.services";

dotenv.config();

const appServer = express();

// Configura body-parser para analizar el cuerpo de las solicitudes JSON
appServer.use(express.json({
  limit: '50mb'
}));
appServer.use(express.urlencoded({
  extended: true,
  limit: '50mb'
}));


// Configura CORS
appServer.use(cors());

appServer.use(cors({
  origin: (origin, callback) => {
      if (!origin || origin === "https://sprout-frontend-production.up.railway.app") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
}));

// Inicializar y luego configurar las rutas
const startServer = async () => {
  try {
    await connectDB();

    // Inicializar cron jobs con el logger
    CronJobs.getInstance(Logger(), ServicesGateway);
    
    // ✅ Solo arrancamos el servidor si la conexión es exitosa
    appServer.listen(setting.port, () => {
      
      // Inicializa y configura las rutas del servidor
      let routerUsers = new RouterUsers(appServer, AuthMiddleware);
      let routerAuth = new RouterAuth(appServer, AuthMiddleware);
      let routerAcounts = new RouterAcounts(appServer, AuthMiddleware);

      // Llama al método setupRoutes de cada router
      routerUsers.setupRoutes();
      routerAuth.setupRoutes();
      routerAcounts.setupRoutes();
      Logger().info(`✅ Backend service running on port ${setting.port}`);
    });
  } catch (error) {
    Logger().error("❌ Failed to initialize backend, service cannot run.");
    process.exit(1);
  }
};

// 🔹 Ejecutamos la función para iniciar el servidor
startServer();