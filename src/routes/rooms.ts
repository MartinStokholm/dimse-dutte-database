import { Router, Request, Response } from 'express';
import { prisma } from '../services/database';

const router = Router();

// Create room
router.post('/', async (req: Request, res: Response) => {
  try {
    const { householdId, name, description } = req.body;

    const room = await prisma.room.create({
      data: {
        householdId,
        name,
        description,
      },
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create room' });
  }
});

// Get rooms by household
router.get('/', async (req: Request, res: Response) => {
  try {
    const { householdId } = req.query;

    const rooms = await prisma.room.findMany({
      where: householdId ? { householdId: String(householdId) } : undefined,
      include: { items: true },
    });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Get room by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const room = await prisma.room.findUnique({
      where: { id: req.params.id },
      include: {
        items: true,
        media: true,
      },
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

// Update room
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const room = await prisma.room.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
      },
    });

    res.json(room);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update room' });
  }
});

// Delete room
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.room.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete room' });
  }
});

export default router;
