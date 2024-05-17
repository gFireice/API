const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const connect = require("../db");

class OrganizationController {
  async getOrganiszation(req, res) {
    try {
      const pool = await connect();
      const result = await pool.request().query("select * from Organization");
      res.json(result.recordset);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json("Server error");
    }
  }

  async getOneOrganiszation(req, res) {
    const OrganizationId = req.params.id;
    try {
      const pool = await connect();
      const result = await pool
        .request()
        .input("OrganizationId", sql.Int, OrganizationId)
        .query(
          "SELECT * FROM Organization WHERE IDOrganizer = @OrganizationId"
        );
      if (result.recordset.length === 0) {
        return res.status(404).json({ error: "Organization not found." });
      }
      res.json(result.recordset[0]);
    } catch (error) {
      console.error("Error fetching Organization data:", error);
      res.status(500).json("Server error");
    }
  }
}

module.exports = new OrganizationController();
