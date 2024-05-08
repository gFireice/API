const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const connect = require("../db");

class MusicianController {
  async getMusician(req, res) {
    try {
      const pool = await connect();
      const result = await pool.request().query("SELECT * FROM Musician");
      res.json(result.recordset);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json("Server error");
    }
  }

  async getOneMusician(req, res) {
    const musicianId = req.params.id;
    try {
      const pool = await connect();
      const result = await pool
        .request()
        .input("musicianId", sql.Int, musicianId)
        .query("SELECT * FROM Musician WHERE IDMusician = @musicianId");
      if (result.recordset.length === 0) {
        return res.status(404).json({ error: "Musician not found." });
      }
      res.json(result.recordset[0]);
    } catch (error) {
      console.error("Error fetching musician data:", error);
      res.status(500).json("Server error");
    }
  }
}

module.exports = new MusicianController();
