const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

const elasticClient = new Client({
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
});

const ELASTICSEARCH_INDEX = process.env.ELASTICSEARCH_INDEX || 'products';

module.exports = { elasticClient, ELASTICSEARCH_INDEX };
