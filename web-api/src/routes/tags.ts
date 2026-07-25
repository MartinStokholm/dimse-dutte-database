import { Router } from 'express';
import {
  createTag,
  getTags,
  getTagById,
  updateTag,
  deleteTag,
} from '../controllers/tagController';

const router = Router();

/**
 * @swagger
 * /api/tags:
 *   post:
 *     tags: [Tags]
 *     summary: Create a new tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: USB-C
 *     responses:
 *       201:
 *         description: Tag created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 */
router.post('/', createTag);

/**
 * @swagger
 * /api/tags:
 *   get:
 *     tags: [Tags]
 *     summary: Get all tags
 *     responses:
 *       200:
 *         description: List of tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 */
router.get('/', getTags);

/**
 * @swagger
 * /api/tags/{id}:
 *   get:
 *     tags: [Tags]
 *     summary: Get tag by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Tag details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 */
router.get('/:id', getTagById);

/**
 * @swagger
 * /api/tags/{id}:
 *   patch:
 *     tags: [Tags]
 *     summary: Update tag
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tag updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 */
router.patch('/:id', updateTag);

/**
 * @swagger
 * /api/tags/{id}:
 *   delete:
 *     tags: [Tags]
 *     summary: Delete tag
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Tag deleted
 */
router.delete('/:id', deleteTag);

export default router;
