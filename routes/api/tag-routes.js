const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  Tag.findAll({
    include: Product
  }).then(tags => {
    res.send(tags)
  })
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  const tagId = req.params.id;

  Tag.findByPk(tagId, {
    include: Product
  })
    .then(tag => {
      if (!tag) {
        return res.status(404).json({ error: 'tag not found' });
      }

      res.send(tag);
    })
    .catch(error => {
      console.error('Error retrieving tag:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

router.post('/', async (req, res) => {
  // create a new tag
  const {tag_name} = req.body
  const newTag = await Tag.create({tag_name})
  res.send(newTag)
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  const tagId = req.params.id
  const {tag_name} = req.body
  const updatedTag = await Tag.update({tag_name},{
    where: {
      id: tagId
    }
  })
  res.send(updatedTag)
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  const tagId = req.params.id
  try {
    const deletedTagCount = await Tag.destroy({
      where: {
        id: tagId,
      },
    });

    if (deletedTagCount === 0) {
      // No tag was found with the given ID
      return res.status(404).json({ error: 'tag not found' });
    }

    res.json({ message: 'tag deleted successfully' });
  } catch (error) {
    console.error('Error deleting tag:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
