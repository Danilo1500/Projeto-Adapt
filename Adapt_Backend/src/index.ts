import express from "express";
import { AppDataSource } from "./data-source";

AppDataSource.initialize().then(async () => {
    const app = express();

    app.use(express.json());

    app.get('/', (req, res) => {
        return res.json('Tudo certo!');
    });

    return app.listen(process.env.PORT)
});