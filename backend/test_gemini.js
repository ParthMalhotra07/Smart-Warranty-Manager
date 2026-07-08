const { GoogleGenerativeAI } = require('@google/generative-ai');

async function run() {
  try {
    const genAI = new GoogleGenerativeAI('AQ.Ab8RN6KAJbz3HtjoAS-UAfL_Hs8RhwkPJQD13XfVZTmosZy8WA');
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=AQ.Ab8RN6KAJbz3HtjoAS-UAfL_Hs8RhwkPJQD13XfVZTmosZy8WA');
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

run();
