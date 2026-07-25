import { Request, Response } from 'express';
import { itemService } from '../services/index';

export const createItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { householdId, roomId, categoryId, name, description, quantity, notes, attributes } =
      req.body;

    if (!householdId || !roomId || !name) {
      res.status(400).json({ error: 'householdId, roomId, and name are required' });
      return;
    }

    const item = await itemService.create({
      householdId,
      roomId,
      categoryId,
      name,
      description,
      quantity,
      notes,
      attributes,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item' });
  }
};

export const getItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { householdId, roomId } = req.query;

    const items = await itemService.findAll({
      householdId: householdId ? String(householdId) : undefined,
      roomId: roomId ? String(roomId) : undefined,
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};

export const getItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await itemService.findById(req.params.id);

    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
};

export const updateItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, quantity, notes, attributes, categoryId } = req.body;

    const item = await itemService.update(req.params.id, {
      name,
      description,
      quantity,
      notes,
      attributes,
      categoryId,
    });

    res.json(item);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update item' });
  }
};

export const archiveItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await itemService.archive(req.params.id);
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: 'Failed to archive item' });
  }
};

export const addItemTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { change, reason, createdBy } = req.body;

    if (typeof change !== 'number' || !reason || !createdBy) {
      res.status(400).json({ error: 'change, reason, and createdBy are required' });
      return;
    }

    const transaction = await itemService.addTransaction({
      itemId: req.params.id,
      change,
      reason,
      createdBy,
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};
