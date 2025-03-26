import { Router, Request, Response } from "express";
import { Bot } from "../interfaces/interface";
import sendPdf from "../controllers/send-pdf.controller";
import sendText from "../controllers/send-text.controller";

export default function Routes(client: Bot["client"]): Router {
    const router = Router();

    router.post("/send-pdf", async (req: Request, res: Response) => {
        await sendPdf(req, res, client);
    });

    router.post("/send-text", async (req: Request, res: Response) => {
        await sendText(req, res, client);
    });

    return router;
}
