require('dotenv').config();
const { generateReviewContent } = require('./src/services/groqService');

// Test data
const testMovie = {
  title: 'Inception',
  type: 'MOVIE',
  description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
  releaseYear: 2010,
  genres: ['Hành động', 'Khoa học viễn tưởng', 'Gây cấn'],
  rating: 8.8,
  country: 'my'
};

console.log('🤖 Testing Groq AI Review Generation...\n');
console.log('📋 Test Data:', JSON.stringify(testMovie, null, 2));
console.log('\n⏳ Generating review...\n');

generateReviewContent(testMovie)
  .then(result => {
    if (result.success) {
      console.log('✅ SUCCESS!\n');
      console.log('📊 Word Count:', result.wordCount);
      console.log('\n📝 Generated Content:\n');
      console.log('='.repeat(80));
      console.log(result.content);
      console.log('='.repeat(80));
      console.log('\n🎉 Test completed successfully!');
    } else {
      console.error('❌ FAILED!');
      console.error('Error:', result.error);
    }
  })
  .catch(error => {
    console.error('❌ ERROR:', error.message);
  });
