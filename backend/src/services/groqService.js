const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/**
 * Generate movie/series review content using Groq AI
 * with natural Vietnamese writing style (Southern dialect friendly)
 */
const generateReviewContent = async ({ title, type, description, releaseYear, genres, rating, country }) => {
  try {
    const contentType = type === 'MOVIE' ? 'phim' : 'phim bộ';
    const genreText = genres && genres.length > 0 ? genres.join(', ') : 'chưa rõ thể loại';
    
    const prompt = `Bạn là một reviewer phim chuyên nghiệp người Việt Nam, viết review theo phong cách tự nhiên, thân thiện, dễ thương như người miền Tây.

Hãy viết một bài review chi tiết cho ${contentType} sau:
- Tên: ${title}
- Năm: ${releaseYear || 'chưa rõ'}
- Thể loại: ${genreText}
- Quốc gia: ${country || 'chưa rõ'}
- Rating: ${rating || 'chưa có'}/10
- Mô tả: ${description || 'Chưa có mô tả'}

YÊU CẦU QUAN TRỌNG:
1. Viết bằng tiếng Việt tự nhiên, giọng văn thân thiện, dễ thương như người miền Tây nói chuyện
2. Dùng từ ngữ đời thường, không quá văn chương hay học thuật
3. Có thể dùng một số từ địa phương miền Tây nhẹ nhàng để tạo sự gần gũi
4. Chia thành các đoạn rõ ràng với tiêu đề phụ
5. Độ dài: 500-800 từ
6. Format HTML đơn giản với thẻ <h2>, <h3>, <p>, <strong>, <em>, <ul>, <li>
7. Phải có xuống dòng đàng hoàng giữa các đoạn

CẤU TRÚC BÀI VIẾT:
<h2>🎬 Giới thiệu</h2>
<p>[Mở đầu hấp dẫn, giới thiệu tổng quan về phim]</p>

<h2>📖 Cốt truyện</h2>
<p>[Tóm tắt cốt truyện không spoil, nêu điểm hay]</p>

<h2>🎭 Diễn xuất và nhân vật</h2>
<p>[Đánh giá diễn xuất, nhân vật nổi bật]</p>

<h2>🎨 Kỹ thuật và hình ảnh</h2>
<p>[Đánh giá về hình ảnh, âm thanh, kỹ xảo]</p>

<h2>💭 Cảm nhận cá nhân</h2>
<p>[Chia sẻ cảm nhận, thông điệp phim]</p>

<h2>⭐ Đánh giá tổng quan</h2>
<p>[Kết luận, có nên xem không, điểm mạnh/yếu]</p>

PHONG CÁCH VIẾT MẪU:
- "Phim này hay lắm nha mọi người ơi!"
- "Mình xem xong mà còn nghĩ mãi luôn á"
- "Diễn xuất thì không có gì phải bàn, xuất sắc hết nấc!"
- "Coi mà cảm động quá trời quá đất"
- "Nói chung là phim này đáng xem lắm đó nha"

Hãy viết ngay bây giờ:`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Bạn là một reviewer phim chuyên nghiệp người Việt Nam, viết review theo phong cách tự nhiên, thân thiện, dễ thương như người miền Tây. Luôn viết bằng tiếng Việt với giọng văn gần gũi, dễ hiểu.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      temperature: 0.8,
      max_tokens: 2000,
      top_p: 0.9
    });

    const reviewContent = completion.choices[0]?.message?.content || '';
    
    // Clean up the content
    let cleanedContent = reviewContent.trim();
    
    // Ensure proper HTML formatting
    if (!cleanedContent.includes('<h2>')) {
      // If AI didn't use HTML tags, convert to HTML
      cleanedContent = cleanedContent
        .split('\n\n')
        .map(para => {
          if (para.startsWith('#')) {
            const level = para.match(/^#+/)[0].length;
            const text = para.replace(/^#+\s*/, '');
            return `<h${level}>${text}</h${level}>`;
          }
          return `<p>${para}</p>`;
        })
        .join('\n');
    }
    
    return {
      success: true,
      content: cleanedContent,
      wordCount: cleanedContent.replace(/<[^>]*>/g, '').split(/\s+/).length
    };
    
  } catch (error) {
    console.error('Groq AI Error:', error);
    return {
      success: false,
      error: error.message,
      content: null
    };
  }
};

module.exports = {
  generateReviewContent
};
