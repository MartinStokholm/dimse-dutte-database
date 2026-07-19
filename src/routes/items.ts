import { Router } from 'express';
import {
  createItem,
  getItems,
  getItemById,
  updateItem,
  archiveItem,
  addItemTransaction,
} from '../controllers/itemController';

const router = Router();

/**
 * @swagger
 * /api/items:
 *   post:
 *     tags: [Items]
 *     summary: Create a new item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [householdId, roomId, name]
 *             properties:
 *               householdId:
 *                 type: string
 *                 format: uuid
 *               roomId:
 *                 type: string
 *                 format: uuid
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *                 example: Blender
 *               description:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 default: 1
 *               notes:
 *                 type: string
 *               attributes:
 *                 type: object
 *     responses:
 *       201:
 *         description: Item created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 */
router.post('/', createItem);

/**
 * @swagger
 * /api/items:
 *   get:
 *     tags: [Items]
 *     summary: Get all items
 *     parameters:
 *       - in: query
 *         name: householdId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: roomId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
router.get('/', getItems);

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     tags: [Items]
 *     summary: Get item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Item details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 */
router.get('/:id', getItemById);

/**
 * @swagger
 * /api/items/{id}:
 *   patch:
 *     tags: [Items]
 *     summary: Update item
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               categoryId:
 *                 type: string
 *               notes:
 *                 type: string
 *               attributes:
 *                 type: object
 *     responses:
 *       200:
 *         description: Item updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 */
router.patch('/:id', updateItem);

/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     tags: [Items]
 *     summary: Archive item (soft delete)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Item archived
 */
router.delete('/:id', archiveItem);

/**
 * @swagger
 * /api/items/{id}/transactions:
 *   post:
 *     tags: [Items]
 *     summary: Add inventory transaction
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
 *             required: [change, reason, createdBy]
 *             properties:
 *               change:
 *                 type: integer
 *                 example: 5
 *                 description: Positive or negative quantity change
 *               reason:
 *                 type: string
 *                 example: Purchased
 *               createdBy:
 *                 type: string
 *                 example: john@example.com
 *     responses:
 *       201:
 *         description: Transaction created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryTransaction'
 */
router.post('/:id/transactions', addItemTransaction);

export default router;
