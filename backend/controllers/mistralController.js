const { MistralClient } = require('@mistralai/mistralai');
const sharp = require('sharp');

const client = new MistralClient({
  apiKey: process.env.MISTRAL_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

async function extractTextFromImage(imageBuffer) {
  try {
    const metadata = await sharp(imageBuffer).metadata();
    return `Image analysis: Format ${metadata.format}, Dimensions ${metadata.width}x${metadata.height}`;
  } catch (error) {
    console.error('Image processing error:', error);
    throw new Error('Failed to process image');
  }
}

exports.analyzeImage = async (req, res) => {
  try {
    const { imageBase64, prompt } = req.body;
    if (!imageBase64 || !prompt) {
      return res.status(400).json({ 
        success: false,
        message: "Image and prompt are required" 
      });
    }

    const buffer = Buffer.from(imageBase64.split(',')[1], 'base64');
    const imageDescription = await extractTextFromImage(buffer);

    const chatResponse = await client.chat({
      model: 'mistral-large-latest',
      messages: [{
        role: 'user',
        content: `Image context: ${imageDescription}. User question: ${prompt}`
      }]
    });

    res.status(200).json({
      success: true,
      analysis: chatResponse.choices[0].message.content
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      message: "Analysis failed",
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};
