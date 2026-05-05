import { Response } from "express";
import { pool } from "../utils/db";
import { AuthRequest } from "../types/express";

export const markAttendance = async (req: AuthRequest, res: Response) => {
  const { sessionId, status } = req.body;

  const result = await pool.query(
    `INSERT INTO attendance (session_id, student_id, status)
     VALUES ($1,$2,$3) RETURNING *`,
    [sessionId, req.user!.id, status],
  );

  res.json(result.rows[0]);
};
