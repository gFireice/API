const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const connect = require("../db");

class OrderController {
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
    const OrderId = req.params.id;
    try {
      const pool = await connect();
      const result = await pool
        .request()
        .input("OrderId", sql.Int, OrderId)
        .query(
          "select [Order].IDOrder, DateOrder,IDClient ,Ticket.IDConcert from [Order] left join TicketOrd on TicketOrd.IDOrder = [Order].IDOrder left join Ticket on TicketOrd.IDTicket = Ticket.IDTicket WHERE [Order].IDOrder = @OrderId"
        );
      if (result.recordset.length === 0) {
        return res.status(404).json({ error: "Order not found." });
      }
      res.json(result.recordset[0]);
    } catch (error) {
      console.error("Error fetching Order data:", error);
      res.status(500).json("Server error");
    }
  }

  async createOrder(req, res) {
    const { IDClient, tickets } = req.body;

    if (
      !IDClient ||
      !tickets ||
      !Array.isArray(tickets) ||
      tickets.length === 0
    ) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    try {
      const pool = await connect();

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
        message: "Order and tickets created successfully.",
        orderId: newOrderId,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
}

module.exports = new OrderController();
