// src/routes/user.ts

import { Router } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { prisma } from "../prisma";
import { auth } from "../utils/auth";

const router = Router();

router.get("/profile", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  res.json({ user });
});

export default router;
