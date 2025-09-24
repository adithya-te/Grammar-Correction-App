/**
 * Test various sentences to verify universal grammar correction
 * Run with: node test-sentences.js
 */

require('dotenv').config();
const grammarService = require('./src/services/huggingFaceGrammarService');

const testSentences = [
  // Your specific example
  "im adithya current pursuing in btech",
  
  // Common grammar errors
  "I are going to the store",
  "He don't like pizza",  
  "She have three cats",
  "They was at the party",
  "Me and him are friends",
  "I seen that movie",
  "Could of been better",
  "Between you and I",
  "I have went there",
  
  // Spelling and word form errors
  "I recieve alot of emails",
  "Seperate the items definately",
  "He is writting a begining",
  "Tommorrow we will go their",
  
  // Article errors
  "I need a hour to finish",
  "She is an university student", 
  "He bought a apple",
  
  // Preposition errors
  "I am interested about history",
  "He is married with Sarah",
  "Let's discuss about the project",
  "I depend of my family",
  
  // Complex sentences
  "If I would have knew about the meeting, I would of came earlier",
  "She don't have no money left",
  "The book what I read was good",
  "I am more better than him",
  
  // Professional/Academic writing
  "The research shows that students performs better",
  "Data was collected from various source",
  "Results indicates significant improvement",
  
  // Casual writing
  "gonna meet u later",
  "cant wait 4 the party",
  "ur the best friend ever"
];

async function testAllSentences() {
  console.log('🧪 TESTING UNIVERSAL GRAMMAR CORRECTION\n');
  console.log('=' * 50);
  
  for (let i = 0; i < testSentences.length; i++) {
    const sentence = testSentences[i];
    
    console.log(`\n📝 TEST ${i + 1}: "${sentence}"`);
    
    try {
      const result = await grammarService.correctText(sentence);
      
      if (result.correctedText !== sentence) {
        console.log(`✅ CORRECTED: "${result.correctedText}"`);
        console.log(`🔧 Changes: ${result.corrections.length}`);
        
        result.corrections.forEach(correction => {
          console.log(`   • ${correction.original} → ${correction.correction} (${correction.category})`);
        });
        
        console.log(`📊 Confidence: ${result.analysis.confidenceScore}%`);
      } else {
        console.log(`ℹ️  NO CHANGES: Text is already correct`);
      }
      
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }
    
    console.log('-'.repeat(50));
  }
}

// Run the test
testAllSentences().catch(console.error);