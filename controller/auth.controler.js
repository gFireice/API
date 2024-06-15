const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const connect = require("../db");
const sql = require("mssql");
const secret_key = require("../config/secret_key");
const Joi = require("joi");

class authController {
  async login(req, res) {
    const { identifier, password } = req.body;

    // Валидация данных запроса
    if (!identifier || identifier.trim() === "") {
      return res.status(400).json({ error: "Identifier is required." });
    }

    if (!password || password.trim() === "") {
      return res.status(400).json({ error: "Password is required." });
    }

    try {
      // Подключение к базе данных
      const pool = await connect();

      // Поиск пользователя по идентификатору
      const result = await pool
        .request()
        .input("identifier", sql.NVarChar, identifier)
        .query(
          "SELECT * FROM Client WHERE LoginC = @identifier OR Phone = @identifier OR Email = @identifier"
        );

      if (result.recordset.length === 0) {
        return res.status(404).json({ error: "User not found." });
      }

      const user = result.recordset[0];

      // Проверка на удаление пользователя
      if (user.isDeleted) {
        return res
          .status(403)
          .json({ error: "User is not allowed to authenticate." });
      }

      const passwordMatch = bcrypt.compare(password, user.PasswordC);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      // Создание JWT-токена
      const token = jwt.sign(
        { userId: user.IDClient, login: user.Login },
        secret_key.jwt,
        {
          expiresIn: "1h",
        }
      );

      // Отправка ответа с токеном
      return res.status(200).json({
        token,
        IdUser: user.IDClient,
        IDPosition: user.IDPosition,
        FirstName: user.FirstName,
        LastName: user.LastName,
        Phone: user.Phone,
        Email: user.Email,
        Birthday: user.Birthday,
      });
    } catch (error) {
      console.json({ error: "Error during login:" });

      if (error instanceof sql.ConnectionError) {
        return res.status(500).json({ error: "Database connection error." });
      }

      return res.status(500).json({ error: "Internal server error." });
    }
  }
  //!!___________________________________________________________
  // async register(req, res) {
  //   const {
  //     firstName,
  //     lastName,
  //     birthday,
  //     phone,
  //     email,
  //     gender,
  //     login,
  //     password,
  //   } = req.body;

  //   // Валидация данных
  //   if (
  //     !firstName ||
  //     !lastName ||
  //     !birthday ||
  //     !phone ||
  //     !email ||
  //     !gender ||
  //     !login ||
  //     !password
  //   ) {
  //     return res.status(400).json({ error: "All fields are required." });
  //   }

  //   try {
  //     const pool = await connect();

  //     // Проверка, существует ли пользователь с таким же логином или email
  //     const existingUser = await pool
  //       .request()
  //       .input("login", sql.NVarChar, login)
  //       .input("email", sql.NVarChar, email)
  //       .input("phone", sql.NVarChar, phone)
  //       .query(
  //         "SELECT * FROM Client WHERE Login = @login OR Email = @email OR Phone = @phone"
  //       );

  //     if (existingUser.recordset.length > 0) {
  //       return res
  //         .status(400)
  //         .json({ error: "User with this login or email already exists." });
  //     }

  //     const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
  //     await pool
  //       .request()
  //       .input("firstName", sql.NVarChar, firstName)
  //       .input("lastName", sql.NVarChar, lastName)
  //       .input("birthday", sql.Date, birthday)
  //       .input("phone", sql.NVarChar, phone)
  //       .input("email", sql.NVarChar, email)
  //       .input("gender", sql.Int, gender)
  //       .input("login", sql.NVarChar, login)
  //       .input("password", sql.NVarChar, hashedPassword) // Correct assignment of hashed password
  //       .query(
  //         "INSERT INTO Client (FirstName, LastName, Birthday, Phone, Email, IDGender, Login, Password, isDeleted, IDPosition) VALUES (@firstName, @lastName, @birthday, @phone, @email, @gender, @login, @password, 0, 1)"
  //       );

  //     const newUser = result.recordset[0];
  //     const userId = newUser.IDClient;

  //     // Создание JWT-токена после успешной регистрации
  //     const token = jwt.sign(
  //       { userId: user.IDClient, login: user.Login },
  //       secret_key.jwt,
  //       {
  //         expiresIn: "1h",
  //       }
  //     );

  //     // Возвращение ответа с токеном
  //     return res.status(200).json({
  //       token,
  //       message: "User registered successfully.",
  //     });
  //   } catch (error) {
  //     console.error("Error during registration:", error);
  //     return res.status(500).json({ error: "Internal server error." });
  //   }
  // }
}

module.exports = new authController();
