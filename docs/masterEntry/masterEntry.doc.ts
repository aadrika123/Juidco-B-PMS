// category------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Create
/**
 * @swagger
 * /api/pms/master/category:
 *   post:
 *     summary: Create category.
 *     tags:
 *       - Mater Entry / Category
 *     security:
 *       - bearerAuth: []
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
 *                       status:
 *                         type: boolean
 *                         description: Operation status.
 *                         example: true
 *                       message:
 *                         type: string
 *                         description: response message.
 *                         example: Category created having id  8aef1142-607a-4d13-a598-df14238cce4e
 */

//Get
/**
 * @swagger
 * /api/pms/master/category:
 *   get:
 *     summary: Get category list
 *     description: Retrieve a list of categories.
 *     tags:
 *       - Mater Entry / Category
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

// category------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// sub-category------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Create
/**
 * @swagger
 * /api/pms/master/sub-category:
 *   post:
 *     summary: Create sub-category.
 *     tags:
 *       - Mater Entry / Sub-Category
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The sub-category name.
 *                 example: Laptop
 *               category_masterId:
 *                 type: string
 *                 description: The category ID.
 *                 example: "1ef878d1-3a0f-4986-bf6b-ce3fd5aa3c37"
 *     responses:
 *       201:
 *         description: Category created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                       status:
 *                         type: boolean
 *                         description: Operation status.
 *                         example: true
 *                       message:
 *                         type: string
 *                         description: response message.
 *                         example: Sub-Category created having id  ee0939b4-acc2-4abb-ad46-1e1f64da6d42
 */

//Get
/**
 * @swagger
 * /api/pms/master/sub-category:
 *   get:
 *     summary: Get sub-category list
 *     description: Retrieve a list of sub-categories.
 *     tags:
 *       - Mater Entry / Sub-Category
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of sub-categories.
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
 *                         description: The sub-category ID.
 *                         example: cd69968c-b3f7-422c-8309-2bbc33523f18
 *                       name:
 *                         type: string
 *                         description: name of the category.
 *                         example: Laptop
 *                       createdAt:
 *                         type: date
 *                         description: The time of creation.
 *                         example: 2024-06-07T17:29:33.801Z
 *                       updatedAt:
 *                         type: date
 *                         description: The time of update.
 *                         example: 2024-06-07T17:29:33.801Z
 */

//Get by category id
/**
 * @swagger
 * /api/pms/master/sub-category/by-category/{categoryId}:
 *   get:
 *     summary: Get sub-category list by category ID
 *     description: Retrieve a list of sub-categories according to category.
 *     tags:
 *       - Mater Entry / Sub-Category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID.
 *     responses:
 *       200:
 *         description: A list of sub-categories.
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
 *                         description: The sub-category ID.
 *                         example: cd69968c-b3f7-422c-8309-2bbc33523f18
 *                       name:
 *                         type: string
 *                         description: name of the sub-category.
 *                         example: Laptop
 *                       createdAt:
 *                         type: date
 *                         description: The time of creation.
 *                         example: 2024-06-07T17:29:33.801Z
 *                       updatedAt:
 *                         type: date
 *                         description: The time of update.
 *                         example: 2024-06-07T17:29:33.801Z
 */

// sub-category------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// brand------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Create
/**
 * @swagger
 * /api/pms/master/brand:
 *   post:
 *     summary: Create brand.
 *     tags:
 *       - Mater Entry / Brand
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The brand name.
 *                 example: Gigabyte
 *               subcategory:
 *                 type: string
 *                 description: The sub-category ID.
 *                 example: "1ef878d1-3a0f-4986-bf6b-ce3fd5aa3c37"
 *     responses:
 *       201:
 *         description: Brand created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                       status:
 *                         type: boolean
 *                         description: Operation status.
 *                         example: true
 *                       message:
 *                         type: string
 *                         description: response message.
 *                         example: Brand created having id  ee0939b4-acc2-4abb-ad46-1e1f64da6d42
 */

//Get
/**
 * @swagger
 * /api/pms/master/brand:
 *   get:
 *     summary: Get brand list
 *     description: Retrieve a list of brands.
 *     tags:
 *       - Mater Entry / Brand
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of brands.
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
 *                         description: The brand ID.
 *                         example: cd69968c-b3f7-422c-8309-2bbc33523f18
 *                       name:
 *                         type: string
 *                         description: name of the brand.
 *                         example: Gigabyte
 *                       createdAt:
 *                         type: date
 *                         description: The time of creation.
 *                         example: 2024-06-07T17:29:33.801Z
 *                       updatedAt:
 *                         type: date
 *                         description: The time of update.
 *                         example: 2024-06-07T17:29:33.801Z
 */

//Get by category id
/**
 * @swagger
 * /api/pms/master/by-subcategory/{subcategoryId}:
 *   get:
 *     summary: Get brand list by sub-category ID
 *     description: Retrieve a list of brands according to sub-category.
 *     tags:
 *       - Mater Entry / Brand
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subcategoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The sub-category ID.
 *     responses:
 *       200:
 *         description: A list of sub-categories.
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
 *                         description: The brand ID.
 *                         example: cd69968c-b3f7-422c-8309-2bbc33523f18
 *                       name:
 *                         type: string
 *                         description: name of the brand.
 *                         example: Laptop
 *                       createdAt:
 *                         type: date
 *                         description: The time of creation.
 *                         example: 2024-06-07T17:29:33.801Z
 *                       updatedAt:
 *                         type: date
 *                         description: The time of update.
 *                         example: 2024-06-07T17:29:33.801Z
 */

// brand------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
