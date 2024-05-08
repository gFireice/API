const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const connect = require("../db");

class ClientController {
  async getCleints(req, res) {
    try {
      const pool = await connect();
      const result = await pool.request().query("SELECT * FROM Client");
      res.json(result.recordset);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).send("Server error");
    }
  }

  async getOneCleint(req, res) {
    const clientId = req.params.id;
    try {
      const pool = await connect();
      const result = await pool
        .request()
        .input("clientId", sql.Int, clientId)
        .query("SELECT * FROM Client WHERE IDClient = @clientId");
      if (result.recordset.length === 0) {
        return res.status(404).json({ error: "Client not found." });
      }
      res.json(result.recordset[0]);
    } catch (error) {
      console.error("Error fetching client data:", error);
      res.status(500).send("Server error");
    }
  }

  async getAdmCleint(req, res) {
    const clientId = req.params.id;
    try {
      const pool = await connect();
      const result = await pool
        .request()
        .input("clientId", sql.Int, clientId)
        .query(
          "SELECT * FROM Client WHERE IDClient = @clientId and IDPosition = 2"
        );
      if (result.recordset.length === 0) {
        return res.status(404).json({ error: "Admin client not found." });
      }

      res.json(result.recordset[0]);
    } catch (error) {
      console.error("Error fetching client data:", error);
      res.status(500).send("Server error");
    }
  }
}

module.exports = new ClientController();
