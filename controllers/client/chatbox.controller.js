const { GoogleGenAI } = require("@google/genai");
const Product = require("../../models/product.model");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Tự động thử lại khi Gemini quá tải
async function callGeminiWithRetry(prompt, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: `Bạn là trợ lý bán hàng siêu dễ thương của shop nhỏ.
            Trả lời bằng tiếng Việt, thân thiện, ngắn gọn.
            Chỉ dùng đúng thông tin sản phẩm để trả lời.
            Nếu không có thì nói lịch sự.`,
          maxOutputTokens: 1000, // số lượng ký tự tối đa AI trả về
          temperature: 0.8, // độ sáng tạo của ai
        },
      });
      return response.text?.trim() || "Dạ em đang bận chút xíu ạ!";
    } catch (error) {
      if (error.status === 503 || error.status === 429) {
        const wait = (i + 1) * 2000;
        console.log(
          `Gemini quá tải, thử lại lần ${i + 1}/${retries} sau ${
            wait / 1000
          }s...`
        );
        await new Promise((resolve) => setTimeout(resolve, wait));
      } else {
        throw error; 
      }
    }
  }
  return "Dạ chatbot đang rất đông khách, anh/chị thử lại sau 5 phút nhé!";
}

module.exports.index = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim() === "") {
      return res.json({ error: "Vui lòng nhập tin nhắn" });
    }

    // Lấy sản phẩm từ DB
    const products = await Product.find().limit(50);

    const productList = products // chuyển mảng sản phẩm thành text đẻ AI hiểu
      .map(
        (p) =>
          `• Tên: ${p.title || "Không rõ"}\n  Mô tả: ${
            p.description || p.stock || "Không có"
          }\n  Giá: ${
            p.price ? p.price.toLocaleString("vi-VN") + " VND" : "Liên hệ"
          }\n  Số lượng: ${p.stock || "0"}\n Hình ảnh: ${p.thumbnail || "Chưa có ảnh"}`
      )
      .join("\n\n");

    if (products.length === 0) {
      return res.json({ reply: "Dạ shop hiện chưa có sản phẩm nào ạ!" });
    }

    // Tạo prompt gửi lên AI
    const prompt = `Dữ liệu sản phẩm (tổng ${products.length} sản phẩm):\n\n${productList}\n\n---\nCâu hỏi khách: ${message}`;

    // GỌI GEMINI VỚI TỰ ĐỘNG THỬ LẠI
    const reply = await callGeminiWithRetry(prompt);

    res.json({ reply });
  } catch (error) {
    console.error("Lỗi nghiêm trọng:", error.message);
    res.json({
      reply: "Dạ hệ thống đang bận, anh/chị thử lại sau ít phút nhé!",
    });
  }
};
