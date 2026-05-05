import { Response } from "express";
import { pool } from "../utils/db";
import { AuthRequest } from "../types/express";

export const createSession = async (req: AuthRequest, res: Response) => {
  const { batchId, title, date, startTime, endTime } = req.body;

  const result = await pool.query(
    `INSERT INTO sessions 
    (batch_id, trainer_id, title, date, start_time, end_time)
    VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [batchId, req.user!.id, title, date, startTime, endTime]
  );

  res.json(result.rows[0]);
};

export const getSessionAttendance = async (
  req: AuthRequest,
  res: Response
) => {
  const result = await pool.query(
    `SELECT * FROM attendance WHERE session_id = $1`,
    [req.params.id]
  );

  res.json(result.rows);
};