module.exports = {
    user: process.env.NODE_ORACLEDB_USER || "soso",
    password: process.env.NODE_ORACLEDB_PASSWORD || "Bl00mb3rg",
    connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING || "orascan.mia.ge:1521/orascan.mia.ge",
    externalAuth: process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false
};