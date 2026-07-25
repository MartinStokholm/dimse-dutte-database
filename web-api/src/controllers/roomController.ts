import { Request, Response } from 'express';
import { roomService } from '../services/index';

export const createRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { householdId, name, description } = req.body;

    if (!householdId || !name) {
      res.status(400).json({ error: 'householdId and name are required' });
      return;
    }

    const room = await roomService.create({ householdId, name, description });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create room' });
  }
};

export const getRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const { householdId } = req.query;
    const rooms = await roomService.findAll(householdId ? String(householdId) : undefined);
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};

export const getRoomById = async (req: Request, res: Response): Promise<void> => {
  try {
    const room = await roomService.findById(req.params.id);

    if (!room) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch room' });
  }
};

export const updateRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;

    const room = await roomService.update(req.params.id, { name, description });
    res.json(room);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update room' });
  }
};

export const deleteRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    await roomService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete room' });
  }
};
