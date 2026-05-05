import { Response } from "express";
import { pool } from "../utils/db";
import { AuthRequest } from "../types/express";

export const batchSummary = async (req: AuthRequest, res: Response) => {
  const result = await pool.query(
    `SELECT s.id as session_id, COUNT(a.id) as total
     FROM sessions s
     LEFT JOIN attendance a ON s.id = a.session_id
     WHERE s.batch_id = $1
     GROUP BY s.id`,
    [req.params.id]
  );

  res.json(result.rows);
};

export const programmeSummary = async (
  req: AuthRequest,
  res: Response
) => {
  const result = await pool.query(
    `SELECT COUNT(*) as total_sessions FROM sessions`
  );

  res.json(result.rows[0]);
};