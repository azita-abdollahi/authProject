import {Router} from "express";
import { Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.send("Welcome To my App;)")
})

export default router;