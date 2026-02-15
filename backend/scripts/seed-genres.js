require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const slugify = require('slugify');

const prisma = new PrismaClient();

const genres = [
  { name: 'Hành động', type: 'MOVIE' },
  { name: 'Phiêu lưu', type: 'MOVIE' },
  { name: 'Hoạt hình', type: 'MOVIE' },
  { name: 'Hài', type: 'MOVIE' },
  { name: 'Tội phạm', type: 'MOVIE' },
  { name: 'Tài liệu', type: 'MOVIE' },
  { name: 'Chính kịch', type: 'MOVIE' },
  { name: 'Gia đình', type: 'MOVIE' },
  { name: 'Giả tưởng', type: 'MOVIE' },
  { name: 'Kinh dị', type: 'MOVIE' },
  { name: 'Bí ẩn', type: 'MOVIE' },
  { name: 'Lãng mạn', type: 'MOVIE' },
  { name: 'Khoa học viễn tưởng', type: 'MOVIE' },
  { name: 'Gây cấn', type: 'MOVIE' },
  { name: 'Chiến tranh', type: 'MOVIE' },
  { name: 'Tiên hiệp', type: 'SERIES' },
  { name: 'Huyền huyễn', type: 'SERIES' },
  { name: 'Đô thị', type: 'SERIES' },
  { name: 'Lịch sử', type: 'SERIES' },
  { name: 'Võng du', type: 'SERIES' },
  { name: 'Khoa huyễn', type: 'SERIES' },
  { name: 'Đam mỹ', type: 'SERIES' },
  { name: 'Ngôn tình', type: 'SERIES' }
];

async function seedGenres() {
  try {
    console.log('Đang thêm thể loại...\n');

    for (const genre of genres) {
      const slug = slugify(genre.name, { lower: true, strict: true });
      
      await prisma.genre.upsert({
        where: { slug },
        update: { name: genre.name, forType: genre.type },
        create: { 
          name: genre.name, 
          slug,
          forType: genre.type
        }
      });

      console.log(`✓ ${genre.name} (${genre.type === 'MOVIE' ? 'Phim' : 'Truyện'})`);
    }

    console.log('\nHoàn thành!');
  } catch (error) {
    console.error('Lỗi:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

seedGenres();
