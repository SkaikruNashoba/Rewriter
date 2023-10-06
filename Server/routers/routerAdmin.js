const express = require("express");
const router = express.Router();
const Reconnect = require("../Utils/Reconnect");
const {ObjectId} = require("mongodb");
const crypto = require("crypto");

router.post("/login/", async (req, res) => {
    try {
        database = await Reconnect(process.env.DB_NAME_MAIN);
        const {Email, Password} = req.body;

        const adminResult = await database
            .collection("users")
            .findOne({Email: Email, Admin: true});

        if (!adminResult) {
            return res.status(400).send({message: "Admin non trouvé.", success: false});
        }

        const hashedPassword = crypto
            .createHash("sha1")
            .update(Password)
            .digest("hex");

        if (adminResult.Password !== hashedPassword) {
            return res.status(400).send({message: "Mot de passe incorrect.", success: false});
        }

        if (adminResult.Suspend === true) {
            return res.status(400).send({message: "Compte suspendu", success: false});
        }

        if (adminResult.Admin !== true) {
            return res
                .status(400)
                .send({message: "Vous n'avez pas accès à cette page", success: false});
        } else {
            res.status(200).send({
                id: adminResult._id,
                Email: adminResult.Email,
                Login: adminResult.Login,
                Admin: adminResult.Admin,
                Adresse: adminResult.Adresse,
                Pays: adminResult.Pays,
                success: true
            });
        }
    } catch (error) {
        console.error("Une erreur s'est produite lors de la connexion :", error);
        res
            .status(500)
            .send({message: "Une erreur s'est produite lors de la connexion.", success: false});
    }
});
router.get("/users/", async (req, res) => {
    try {
        database = await Reconnect(process.env.DB_NAME_MAIN);

        const userCursor = await database.collection("users").find();
        const user = await userCursor.toArray();

        if (!user) {
            return res.status(400).send({message: "Utilisateurs non trouvés.", success: false});
        }

        res.status(200).send({data: user, success: true});
    } catch (error) {
        console.error(
            "Une erreur s'est produite lors de la récupération des utilisateurs :",
            error
        );
        res.status(500).send({
            message:
                "Une erreur s'est produite lors de la récupération des utilisateurs.",
        });
    }
});

router.put("/add/:id", async (req, res) => {
    try {
        database = await Reconnect(process.env.DB_NAME_MAIN);
        const {id} = req.params;

        const {value: user} = await database
            .collection("users")
            .findOneAndUpdate(
                {_id: new ObjectId(id)},
                {$set: {Admin: true}},
                {returnOriginal: false}
            );

        if (!user) {
            return res
                .status(400)
                .send({message: "L'utilisateur n'a pas été trouvé.", success: false});
        } else {
            res.status(200).send({message: "Admin retiré avec succès !", success: true});
        }
    } catch (error) {
        console.error("Erreur lors de la mise a jour de l'utilisateur:", error);
        res
            .status(500)
            .send({message: "Erreur lors de la mise à jour de l'utilisateur.", success: false});
    }
});
router.put("/suspend/:id", async (req, res) => {
    try {
        database = await Reconnect(process.env.DB_NAME_MAIN);
        const {id} = req.params;

        const {value: user} = await database
            .collection("users")
            .findOneAndUpdate(
                {_id: new ObjectId(id)},
                {$set: {Admin: false}},
                {returnOriginal: true}
            );

        if (!user) {
            return res
                .status(400)
                .send({message: "L'utilisateur n'a pas été trouvé.", success: false});
        } else {
            res.status(200).send({message: "Admin retirer avec succès !", success: true});
        }
    } catch (error) {
        console.error("Erreur lors de la mise a jour de l'utilisateur:", error);
        res
            .status(500)
            .send({message: "Erreur lors de la mise à jour de l'utilisateur.", success: false});
    }
});

module.exports = router;
