const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const connect = require("../db");

class OrderController {
  // async getOrder(req, res) {
  //   try {
  //     const pool = await connect();
  //     const result = await pool
  //       .request()
  //       .query(
  //         "select [Order].IDOrder, DateOrder,IDClient ,Ticket.IDConcert from [Order] left join TicketOrd on TicketOrd.IDOrder = [Order].IDOrder left join Ticket on TicketOrd.IDTicket = Ticket.IDTicket"
  //       );
  //     res.json(result.recordset);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     res.status(500).json("Server error");
  //   }
  // }

  async getOrder(req, res) {
    try {
      const pool = await connect();
      const result = await pool
        .request()
        .query(
          "select [Order].IDOrder, DateOrder,IDClient ,Ticket.IDConcert from [Order] left join TicketOrd on TicketOrd.IDOrder = [Order].IDOrder left join Ticket on TicketOrd.IDTicket = Ticket.IDTicket"
        );
      res.json(result.recordset);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json("Server error");
    }
  }

  async getOneOrder(req, res) {
    const CLientID = req.params.id;
    try {
      const pool = await connect();
      const result = await pool
        .request()
        .input("CLientID", sql.Int, CLientID)
        .query(
          "select Concert.*, ord.DateOrder, TicketOrd.Quantity from Concert left join Ticket on Ticket.IDConcert =Concert.IDConcert Left join TicketOrd on TicketOrd.IDTicket = Ticket.IDTicket left join [Order] ord On ord.IDOrder = TicketOrd.IDOrder WHERE ord.IDClient=@CLientID"
        );
      if (result.recordset.length === 0) {
        return res.status(404).json({ error: "Order not found." });
      }
      res.json(result.recordset);
    } catch (error) {
      console.error("Error fetching Order data:", error);
      res.status(500).json("Server error");
    }
  }

  async createOrder(req, res) {
    console.log(
      "Получен запрос на создание заказа. Переданные данные:",
      req.body
    );
    const { IDClient, tickets } = req.body;

    if (
      !IDClient ||
      !tickets ||
      !Array.isArray(tickets) ||
      tickets.length === 0
    ) {
      return res.status(400).json({ error: "Отсутствуют необходимые поля." });
    }

    try {
      const pool = await connect(); // Assuming connect() is a function that establishes the database connection
      const orderRequest = await pool.request();

      const orderResult = await orderRequest
        .input("IDClient", sql.Int, IDClient)
        .query(
          "INSERT INTO [Order] (IDClient, DateOrder) VALUES (@IDClient, GETDATE()); SELECT SCOPE_IDENTITY() AS IDOrder;"
        );

      const newOrderId = orderResult.recordset[0].IDOrder;

      for (const ticket of tickets) {
        const { ticketId, quantity } = ticket;

        const ticketOrderRequest = await pool.request();
        await ticketOrderRequest
          .input("IDOrder", sql.Int, newOrderId)
          .input("IDTicket", sql.Int, ticketId)
          .input("Quantity", sql.Int, quantity)
          .query(
            "INSERT INTO [TicketOrd] (IDOrder, IDTicket, Quantity) VALUES (@IDOrder, @IDTicket, @Quantity);"
          );
      }

      res.status(201).json({
        message: "Заказ и билеты успешно созданы.",
        orderId: newOrderId,
      });
    } catch (error) {
      console.error("Ошибка при создании заказа:", error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }
}

module.exports = new OrderController();
