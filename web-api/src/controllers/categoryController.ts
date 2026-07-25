import { Request, Response } from 'express';
import { categoryService } from '../services/index';

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, parentCategoryId } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const category = await categoryService.create({ name, description, parentCategoryId });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await categoryService.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await categoryService.findById(req.params.id);

    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, parentCategoryId } = req.body;

    const category = await categoryService.update(req.params.id, {
      name,
      description,
      parentCategoryId,
    });

    res.json(category);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update category' });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    await categoryService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete category' });
  }
};
