import { Router } from 'express';
import {
  createHousehold,
  getHouseholds,
  getHouseholdById,
  updateHousehold,
  deleteHousehold,
} from '../controllers/householdController';

const router = Router();

/**
 * @swagger
 * /api/households:
 *   post:
 *     tags: [Households]
 *     summary: Create a new household
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
 *                 example: My Household
 *               description:
 *                 type: string
 *                 example: Family home
 *     responses:
 *       201:
 *         description: Household created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Household'
 *       400:
 *         description: Invalid input
 */
router.post('/', createHousehold);

/**
 * @swagger
 * /api/households:
 *   get:
 *     tags: [Households]
 *     summary: Get all households
 *     responses:
 *       200:
 *         description: List of households
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Household'
 */
router.get('/', getHouseholds);

/**
 * @swagger
 * /api/households/{id}:
 *   get:
 *     tags: [Households]
 *     summary: Get household by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Household details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Household'
 *       404:
 *         description: Household not found
 */
router.get('/:id', getHouseholdById);

/**
 * @swagger
 * /api/households/{id}:
 *   patch:
 *     tags: [Households]
 *     summary: Update household
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
 *     responses:
 *       200:
 *         description: Household updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Household'
 */
router.patch('/:id', updateHousehold);

/**
 * @swagger
 * /api/households/{id}:
 *   delete:
 *     tags: [Households]
 *     summary: Delete household
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Household deleted
 */
router.delete('/:id', deleteHousehold);

export default router;
