const { MongoClient, ObjectId } = require("mongodb");

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

/**
 *
 * Fonction de reconnexion lors d'un appel à une route
 *
 * .env = Fichier externe d'information de la base de donnée.
 *
 * .DB_NAME_RECETTE = Nom de la base de donnée à laquelle se connecter
 *
 * @param {string} .env
 * @param {string} .DB_NAME_RECETTE
 * @returns {string} database
 *
 */

async function Reconnect(db_Name) {
  const db = await client.connect();
  database = client.db(db_Name);
  return database;
}

module.exports = Reconnect;
