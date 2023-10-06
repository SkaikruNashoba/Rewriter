const express = require("express");
const router = express.Router();
const Reconnect = require("../Utils/Reconnect");
const crypto = require("crypto");
const {ObjectId} = require("mongodb");

/**
 *  Partie function
 *
 * ----------------------
 * | /login             | Connecte l'utilisateur (type POST)
 * | /register          | Enregistre l'utilisateur (type POST)
 * ----------------------
 */

router.put("/login", async (req, res) => {
    try {
        database = await Reconnect(process.env.DB_NAME_MAIN);
        const {Email, Password} = req.body;

        const user = await database.collection("users").findOne({Email: Email});
        const userAdresse = await database.collection('adresse').findOne({idUser: new ObjectId(user._id)})

        if (!user) {
            return res
                .status(400)
                .send({message: "Utilisateur non trouvé.", success: false});
        }

        const hashedPassword = crypto
            .createHash("sha1")
            .update(Password)
            .digest("hex");

        if (user.Password !== hashedPassword) {
            return res
                .status(400)
                .send({message: "Mot de passe incorrect.", success: false});
        }

        if (user.Suspend === true) {
            return res
                .status(400)
                .send({message: "Compte suspendu", success: false});
        }

        res.status(200).send({
            user: {
                id: user._id,
                Email: user.Email,
                Login: user.Login,
                Admin: false,
                idAdresse: userAdresse._id,
                Adresses: userAdresse.Adresses
            },
            success: true,
        });
    } catch (error) {
        console.error("Une erreur s'est produite lors de la connexion :", error);
        res.status(500).send({
            message: "Une erreur s'est produite lors de la connexion.",
            success: false,
        });
    }
});

router.post("/register", async (req, res) => {
    try {
        database = await Reconnect(process.env.DB_NAME_MAIN);
        const {
            Login,
            Email,
            Password,
            ConfirmPassword,
            Admin,
            Suspend,
            Adresse,
            Pays,
            Ville,
            Postal
        } = req.body;


        const hashedPassword = crypto
            .createHash("sha1")
            .update(Password)
            .digest("hex");


        const userAdresse = {
            idAdresse: new ObjectId(),
            Adresse: Adresse,
            Ville: Ville,
            Pays: Pays,
            Postal: Postal
        }
        const user = {
            Login: Login,
            Email: Email,
            Password: hashedPassword,
            Admin: Admin ? Boolean(Admin) : false,
            Suspend: Suspend ? Boolean(Suspend) : false,
        };

        const existingUser = await database
            .collection("users")
            .findOne({Email: user.Email});

        if (existingUser) {
            return res.status(400).send({
                message: "Un utilisateur avec le même email existe déjà !",
                success: false,
            });
        }
        if (Password !== ConfirmPassword) {
            return res.status(400).send({
                message: "Les mots de passe ne sont pas équivalent !",
                success: false,
            });
        }
        if (!Login || !Email || !Password || !ConfirmPassword) {
            return res.status(400).send({
                message: "Un des champs n'a pas été remplis !",
                success: false,
            });
        }

        await database
            .collection("users")
            .insertOne(user)
            .then(() => {
                res.status(200).send({
                    user: {id: user._id, Login, Email: user.Email},
                    success: true,
                });
            })
            .catch((error) => {
                console.error(error);
                res.status(400).send({
                    message: "Échec de l'enregistrement de l'utilisateur.",
                    success: false,
                });
            });

        await database.collection("adresse").insertOne({
            idUser: new ObjectId(user._id),
            Adresses: [userAdresse],
        });


    } catch (error) {
        console.error(error.message);
        res.status(500).send({
            message: "Une erreur est survenue lors du traitement de la demande.",
            success: false,
        });
    }
});

module.exports = router;
