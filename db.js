const sql = require("mssql/msnodesqlv8");

var config = {
  server: "DESKTOP-RC4HH44\\SQLEXPRESS01",
  database: "Ticket_Buy",
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true,
  },
};

// Функция для подключения к базе данных
async function connect() {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}

module.exports = connect;
