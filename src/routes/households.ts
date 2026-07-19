import { Router, Request, Response } from 'express';
import { prisma } from '../services/database';

const router = Router();

// Create household
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const household = await prisma.household.create({
      data: {
        name,
        description,
      },
    });

    res.status(201).json(household);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create household' });
  }
});

// Get all households
router.get('/', async (_req: Request, res: Response) => {
  try {
    const households = await prisma.household.findMany();
    res.json(households);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch households' });
  }
});

// Get household by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const household = await prisma.household.findUnique({
      where: { id: req.params.id },
      include: {
        users: true,
        rooms: true,
        items: true,
      },
    });

    if (!household) {
      return res.status(404).json({ error: 'Household not found' });
    }

    res.json(household);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch household' });
  }
});

// Update household
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const household = await prisma.household.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
      },
    });

    res.json(household);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update household' });
  }
});

// Delete household
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.household.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete household' });
  }
});

export default router;
