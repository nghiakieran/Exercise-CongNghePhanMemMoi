const { elasticClient, ELASTICSEARCH_INDEX } = require('../config/elasticsearch');
const Product = require('../models/Product');

class SearchService {
  async createIndex() {
    try {
      const indexExists = await elasticClient.indices.exists({
        index: ELASTICSEARCH_INDEX,
      });

      if (indexExists) {
        console.log(`✓ Index ${ELASTICSEARCH_INDEX} already exists`);
        return;
      }

      await elasticClient.indices.create({
        index: ELASTICSEARCH_INDEX,
        body: {
          mappings: {
            properties: {
              id: { type: 'integer' },
              name: { type: 'text' },
              description: { type: 'text' },
              price: { type: 'float' },
              stock: { type: 'integer' },
              imageUrl: { type: 'keyword' },
              categoryId: { type: 'integer' },
              views: { type: 'integer' },
              discount: { type: 'integer' },
              createdAt: { type: 'date' },
              updatedAt: { type: 'date' },
            },
          },
        },
      });

      console.log(`✓ Index ${ELASTICSEARCH_INDEX} created successfully`);
    } catch (error) {
      console.error('✗ Error creating index:', error.message);
      throw error;
    }
  }

  async indexProduct(product) {
    try {
      await elasticClient.index({
        index: ELASTICSEARCH_INDEX,
        id: product.id.toString(),
        document: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: parseFloat(product.price),
          stock: product.stock,
          imageUrl: product.imageUrl,
          categoryId: product.categoryId,
          views: product.views || 0,
          discount: product.discount || 0,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        },
      });
    } catch (error) {
      console.error('Error indexing product:', error.message);
    }
  }

  async syncProducts() {
    try {
      const products = await Product.findAll();
      if (products.length === 0) {
        console.log('No products to sync');
        return;
      }

      const operations = products.flatMap((doc) => [
        { index: { _index: ELASTICSEARCH_INDEX, _id: doc.id.toString() } },
        {
          id: doc.id,
          name: doc.name,
          description: doc.description,
          price: parseFloat(doc.price),
          stock: doc.stock,
          imageUrl: doc.imageUrl,
          categoryId: doc.categoryId,
          views: doc.views || 0,
          discount: doc.discount || 0,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        },
      ]);

      const bulkResponse = await elasticClient.bulk({ operations });

      if (bulkResponse.errors) {
        const erroredDocuments = [];
        bulkResponse.items.forEach((action, i) => {
          const operation = Object.keys(action)[0];
          if (action[operation].error) {
            erroredDocuments.push({
              status: action[operation].status,
              error: action[operation].error,
              operation: operations[i * 2],
              document: operations[i * 2 + 1],
            });
          }
        });
        console.error('Bulk index errors', erroredDocuments);
      } else {
        console.log(`✓ Synced ${products.length} products to Elasticsearch`);
      }
    } catch (error) {
      console.error('Error syncing products:', error.message);
      throw error;
    }
  }

  async search(params) {
    const { keyword, categoryId, minPrice, maxPrice, minViews, hasDiscount, sort, limit, offset } = params;
    const must = [];
    const filter = [];

    if (keyword) {
      must.push({
        multi_match: {
          query: keyword,
          fields: ['name', 'description'],
        },
      });
    } else {
      must.push({ match_all: {} });
    }

    if (categoryId) {
      filter.push({ term: { categoryId: parseInt(categoryId) } });
    }

    if (minPrice || maxPrice) {
      const range = {};
      if (minPrice) range.gte = parseFloat(minPrice);
      if (maxPrice) range.lte = parseFloat(maxPrice);
      filter.push({ range: { price: range } });
    }

    if (hasDiscount === 'true' || hasDiscount === true) {
      filter.push({ range: { discount: { gt: 0 } } });
    }

    if (minViews) {
      filter.push({ range: { views: { gte: parseInt(minViews) } } });
    }

    const sortOptions = [];
    if (sort === 'price_asc') sortOptions.push({ price: 'asc' });
    else if (sort === 'price_desc') sortOptions.push({ price: 'desc' });
    else if (sort === 'views_desc') sortOptions.push({ views: 'desc' });
    else if (sort === 'newest') sortOptions.push({ createdAt: 'desc' });
    else sortOptions.push({ createdAt: 'desc' }); // Default sort

    try {
      const result = await elasticClient.search({
        index: ELASTICSEARCH_INDEX,
        query: {
          bool: {
            must,
            filter,
          },
        },
        sort: sortOptions,
        size: limit || 10000,
        from: offset || 0,
      });

      return result.hits.hits.map((hit) => hit._source);
    } catch (error) {
      console.error('Error searching products:', error.message);
      return [];
    }
  }

  async count(params) {
    const { keyword, categoryId, minPrice, maxPrice, minViews, hasDiscount } = params;
    const must = [];
    const filter = [];

    if (keyword) {
      must.push({
        multi_match: {
          query: keyword,
          fields: ['name', 'description'],
        },
      });
    } else {
      must.push({ match_all: {} });
    }

    if (categoryId) {
      filter.push({ term: { categoryId: parseInt(categoryId) } });
    }

    if (minPrice || maxPrice) {
      const range = {};
      if (minPrice) range.gte = parseFloat(minPrice);
      if (maxPrice) range.lte = parseFloat(maxPrice);
      filter.push({ range: { price: range } });
    }

    if (hasDiscount === 'true' || hasDiscount === true) {
      filter.push({ range: { discount: { gt: 0 } } });
    }

    if (minViews) {
      filter.push({ range: { views: { gte: parseInt(minViews) } } });
    }

    try {
      const result = await elasticClient.count({
        index: ELASTICSEARCH_INDEX,
        query: {
          bool: {
            must,
            filter,
          },
        },
      });

      return result.count;
    } catch (error) {
      console.error('Error counting products:', error.message);
      return 0;
    }
  }
}

module.exports = new SearchService();
