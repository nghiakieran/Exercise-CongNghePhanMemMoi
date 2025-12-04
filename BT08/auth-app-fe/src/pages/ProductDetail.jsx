import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productService } from "../services/productService";
import authService from "../services/authService";
import { message, Rate, Button, Input, Card, Spin } from "antd";

const { TextArea } = Input;

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);

  const currentUser = authService.getCurrentUser();

  const loadData = async () => {
    try {
      setLoading(true);
      const [productRes, commentsRes] = await Promise.all([
        productService.getProductById(id),
        productService.getComments(id),
      ]);
      const prod = productRes.data;
      setProduct(prod);

      // Cập nhật danh sách đã xem gần đây (FE + localStorage)
      if (prod) {
        const viewed = {
          id: prod.id,
          name: prod.name,
          price: prod.price,
          imageUrl: prod.imageUrl,
          category: prod.category
            ? { id: prod.category.id, name: prod.category.name }
            : null,
        };
        try {
          const stored = localStorage.getItem("recentlyViewedProducts");
          let list = [];
          if (stored) {
            try {
              list = JSON.parse(stored);
            } catch {
              list = [];
            }
          }
          const existing = list.filter((p) => p.id !== viewed.id);
          const updated = [viewed, ...existing].slice(0, 8);
          localStorage.setItem(
            "recentlyViewedProducts",
            JSON.stringify(updated)
          );
        } catch (e) {
          console.error(
            "[ProductDetail] Failed to update recentlyViewedProducts:",
            e
          );
        }
      }
      setComments(commentsRes.data || []);
    } catch (error) {
      console.error("Load product detail error:", error);
      message.error("Không tải được chi tiết sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleSubmitComment = async () => {
    if (!currentUser) {
      message.warning("Vui lòng đăng nhập để bình luận");
      return;
    }
    if (!content.trim()) {
      message.warning("Nội dung bình luận không được để trống");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      await productService.addComment(
        id,
        { content, rating: rating || null },
        token
      );
      setContent("");
      setRating(0);
      await loadData();
      message.success("Đã gửi bình luận");
    } catch (error) {
      console.error("Submit comment error:", error);
      message.error("Gửi bình luận thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <Spin />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Không tìm thấy sản phẩm
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: "24px auto", padding: "0 16px" }}>
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <div style={{ flex: "0 0 280px" }}>
            <img
              src={product.imageUrl || "https://via.placeholder.com/300"}
              alt={product.name}
              style={{ width: "100%", borderRadius: 12 }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ marginBottom: 12 }}>{product.name}</h1>
            {product.category && (
              <p style={{ marginBottom: 8, color: "#718096" }}>
                Danh mục: <strong>{product.category.name}</strong>
              </p>
            )}
            <p
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#e53e3e",
                marginBottom: 8,
              }}
            >
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(product.price)}
            </p>
            <p style={{ color: "#4a5568", marginBottom: 8 }}>
              {product.buyersCount || 0} người mua ·{" "}
              {product.commentsCount || 0} bình luận
            </p>
            <p style={{ marginTop: 16 }}>{product.description}</p>
          </div>
        </div>
      </Card>

      <Card title="Bình luận" bordered>
        {comments.length === 0 ? (
          <p>Chưa có bình luận nào cho sản phẩm này.</p>
        ) : (
          <div style={{ marginBottom: 24 }}>
            {comments.map((c) => (
              <div
                key={c.id}
                style={{
                  borderBottom: "1px solid #edf2f7",
                  padding: "8px 0",
                }}
              >
                <div style={{ fontWeight: 600 }}>
                  {c.user?.name || c.user?.email || "Người dùng"}
                </div>
                {c.rating && (
                  <Rate
                    disabled
                    defaultValue={c.rating}
                    style={{ fontSize: 14 }}
                  />
                )}
                <div>{c.content}</div>
              </div>
            ))}
          </div>
        )}

        <div>
          <h3>Viết bình luận</h3>
          <Rate value={rating} onChange={setRating} style={{ margin: "8px 0" }} />
          <TextArea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
          />
          <Button
            type="primary"
            onClick={handleSubmitComment}
            loading={submitting}
            style={{ marginTop: 8 }}
          >
            Gửi bình luận
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProductDetail;


