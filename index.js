const express = require("express");
const app = express();
const port = 4000;
const bodyParser = require("body-parser");
const db = require("./connection");
const response = require("./response");
const cors = require("cors")

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  response(200, "API v1 ready to go", "SUCCESS", res);
});

app.get("/product", (req, res) => {
  const sql = "SELECT * FROM product";
  db.query(sql, (err, fields) => {
    if (err) throw err;
    response(200, fields, "product get list", res);
  });
});

app.get("/product/:no_product", (req, res) => {
  const no_product = req.params.no_product;
  const sql = `SELECT * FROM product WHERE no_product = '${no_product}'`;
  db.query(sql, (err, fields) => {
    if (err) throw err;
    response(200, fields, "get detail product", res);
  });
});

app.post("/product", (req, res) => {
  const { no_product, name, stock, type } = req.body;

  const sql = `INSERT INTO product (no_product, name, stock, type) VALUES ('${no_product}', '${name}', '${stock}', '${type}')`;

  db.query(sql, (err, fields) => {
    if (err) response(500, "invalid", "error", res);
    if (fields?.affectedRows) {
      const data = {
        isSuccess: fields.affectedRows,
        id: fields.insertId,
      };
      response(200, data, "Data Added Successfuly", res);
    }


  });
});

app.put("/product", (req, res) => {
  const { no_product, name, stock, type, id } = req.body;
  const sql = `UPDATE product SET name = '${name}', stock = '${stock}', type = '${type}', no_product = '${no_product}' WHERE id = '${id}'`;

  db.query(sql, (err, fields) => {
    if (err) response(500, "invalid", "error", res);
    if (fields?.affectedRows) {
      const data = {
        isSuccess: fields.affectedRows,
        message: fields.message,
      };
      response(200, data, "Update data successfuly", res);
    } else {
      response(404, "user not found", "error", res);
    }
  });
});

app.delete("/product/:id", (req, res) => {

  const { id } = req.params.id;
  const sql = `DELETE FROM product WHERE id = '${id}'`;
  db.query(sql, (err, fields) => {
    if (err) response(500, "invalid", "error", res);

    if (fields?.affectedRows) {
      const data = {
        isDeleted: fields.affectedRows,
      };
      response(200, data, "Deleted Data Successfuly", res);
    } else {
      response(404, "Gagal Delete data !", "error", res);
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
