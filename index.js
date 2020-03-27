const express = require("express");
const mysql = require("mysql");
const settings = require("./settings.json");

const sqlConfig = settings.sqlConfig;
    
const app = express();
app.listen(3000, () =>  {
    console.log("SERVER STARTED !");
});

app.use(express.static("./public"));
app.use(express.urlencoded({extended: true}));

app.get("/api/articles", (req, res) => {
    const sqlConnection = mysql.createConnection(sqlConfig);
    sqlConnection.query(
        "SELECT id, title, content, author, created_at FROM node_articles WHERE id = 1 LIMIT 1",
        (error, result) => {
            if (error) {
                console.log("ERROR :", error.code);
            } else {
                res.send(result[0]);
            }
            sqlConnection.end();
        }
    );
});

app.route("/api/articles/create")
    .get((req, res) => res.status(503).send({status: "error"}))
    .post((req, res) => {
        console.log(req.body);
        const sqlConnection = mysql.createConnection(sqlConfig);
        sqlConnection.query(
            "INSERT INTO node_articles VALUES (NULL, ?, ?, ?, ?)",
            [req.body.title, req.body.content, req.body.author, req.body.creationDate],
            (error, result) => {
                if (error) {
                    console.log("error :", error.code);
                    res.status(503).send({status: "error"});
                } else {
                    console.log(result);
                    res.send({status: "OK"});
                }
                sqlConnection.end();
            });    
    });
