import { Router, Request, Response } from 'express';
import { prisma } from '../services/database';

const router = Router();

// Create item
router.post('/', async (req: Request, res: Response) => {
  try {
    const { householdId, roomId, categoryId, name, description, quantity, notes, attributes } = req.body;

    const item = await prisma.item.create({
      data: {
        householdId,
        roomId,
        categoryId,
        name,
        description,
        quantity: quantity || 1,
        notes,
        attributes: attributes || null,
      },
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create item' });
  }
});

// Get items by household or room
router.get('/', async (req: Request, res: Response) => {
  try {
    const { householdId, roomId } = req.query;

    const items = await prisma.item.findMany({
      where: {
        householdId: householdId ? String(householdId) : undefined,
        roomId: roomId ? String(roomId) : undefined,
        archivedAt: null,
      },
      include: {
        tags: true,
        media: true,
      },
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Get item by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.item.findUnique({
      where: { id: req.params.id },
      include: {
        tags: true,
        media: true,
        transactions: true,
        locationHistory: true,
      },
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Update item
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { name, description, quantity, notes, attributes, categoryId } = req.body;

    const item = await prisma.item.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        quantity,
        notes,
        attributes,
        categoryId,
      },
    });

    res.json(item);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update item' });
  }
});

// Archive item (soft delete)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.item.update({
      where: { id: req.params.id },
      data: {
        archivedAt: new Date(),
      },
    });

    res.json(item);
  } catch (error) {
    res.status(400).json({ error: 'Failed to archive item' });
  }
});

// Add inventory transaction
router.post('/:id/transactions', async (req: Request, res: Response) => {
  try {
    const { change, reason, createdBy } = req.body;

    const transaction = await prisma.inventoryTransaction.create({
      data: {
        itemId: req.params.id,
        change,
        reason,
        createdBy,
      },
    });

    // Update item quantity
    const item = await prisma.item.findUnique({ where: { id: req.params.id } });
    if (item) {
      await prisma.item.update({
        where: { id: req.params.id },
        data: {
          quantity: item.quantity + change,
        },
      });
    }

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create transaction' });
  }
});

export default router;
