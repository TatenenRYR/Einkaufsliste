/**
 * WICHTIG: Ersetze 'DEIN_API_KEY' mit deinem
 * echten Google AI Studio (Gemini) API Key.
 */
const GEMINI_API_KEY = "AIzaSyAqpZeKexgzO-8uo4rJx8g6NAE4boFBbp8"; // <--- HIER DEINEN KEY EINFÜGEN

/**
 * Ruft die Gemini API auf.
 * @param {string} prompt Der Text-Prompt für die KI.
 * @returns {Promise<string>} Die Text-Antwort von der KI.
 */
async function callGeminiApi(prompt) {
  
  if (GEMINI_API_KEY === "DEIN_API_KEY") {
      console.error("Gemini API Key fehlt.");
      throw new Error("API-Key nicht in gemini-api.js eingetragen.");
  }
  
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

  const requestBody = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    // Sicherheitseinstellungen niedrig ansetzen, um JSON-Antworten nicht zu blockieren
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
    ],
    generationConfig: {
      temperature: 0.1, // Kreativität niedrig halten für präzise JSON-Antworten
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    }
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("API-Fehler (Antwort):", errorBody);
      throw new Error(`API-Fehler: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.promptFeedback && data.promptFeedback.blockReason) {
      console.error("API-Anfrage blockiert:", data.promptFeedback.blockReason);
      throw new Error(`Anfrage blockiert: ${data.promptFeedback.blockReason}`);
    }

    if (!data.candidates || !data.candidates[0].content.parts[0].text) {
        console.error("Unerwartete API-Antwortstruktur:", data);
        throw new Error("Konnte keine gültige Antwort von der KI extrahieren.");
    }
    
    // Bereinige die Antwort (oft in Markdown-Code-Blöcken)
    let textResponse = data.candidates[0].content.parts[0].text;
    textResponse = textResponse.replace(/^```json\s*/, '').replace(/```$/, '');
    
    return textResponse.trim();

  } catch (error) {
    console.error("Fehler beim Aufrufen der Gemini API:", error);
    throw error;
  }
}
