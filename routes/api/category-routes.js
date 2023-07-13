const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  Category.findAll({
    include: Product
  }).then(categories => {
    res.send(categories)
  })
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  const categoryId = req.params.id;

  Category.findByPk(categoryId, {
    include: Product
  })
    .then(category => {
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.send(category);
    })
    .catch(error => {
      console.error('Error retrieving category:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

router.post('/', async (req, res) => {
  // create a new category
  const {category_name} = req.body
  const newCategory = await Category.create({category_name})
  res.send(newCategory)
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  const categoryId = req.params.id
  const {category_name} = req.body
  const updatedCategory = await Category.update({category_name},{
    where: {
      id: categoryId
    }
  })
  res.send(updatedCategory)
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  const categoryId = req.params.id
  try {
    const deletedCategoryCount = await Category.destroy({
      where: {
        id: categoryId,
      },
    });

    if (deletedCategoryCount === 0) {
      // No category was found with the given ID
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
