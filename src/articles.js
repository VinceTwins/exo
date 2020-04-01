const mysql = require("mysql");
const sqlConfig = require("../../settings.json").sqlConfig;
const app = require("./app.js");

app.get("/api/articles", (req, res) => {
    const sqlConnection = mysql.createConnection(sqlConfig);
    sqlConnection.query(
        "SELECT id, title, content, author, created_at FROM node_articles ORDER BY created_at DESC LIMIT 5",
        (error, result) => {
            if (error) {
                console.log("ERROR :", error.code);
            } else {
                res.send(result);
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
            [req.body.title, req.body.content, req.body.author, req.body.created_at],
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

app.route("/api/articles/delete")
    .get((req, res) => res.status(503).send({ status: "ERROR" }))
    .post((req, res) => {
        const sqlConnection = mysql.createConnection(sqlConfig);
        sqlConnection.query(
            "DELETE FROM node_articles WHERE id = ?",
            [req.body.articleId],
            (error, result) => {
                if (error) {
                    console.log("ERROR :", error.code);
                    res.status(503).send({ status: "ERROR" });
                } else {
                    console.log(result);
                    res.send({ status: "OK" });
                }
                sqlConnection.end();
            });
    });