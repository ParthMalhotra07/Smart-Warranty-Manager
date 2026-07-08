const ErrorResponse = require('../utils/errorResponse');
const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.extractInvoiceData = async (req, res, next) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return next(new ErrorResponse('Please provide an imageUrl', 400));
    }

    if (!process.env.GEMINI_API_KEY) {
      return next(new ErrorResponse('Gemini API key is not configured', 500));
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Fetch the image to convert it into base64 for Gemini
    const imageResp = await fetch(imageUrl);
    if (!imageResp.ok) {
      return next(new ErrorResponse('Failed to fetch image from URL', 400));
    }
    
    const arrayBuffer = await imageResp.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = imageResp.headers.get('content-type') || 'image/jpeg';

    const prompt = `
      You are an expert OCR and data extraction system.
      Analyze this invoice image and extract the following information.
      Return ONLY a pure JSON object without markdown formatting or code blocks:
      {
        "productName": "string or empty",
        "brand": "string or empty",
        "modelNumber": "string or empty",
        "purchaseDate": "YYYY-MM-DD string or empty (convert any date format to YYYY-MM-DD)",
        "invoiceNumber": "string or empty",
        "seller": "string or empty",
        "purchaseAmount": "number or empty (just the digits/decimals, remove currency symbols and commas)"
      }
    `;

    const imageParts = [
      {
        inlineData: {
          data: buffer.toString("base64"),
          mimeType
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    let responseText = result.response.text().trim();
    
    // Remove markdown formatting if present
    if (responseText.startsWith('```json')) {
      responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    } else if (responseText.startsWith('```')) {
      responseText = responseText.replace(/```/g, '').trim();
    }

    const parsedResult = JSON.parse(responseText);

    res.status(200).json({
      success: true,
      text: "Extracted directly via Gemini Vision API",
      extractedData: parsedResult
    });

  } catch (err) {
    console.error("OCR Vision Error:", err);
    next(new ErrorResponse('Failed to process image for OCR', 500));
  }
};
