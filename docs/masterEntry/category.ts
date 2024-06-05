
//Get category
/**
 * @swagger
 * /api/pms/master/category:
 *   get:
 *     summary: Get category list
 *     description: Retrieve a list of categories.
 *     tags:
 *       - Category
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
 *                       createdAt:
 *                         type: date
 *                         description: The time of creation.
 *                         example: Technology
 *                       updatedAt:
 *                         type: date
 *                         description: The time of update.
 *                         example: Technology
 *                       
*/


/**
 * @swagger
 * /api/pms/master/category:
 *   post:
 *     summary: Create category.
 *     tags:
 *       - Category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The category name.
 *                 example: Technology
 *     responses:
 *       201:
 *         description: Category created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
*/