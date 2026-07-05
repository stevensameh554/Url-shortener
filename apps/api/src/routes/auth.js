import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { config } from "../config.js";
import { prisma } from "../db.js";
import { asyncHandler } from "../utils/async-handler.js";
import { HttpError } from "../utils/http-error.js";
import { validate } from "../middleware/validate.js";
import { createTokenPair, hashToken, rotateRefreshToken } from "../services/tokens.js";

export const authRouter = Router();

const authSchemas = {
  register: z.object({
    body: z.object({
      name: z.string().min(2).max(80),
      email: z.string().email().toLowerCase(),
      password: z.string().min(8).max(128)
    })
  }),
  login: z.object({
    body: z.object({
      email: z.string().email().toLowerCase(),
      password: z.string().min(8).max(128)
    })
  }),
  refresh: z.object({
    body: z.object({ refreshToken: z.string().min(20) })
  }),
  logout: z.object({
    body: z.object({ refreshToken: z.string().min(20) })
  })
};

authRouter.post(
  "/register",
  validate(authSchemas.register),
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.validated.body;
    const passwordHash = await bcrypt.hash(password, config.BCRYPT_ROUNDS);

    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, name: true, email: true, createdAt: true }
    }).catch((error) => {
      if (error.code === "P2002") throw new HttpError(409, "Email already registered");
      throw error;
    });

    const tokens = await createTokenPair(user);
    res.status(201).json({ user, ...tokens });
  })
);

authRouter.post(
  "/login",
  validate(authSchemas.login),
  asyncHandler(async (req, res) => {
    const { email, password } = req.validated.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new HttpError(401, "Invalid email or password");
    }

    const tokens = await createTokenPair(user);
    res.json({
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
      ...tokens
    });
  })
);

authRouter.post(
  "/refresh",
  validate(authSchemas.refresh),
  asyncHandler(async (req, res) => {
    res.json(await rotateRefreshToken(req.validated.body.refreshToken));
  })
);

authRouter.post(
  "/logout",
  validate(authSchemas.logout),
  asyncHandler(async (req, res) => {
    await prisma.refreshToken.updateMany({
      where: { tokenHash: hashToken(req.validated.body.refreshToken), revokedAt: null },
      data: { revokedAt: new Date() }
    });
    res.status(204).send();
  })
);
