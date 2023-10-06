const express = require("express");
const router = express.Router();
const Reconnect = require("../Utils/Reconnect");
const {ObjectId} = require("mongodb");
const crypto = require("crypto");
router.get("/:id", async (req, res) => {
    try {
        database = await Reconnect(process.env.DB_NAME_MAIN);
        const {id} = req.params;

        const user = await database
            .collection("users")
            .findOne({_id: new ObjectId(id)});

        if (!user) {
            return res.status(400).send({message: "Utilisateur non trouvé.", success: false});
        }

        res.status(200).send({
            id: user._id,
            Email: user.Email,
            Login: user.Login,
            Admin: user.Admin,
        });
    } catch (error) {
        console.error(
            "Une erreur s'est produite lors de la récupération de l'utilisateur :",
            error
        );
        res.status(500).send({
            message:
                "Une erreur s'est produite lors de la récupération de l'utilisateur.",
        });
    }
});

router.put("/fidelity/:id", async (req, res) => {
    try {
        database = await Reconnect(process.env.DB_NAME_MAIN);
        const {id} = req.params;
        const {pointFidelity} = req.body;

        const user = await database
            .collection("users")
            .findOne({_id: new ObjectId(id)});

        if (!user) {
            return res.status(400).send({message: "Utilisateur non trouvé.", success: false});
        }

        let updateResult;


        if (!user.PointFideliter || user.PointFideliter === 0) {
            updateResult = await database.collection('users').updateOne(
                {_id: new ObjectId(id)},
                {$set: {PointFideliter: parseInt(pointFidelity)}}
            );
            console.log(updateResult)
        } else {
            const newPointsFidelity = user.PointFideliter + parseInt(pointFidelity);

            updateResult = await database.collection('users').updateOne(
                {_id: new ObjectId(id)},
                {$set: {PointFideliter: parseInt(newPointsFidelity)}}
            );
            console.log(updateResult)
        }
        console.log(updateResult)

        if (updateResult.modifiedCount === 1) {
            res.status(200).send({
                message: "Points de fidélité mis à jour avec succès.",
                success: true
            });
        } else {
            res.status(400).send({message: "Erreur lors de la mise à jour des points de fidélité.", success: false});
        }
    } catch (error) {
        console.error(
            "Une erreur s'est produite lors de l'ajout des points de fidélité :",
            error
        );
        res.status(500).send({
            message:
                "Une erreur s'est produite lors de l'ajout des points de fidélité'.",
        });
    }
});


/**
 * @swagger
 *   /User/edit/{id}:
 *     put:
 *       tags: ["/User/edit/:id"]
 *       description: Édite les informations d'un utilisateur.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: id de l'utilisateur à éditer.
 *         - in: path
 *           name: Login
 *           schema:
 *             type: string
 *           required: true
 *           description: Login de l'utilisateur à éditer.
 *         - in: path
 *           name: Email
 *           schema:
 *             type: string
 *           required: true
 *           description: Email de l'utilisateur à éditer.
 *         - in: path
 *           name: Password
 *           schema:
 *             type: string
 *           required: true
 *           description: Password de l'utilisateur à renseigner.
 *         - in: path
 *           name: ConfirmPassword
 *           schema:
 *             type: string
 *           required: true
 *           description: ConfirmPassword de l'utilisateur à renseigner.
 *       responses:
 *         200:
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   data:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schems/user'
 *         401:
 *           $ref: '#/components/responses/401'
 *         4XX:
 *           $ref: '#/components/responses/4XX'
 */

router.put("/edit/:id", async (req, res) => {
    try {
        const database = await Reconnect(process.env.DB_NAME_MAIN);
        const {id} = req.params;
        const {Login, Email, Password, Adresse, Pays, ConfirmPassword, Postal, Ville} = req.body;

        if (Password !== ConfirmPassword) {
            return res.status(400).send({
                message: "Les mots de passe ne sont pas équivalents.",
                success: false,
            });
        }
        if (!Email || !ConfirmPassword || !Login || !Password) {
            return res.status(400).send({
                message: "Un des champs n'a pas été rempli.",
                success: false
            });
        }

        const hashedPassword = crypto.createHash("sha1").update(Password).digest("hex");

        const dataUser = await database.collection("users").findOne({_id: new ObjectId(id)});
        await database.collection("users").updateOne(
            {_id: new ObjectId(id)},
            {
                $set: {
                    Login: Login,
                    Email: Email,
                    Password: hashedPassword,
                    Pays: Pays,
                },
            }
        );

        const userAdresse = {
            Adresse: Adresse,
            Pays: Pays,
            Ville: Ville,
            Postal: Postal
        }

        await database.collection("users").updateOne(
            {_id: new ObjectId(id)},
            {
                $push: {
                    userAdresse
                },
            }
        );
        res.status(200).send({
            Login: dataUser.Login,
            Email: dataUser.Email,
            Admin: dataUser.Admin,
            success: true,
        });

    } catch (error) {
        console.log("Erreur lors de la requête :", error)
        res.status(400).send({message: "Erreur lors de la requête", success: false})
    }
});

/**
 * @swagger
 *   /User/suspend/{id}:
 *     put:
 *       tags: ["/User/suspend/:id"]
 *       description: Suspendre un utilisateur.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: id de l'utilisateur à suspendre.
 *       responses:
 *         200:
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schems/user'
 *         401:
 *           $ref: '#/components/responses/401'
 *         4XX:
 *           $ref: '#/components/responses/4XX'
 */

router.put("/suspend/:id", async (req, res) => {
    try {
        database = await Reconnect(process.env.DB_NAME_MAIN);
        const {id} = req.params;

        const {value: user} = await database
            .collection("users")
            .findOneAndUpdate(
                {_id: new ObjectId(id)},
                {$set: {Suspend: true}},
                {returnOriginal: false}
            );

        if (!user) {
            return res
                .status(400)
                .send({message: "L'utilisateur n'a pas été trouvé."});
        } else {
            res.status(200).send({message: "Utilisateur suspendu avec succès !"});
        }
    } catch (error) {
        console.error("Erreur lors de la mise a jour de l'utilisateur:", error);
        res
            .status(500)
            .send({message: "Erreur lors de la mise à jour de l'utilisateur."});
    }
});

module.exports = router;
