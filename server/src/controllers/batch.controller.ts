import { Request, Response } from "express";
import { pool } from "../utils/db";
import crypto from "crypto";
import { inviteStore } from "../utils/inviteStore";
import { AuthRequest } from "../types/express";

export const createBatch = async (req: AuthRequest, res: Response) => {
  const { name, institutionId } = req.body;

  const result = await pool.query(
    "INSERT INTO batches (name, institution_id) VALUES ($1,$2) RETURNING *",
    [name, institutionId]
  );

  res.json(result.rows[0]);
};

export const generateInvite = async (req: AuthRequest, res: Response) => {
  const token = crypto.randomBytes(16).toString("hex");

  inviteStore.set(token, {
    batchId: req.params.id as string,
  });

  res.json({
    inviteLink: `http://localhost:3000/join?token=${token}`,
  });
};

export const joinBatch = async (req: AuthRequest, res: Response) => {
  const { token } = req.body;

  const invite = inviteStore.get(token);

  if (!invite) {
    return res.status(400).json({ message: "Invalid token" });
  }

  await pool.query(
    "INSERT INTO batch_students (batch_id, student_id) VALUES ($1,$2)",
    [invite.batchId, req.user!.id]
  );

  res.json({ message: "Joined batch" });
};