# BT06 - E-commerce với Elasticsearch

## ✨ Tính năng
- ✅ **Elasticsearch** - Tìm kiếm và filter nhanh
- ✅ **Filter nâng cao** - Category, Price, Discount, Views, Sort
- ✅ **Docker Compose** - ES + MySQL containerized
- ✅ **JWT Authentication** - Secure API
- ✅ **Admin Dashboard** - Quản lý sản phẩm

## 🚀 Khởi động

### 1. Start Docker Services
```bash
docker-compose up -d
```

### 2. Backend Setup
```bash
cd auth-app-be
npm install
cp .env.example .env
# Edit .env if needed
npm run seed  # Tạo ES index + sync data
npm run dev
```

### 3. Frontend Setup
```bash
cd auth-app-fe
npm install
npm run dev
```

## 🔍 Elasticsearch Integration

### Backend Changes Made
1. ✅ Installed `@elastic/elasticsearch@^8.13.0`
2. ✅ Created `src/config/elasticsearch.js`
3. ✅ Created `src/services/searchService.js`
4. ✅ Updated `Product` model (added `views`, `discount`)
5. ✅ Updated `productController.js` to use ES
6. ✅ Updated `seed.js` to sync ES

### API Endpoints

**Get Products with Filters:**
```
GET /api/products?search=phone&categoryId=1&minPrice=1000000&maxPrice=5000000&hasDiscount=true&minViews=100&sort=price_asc
```

**Query Parameters:**
- `search` - Tìm kiếm text (name, description)
- `categoryId` - Lọc theo danh mục
- `minPrice`, `maxPrice` - Khoảng giá
- `hasDiscount` - true/false - Chỉ sản phẩm giảm giá
- `minViews` - Lượt xem tối thiểu
- `sort` - Sắp xếp:
  - `price_asc` - Giá tăng dần
  - `price_desc` - Giá giảm dần
  - `views_desc` - Xem nhiều nhất
  - `newest` - Mới nhất

## 📊 Database Schema

### Products Table
```sql
- id (INT, PK, AUTO_INCREMENT)
- name (VARCHAR)
- description (TEXT)
- price (DECIMAL)
- stock (INT)
- imageUrl (VARCHAR)
- views (INT) ← NEW
- discount (INT) ← NEW
- categoryId (INT, FK)
- createdAt (DATETIME)
- updatedAt (DATETIME)
```

## 🧪 Testing

### Test Elasticsearch
```bash
# Check ES is running
curl http://localhost:9200

# Check products index
curl http://localhost:9200/products/_search
```

### Test API
```bash
# Get all products
curl http://localhost:5000/api/products

# Search with filters
curl "http://localhost:5000/api/products?search=phone&hasDiscount=true&sort=price_asc"

# Filter by category
curl "http://localhost:5000/api/products?categoryId=1"

# Price range
curl "http://localhost:5000/api/products?minPrice=1000000&maxPrice=10000000"
```

## 📝 Test Credentials
- **Admin:** admin@example.com / Admin@123
- **User:** user@example.com / User@123

## 🔧 Environment Variables

Create `.env` file in `auth-app-be`:
```env
# Database
DB_HOST=localhost
DB_PORT=3307
DB_NAME=bt05_db
DB_USER=user
DB_PASSWORD=password

# Elasticsearch
ELASTICSEARCH_NODE=http://localhost:9200
ELASTICSEARCH_INDEX=products

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development
```

## 🎯 Next Steps (Frontend)

Để hoàn thiện project, bạn cần:

1. **Update Product Type** - Thêm `views` và `discount`
2. **Create ProductFilters Component** - Sidebar filters
3. **Create ProductList Component** - Grid với Shopee-style
4. **Create ProductsPage** - Layout chính
5. **Update HomePage** - Search integration

Tham khảo code mẫu tại: `d:\SPKT\CNPMM\BTVN_CNPM\BT06\bt06_fe`

## 📚 Documentation
- Elasticsearch JS Client: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html
- Sequelize: https://sequelize.org/docs/v6/
docker run ^
  -p 9200:9200 ^
  -e "discovery.type=single-node" ^
  -e "xpack.security.enabled=false" ^
  docker.elastic.co/elasticsearch/elasticsearch:8.14.0
---
**Version:** 1.0  
**Date:** 2025-11-29
