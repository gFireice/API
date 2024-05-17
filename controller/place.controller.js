const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const connect = require("../db");

class PlaceController {
  async getPlace(req, res) {
    try {
      const pool = await connect();
      const result = await pool.request().query("select * from Place");
      res.json(result.recordset);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json("Server error");
    }
  }

  async getOnePlace(req, res) {
    const PlaceId = req.params.id;
    try {
      const pool = await connect();
      const result = await pool
        .request()
        .input("PlaceId", sql.Int, PlaceId)
        .query("SELECT * FROM Place WHERE IDPlace = @PlaceId");
      if (result.recordset.length === 0) {
        return res.status(404).json({ error: "Place not found." });
      }
      res.json(result.recordset[0]);
    } catch (error) {
      console.error("Error fetching Place data:", error);
      res.status(500).json("Server error");
    }
  }
}

module.exports = new PlaceController();
