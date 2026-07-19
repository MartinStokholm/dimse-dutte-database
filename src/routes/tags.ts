import { Router, Request, Response } from 'express';
import { prisma } from '../services/database';

const router = Router();

// Create tag
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const tag = await prisma.tag.create({
      data: {
        name,
      },
    });

    res.status(201).json(tag);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create tag' });
  }
});

// Get all tags
router.get('/', async (_req: Request, res: Response) => {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        items: true,
      },
    });

    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// Get tag by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const tag = await prisma.tag.findUnique({
      where: { id: req.params.id },
      include: {
        items: true,
      },
    });

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tag' });
  }
});

// Update tag
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const tag = await prisma.tag.update({
      where: { id: req.params.id },
      data: {
        name,
      },
    });

    res.json(tag);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update tag' });
  }
});

// Delete tag
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.tag.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete tag' });
  }
});

export default router;
