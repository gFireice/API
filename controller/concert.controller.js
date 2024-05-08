const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const connect = require("../db");

class ConcertController {
  async getConcert(req, res) {
    try {
      const pool = await connect();
      const result = await pool.request().query("SELECT * FROM Concert");
      res.json(result.recordset);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json("Server error");
    }
  }

  async getOneConcert(req, res) {
    const ConcertId = req.params.id;
    try {
      const pool = await connect();
      const result = await pool
        .request()
        .input("ConcertId", sql.Int, ConcertId)
        .query("SELECT * FROM Concert WHERE IDConcert = @ConcertId");
      if (result.recordset.length === 0) {
        return res.status(404).json({ error: "Concert not found." });
      }
      res.json(result.recordset[0]);
    } catch (error) {
      console.error("Error fetching Concert data:", error);
      res.status(500).json("Server error");
    }
  }
}

module.exports = new ConcertController();
