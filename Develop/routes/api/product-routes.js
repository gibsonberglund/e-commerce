const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    // find all library cards and perform a JOIN to include all associated Readers
    const ProductData = await Product.findAll();
    res.status(200).json(ProductData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id);

    if (!productData) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      // if (req.body.tagIds.length) {
      //   const productTagIdArr = req.body.tagIds.map((tag_id) => {
      //     return {
      //       product_id: product.id,
      //       tag_id,
      //     };
      //   });
      //   return ProductTag.bulkCreate(productTagIdArr);
      // }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // Calls the update method on the Book model
  Product.update(
    {
      // All the fields you can update and the data attached to the request body.
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
      category_id: req.body.category_id
    },
    {
      // Gets the books based on the isbn given in the request parameters
      where: {
        id: req.params.id,
      },
    }
  )
    .then((updatedProduct) => {
      // Sends the updated book as a json response
      res.json(updatedProduct);
    })
    .catch((err) => res.json(err));
});

router.delete('/:id', async (req, res) => {
  try {
    const ProductData = await Product.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!ProductData) {
      res.status(404).json({ message: 'No location found with this id!' });
      return;
    }

    res.status(200).json(ProductData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
