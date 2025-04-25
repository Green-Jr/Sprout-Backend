import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

/* 
si ves esto mandame el stiker de una banana y un :v 
*/

const sequelize = new Sequelize(process.env.PG_URI as string, {
  dialect: 'postgres',
  logging: console.log,
  dialectOptions: {
    ssl: {
      require: true, // Render necesita SSL para la conexión
      rejectUnauthorized: false,
    },
    searchPath: ['USERS']
  }
});

export const connectDB = async () => {
  try {
    
    await sequelize.authenticate();
    console.log("✅ Conexión a PostgreSQL establecida.");

    // Sincronizar modelos (sin borrar datos)
    await sequelize.sync({ alter: false });
    console.log("✅ Base de datos sincronizada correctamente.");

  } catch (error) {
    console.error("❌ Error al conectar a PostgreSQL:", error);
    process.exit(1);
  }
};

export default sequelize;

