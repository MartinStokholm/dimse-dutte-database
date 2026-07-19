import { Router, Request, Response } from 'express';
import { prisma } from '../services/database';

const router = Router();

// Create category
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, parentCategoryId } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        description,
        parentCategoryId,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create category' });
  }
});

// Get all categories
router.get('/', async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        children: true,
        parent: true,
      },
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get category by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: req.params.id },
      include: {
        items: true,
        children: true,
        parent: true,
      },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// Update category
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { name, description, parentCategoryId } = req.body;

    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        parentCategoryId,
      },
    });

    res.json(category);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update category' });
  }
});

// Delete category
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.category.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete category' });
  }
});

export default router;
