/*
 * Connexion à la base de donnée.
 * Obligation d'avoir le .env pour avoir les infos de connexion.
 * Utilisation de Mongodb
 *
 */

require("dotenv").config();
const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const {MongoClient} = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());
const routerUser = require("./routers/routerUser");
const routerAdmin = require("./routers/routerAdmin");
const routerFunction = require("./routers/routerFunction");
const routerAdresse = require("./routers/routerAdresse");
/**
 * .env = Fichier externe d'information de la base de donnée.
 *
 * .DB_STRING = URL de la base de donnée à laquelle se connecter
 *
 * .client = Résultat de la connexion
 *
 * @param {string} .env
 * @param {string} .DB_STRING
 */

const client = new MongoClient(process.env.DB_STRING);
let database;

// const NotThis = ["Login", "Register"];

app.use(express.urlencoded({extended: true}));

/**
 *
 * Fonction de connexion à la base de donnée.
 * Listing de toutes les bases de données présentent.
 *
 * @param {string} client
 * @return {list}
 */
const listDatabases = async (client) => {
    const databasesList = await client.db().admin().listDatabases();

    console.log("List of \x1b[1m\x1b[34m\x1b[7mDatabases\x1b[0m:");
    databasesList.databases.forEach((db) =>
        console.log(` - \x1b[34m${db.name}\x1b[0m`)
    );
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
};

/**
 * Fonction de connexion à la base de donnée nommé "Recette"
 *
 * .env = Fichier externe d'information de la base de donnée.
 *
 * .DB_NAME_MAIN = Nom de la base de donnée à laquelle se connecter
 *
 * @param {string} .env
 * @param {string} .DB_NAME_MAIN
 * @returns {string}
 */

const main = async (db_Name) => {
    try {
        await client.connect();
        database = client.db(db_Name);
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        console.log(`    Database ${db_Name} STATUS:`);
        console.log("    \x1b[1m\x1b[92m\x1b[7mConnection successful.\x1b[0m");
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        if (process.env.STAGING === "dev") {
            await listDatabases(client);
        }
    } catch (error) {
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        console.log(`    Database ${db_Name} STATUS:`);
        console.log("    \x1b[1m\x1b[31m\x1b[7mConnection failed.\x1b[0m");
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        if (process.env.STAGING === "dev") {
            console.log("    \x1b[1m\x1b[31mError Block:\x1b[0m");
            console.log(error);
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        }
    } finally {
        // pour que le serveur tourne toujours après la demande
    }
};

app.listen(process.env.PORT, () => {
    console.log(`App started on port: ${process.env.PORT}`);
    console.log(`App staging mode: ${process.env.STAGING}`);
});

app.get("/", (req, res) => {
    res.send({});
});

app.use("/User", routerUser);
app.use("/Function", routerFunction);
app.use("/Admin", routerAdmin);
app.use("/Adresse", routerAdresse);

/**
 * Partie Main
 */

main(process.env.DB_NAME_MAIN)
    .then(() => {
    })
    .catch((err) => {
        console.error(err);
    });

module.exports.handler = serverless(app);
