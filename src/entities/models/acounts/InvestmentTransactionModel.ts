import { DataTypes } from "sequelize";
import sequelize from "../../../services/config/database";
import User from "../users/usersModel";
import Investment from "./investmentModel";

const InvestmentTransaction = sequelize.define("InvestmentTransaction", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: "ID"
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "USER_ID",
        references: {
            model: User,
            key: "ID"
        }
    },
    investmentId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "INVESTMENT_ID",
        references: {
            model: Investment,
            key: "ID",
        }
    },
    type: {
        type: DataTypes.ENUM("REDEMPTION", "INVESTMENT", "ADJUSTMENT"),
        allowNull: false,
        field: "TYPE"
    },
    amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        field: "AMOUNT",
        validate: {
            min: 0
        }
    },
    cryptoAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        field: "CRYPTO_AMOUNT",
        validate: {
            min: 0
        }
    },
    asset: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: "ASSET"
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false, // Cambiado a false para consistencia
        field: "CREATED_AT",
        defaultValue: DataTypes.NOW
    }
}, {
    schema: "USERS",
    tableName: "INVESTMENT_TRANSACTIONS",
    timestamps: false,
    freezeTableName: true,
    underscored: true,
});

// Relaciones actualizadas
InvestmentTransaction.belongsTo(User, { 
    foreignKey: "userId",
    as: "user"
});

InvestmentTransaction.belongsTo(Investment, {
    foreignKey: "investmentId",
    as: "investment",
    onDelete: 'SET NULL' // Sincronizado con la DB
});

export default InvestmentTransaction;