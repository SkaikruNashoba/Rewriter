const express = require("express");
const router = express.Router();
const Reconnect = require("../Utils/Reconnect");
const {ObjectId} = require("mongodb");
const crypto = require("crypto");
router.get("/:id", async (req, res) => {
    try {
        database = await Reconnect(process.env.DB_NAME_MAIN);
        const {id} = req.params;

        const adresse = await database
            .collection("adresse")
            .findOne({_id: new ObjectId(id)});

        if (!adresse) {
           res.status(400).send({message: "Adresse non trouvé.", success: false});
        }

        const adresses = {
            adresse
        }

        res.status(200).send({adresses, success: true});
    } catch (error) {
        console.error(
            "Une erreur s'est produite lors de la récupération des adresses :",
            error
        );
        res.status(500).send({
            message:
                "Une erreur s'est produite lors de la récupération des adresses.",
        });
    }
});
router.get("/unique/:id", async (req, res) => {
    try {
        database = await Reconnect(process.env.DB_NAME_MAIN);
        const {id} = req.params;

        const adresse = await database
            .collection("adresse")
            .findOne({"Adresses.idAdresse": new ObjectId(id)});

        if (!adresse) {
            res.status(400).send({message: "Adresse non trouvée.", success: false});
        }

        const adresseCorrespondante = adresse.Adresses.find(ad => ad.idAdresse.equals(new ObjectId(id)));

        if (!adresseCorrespondante) {
            res.status(400).send({message: "Adresse correspondante non trouvée.", success: false});
        }

        res.status(200).send({adresse: adresseCorrespondante, success: true});
    } catch (error) {
        console.error("Une erreur s'est produite lors de la récupération des adresses :", error);
        res.status(500).send({
            message: "Une erreur s'est produite lors de la récupération des adresses.",
        });
    }
});


router.put("/edit/:id", async (req, res) => {
    try {
        const database = await Reconnect(process.env.DB_NAME_MAIN);
        const {id} = req.params;
        const {Adresse, Pays, Postal, Ville, idAdresse} = req.body;

        const Adresses = {
            Adresse: Adresse,
            Pays: Pays,
            Ville: Ville,
            Postal: Postal
        }

        const result = await database.collection("adresse").updateOne(
            {"Adresses.idAdresse": new ObjectId(idAdresse)},
            {
                $set: {
                    "Adresses.$.Adresse": Adresses.Adresse,
                    "Adresses.$.Pays": Adresses.Pays,
                    "Adresses.$.Ville": Adresses.Ville,
                    "Adresses.$.Postal": Adresses.Postal
                }
            }
        );

        if (result.modifiedCount === 1) {
            res.status(200).send({
                Adresses,
                idAdresse: idAdresse,
                success: true,
            });
        } else {
            res.status(404).send({
                success: false,
                message: "L'enregistrement n'a pas été trouvé ou la mise à jour n'a pas été effectuée."
            });
        }

    } catch (error) {
        console.log("Erreur lors de la requête :", error)
        res.status(400).send({message: "Erreur lors de la requête", success: false})
    }
});


router.post("/add/:id", async (req, res) => {
    try {
        const database = await Reconnect(process.env.DB_NAME_MAIN);
        const {id} = req.params;
        const {Adresse, Pays, Postal, Ville} = req.body;

        const newAddress = {
            idAdresse: new ObjectId(),
            Adresse: Adresse,
            Pays: Pays,
            Ville: Ville,
            Postal: Postal
        }

        const result = await database.collection('adresse').updateOne(
            {_id: new ObjectId(id)},
            {$push: {Adresses: newAddress}}
        );

        if (result.modifiedCount === 1) {
            res.status(200).send({
                newAddress,
                success: true,
            });
        } else {
            res.status(404).send({
                success: false,
                message: "L'enregistrement n'a pas été trouvé ou la mise à jour n'a pas été effectuée."
            });
        }

    } catch (error) {
        console.log("Erreur lors de la requête :", error)
        res.status(400).send({message: "Erreur lors de la requête", success: false})
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const database = await Reconnect(process.env.DB_NAME_MAIN);
        const {id} = req.params;

        const result = await database.collection('adresse').updateOne(
            {"Adresses.idAdresse": new ObjectId(id)},
            {$pull: {"Adresses": {"idAdresse": new ObjectId(id)}}}
        );

        if (result.modifiedCount === 0) {
            res.status(400).send({message: "L'adresse n'a pas été trouvée ou supprimée", success: false});
        } else {
            res.status(200).send({message: "Suppression réussie !", success: true});
        }
    } catch (error) {
        console.log("Erreur lors de la requête :", error);
        res.status(400).send({message: "Erreur lors de la requête", success: false});
    }
});

module.exports = router;
