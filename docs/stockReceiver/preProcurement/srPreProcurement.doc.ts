//Get
/**
 * @swagger
 * /api/pms/sr/pre-procurement:
 *   get:
 *     summary: Get SR pre procurement list
 *     description: Retrieve a list of categories with pagination details.
 *     tags:
 *       - Stock Receiver / Pre Procurement
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The category ID.
 *                         example: cd69968c-b3f7-422c-8309-2bbc33523f18
 *                       name:
 *                         type: string
 *                         description: name of the category.
 *                         example: Technology
 *                       createdAt:
 *                         type: date
 *                         description: The time of creation.
 *                         example: 2024-06-07T17:29:33.801Z
 *                       updatedAt:
 *                         type: date
 *                         description: The time of update.
 *                         example: 2024-06-07T17:29:33.801Z
 */
