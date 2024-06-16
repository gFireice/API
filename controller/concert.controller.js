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

  async addConcert(req, res) {
    const {
      TitleConcert,
      StartDate,
      DurationInHours,
      Description,
      Poster,
      Price,
      InStock,
      IDStyleOfMusic,
      IDPlace,
      IDOrganization,
    } = req.body;
    try {
      const pool = await connect();
      const result = await pool
        .request()
        .input("TitleConcert", sql.NVarChar(50), TitleConcert)
        .input("StartDate", sql.DateTime, StartDate)
        .input("DurationInHours", sql.Decimal(10, 2), DurationInHours)
        .input("Description", sql.NVarChar(500), Description)
        .input("Poster", sql.NVarChar(sql.MAX), Poster)
        .input("Price", sql.Decimal(10, 2), Price)
        .input("InStock", sql.Int, InStock)
        .input("IDStyleOfMusic", sql.Int, IDStyleOfMusic)
        .input("IDPlace", sql.Int, IDPlace)
        .input("IDOrganization", sql.Int, IDOrganization).query(`
          INSERT INTO Concert (TitleConcert, StartDate, DurationInHours, Description, Poster, Price, InStock, IDStyleOfMusic, IDPlace, IDOrganization)
          VALUES (@TitleConcert, @StartDate, @DurationInHours, @Description, @Poster, @Price, @InStock, @IDStyleOfMusic, @IDPlace, @IDOrganization)
        `);
      res.status(201).json({ message: "Concert added successfully." });
    } catch (error) {
      console.error("Error adding concert:", error);
      res.status(500).json("Server error");
    }
  }

  async updateConcert(req, res) {
    const ConcertId = req.params.id;
    const {
      TitleConcert,
      StartDate,
      DurationInHours,
      Description,
      Poster,
      Price,
      InStock,
      IDStyleOfMusic,
      IDPlace,
      IDOrganization,
    } = req.body;
    try {
      const pool = await connect();
      const result = await pool
        .request()
        .input("ConcertId", sql.Int, ConcertId)
        .input("TitleConcert", sql.NVarChar(50), TitleConcert)
        .input("StartDate", sql.DateTime, StartDate)
        .input("DurationInHours", sql.Decimal(10, 2), DurationInHours)
        .input("Description", sql.NVarChar(500), Description)
        .input("Poster", sql.NVarChar(sql.MAX), Poster)
        .input("Price", sql.Decimal(10, 2), Price)
        .input("InStock", sql.Int, InStock)
        .input("IDStyleOfMusic", sql.Int, IDStyleOfMusic)
        .input("IDPlace", sql.Int, IDPlace)
        .input("IDOrganization", sql.Int, IDOrganization).query(`
          UPDATE Concert
          SET TitleConcert = @TitleConcert,
              StartDate = @StartDate,
              DurationInHours = @DurationInHours,
              Description = @Description,
              Poster = @Poster,
              Price = @Price,
              InStock = @InStock,
              IDStyleOfMusic = @IDStyleOfMusic,
              IDPlace = @IDPlace,
              IDOrganization = @IDOrganization
          WHERE IDConcert = @ConcertId
        `);
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ error: "Concert not found." });
      }
      res.json({ message: "Concert updated successfully." });
    } catch (error) {
      console.error("Error updating concert:", error);
      res.status(500).json("Server error");
    }
  }
}

module.exports = new ConcertController();
