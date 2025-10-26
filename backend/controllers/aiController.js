const axios = require("axios");

exports.analyzeImage = async (req, res) => {
  try {
    const { image, prompt } = req.body;

    if (!image || !prompt) {
      return res.status(400).json({
        error: "Image and prompt are required.",
        status: 400,
      });
    }

    // Extract Base64 raw content from Data URL
    const base64Data = image.split(",")[1]; // Remove "data:image/jpeg;base64,"
    const binaryImage = Buffer.from(base64Data, "base64");

    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${process.env.HF_MODEL}`, // e.g., "Qwen/Qwen2.5-VL-7B-Instruct"
      {
        inputs: {
          image: binaryImage.toString("base64"),
          question: prompt,
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        timeout: 30000,
      }
    );

    const data = response.data;

    // Support for multiple HF response formats
    const analysis =
      data?.generated_text ||
      data?.[0]?.generated_text ||
      data?.answer ||
      "No clear analysis returned from the model.";

    res.status(200).json({
      status: 200,
      analysis,
      prompt,
    });

  } catch (error) {
    console.error("❌ Error in analyzeImage:", error.response?.data || error.message);

    const errMsg = error.response?.data?.error || error.message || "Unknown error";

    res.status(500).json({
      error: `AI model failed to process the image. ${errMsg}`,
      status: 500,
    });
  }
};
