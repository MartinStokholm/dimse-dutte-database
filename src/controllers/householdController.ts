import { Request, Response } from 'express';
import { householdService } from '../services/index';

export const createHousehold = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const household = await householdService.create({ name, description });
    res.status(201).json(household);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create household' });
  }
};

export const getHouseholds = async (_req: Request, res: Response): Promise<void> => {
  try {
    const households = await householdService.findAll();
    res.json(households);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch households' });
  }
};

export const getHouseholdById = async (req: Request, res: Response): Promise<void> => {
  try {
    const household = await householdService.findById(req.params.id);

    if (!household) {
      res.status(404).json({ error: 'Household not found' });
      return;
    }

    res.json(household);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch household' });
  }
};

export const updateHousehold = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;

    const household = await householdService.update(req.params.id, { name, description });
    res.json(household);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update household' });
  }
};

export const deleteHousehold = async (req: Request, res: Response): Promise<void> => {
  try {
    await householdService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete household' });
  }
};
