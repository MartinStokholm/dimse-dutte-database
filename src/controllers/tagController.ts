import { Request, Response } from 'express';
import { tagService } from '../services/index';

export const createTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const tag = await tagService.create({ name });
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create tag' });
  }
};

export const getTags = async (_req: Request, res: Response): Promise<void> => {
  try {
    const tags = await tagService.findAll();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
};

export const getTagById = async (req: Request, res: Response): Promise<void> => {
  try {
    const tag = await tagService.findById(req.params.id);

    if (!tag) {
      res.status(404).json({ error: 'Tag not found' });
      return;
    }

    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tag' });
  }
};

export const updateTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const tag = await tagService.update(req.params.id, { name });
    res.json(tag);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update tag' });
  }
};

export const deleteTag = async (req: Request, res: Response): Promise<void> => {
  try {
    await tagService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete tag' });
  }
};
