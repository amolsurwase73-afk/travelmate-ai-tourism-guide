import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialize Gemini client
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not set.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Travel Guide Generation Endpoint
app.post('/api/generate-travel-guide', async (req, res) => {
  try {
    const {
      destination,
      durationDays = 3,
      travelersCount = 1,
      budgetLevel = 'Moderate',
      currency = 'USD',
      travelStyle = 'Family',
      interests = ['History', 'Food', 'Nature'],
    } = req.body;

    if (!destination || typeof destination !== 'string') {
      return res.status(400).json({ error: 'Destination is required' });
    }

    const ai = getGenAIClient();

    const systemInstruction = `You are a world-class travel expert and AI Tourism Guide.
Generate an extensive, accurate, realistic, and highly structured travel guide for ${destination}.
You must generate:
1. Destination Overview (tagline, brief description, best time to visit, estimated travel time from major hubs, currency symbol).
2. Day-wise detailed itinerary for ${durationDays} days tailored to ${travelersCount} traveler(s) with ${budgetLevel} budget and ${travelStyle} style, highlighting interests in ${interests.join(', ')}.
3. Local Attractions: exactly 15 top attractions categorized into top_attraction, hidden_gem, historical, adventure, family_friendly, and free. Include opening hours, suggested duration, entry fees in ${currency}, highlights, and insider tips.
4. Food Recommendations: famous local dishes (Veg/Non-Veg), top restaurants (budget, fine dining, street food), street food spots with hygiene tips, vegetarian/vegan options, and must-try desserts.
5. Budget Breakdown: realistic cost estimate in ${currency} (currency symbol) for hotel, food, local transport, entry tickets, shopping, emergency reserve, and grand total sum with money-saving tips.
6. Travel Tips: safety precautions, local customs/etiquette, weather advice, scams to avoid, public transport advice.
7. Emergency Information: local emergency numbers (police, ambulance, tourist helpline), assistance contacts, nearby top hospitals.
8. Packing Checklist: categorized list of essential items.
9. FAQs: 5 common questions and comprehensive helpful answers for travelers visiting ${destination}.

Return strictly valid JSON matching the requested structure.`;

    const prompt = `Create a complete tourism guide for destination: "${destination}".
Trip Details:
- Days: ${durationDays}
- Travelers: ${travelersCount}
- Budget Level: ${budgetLevel}
- Currency: ${currency}
- Style: ${travelStyle}
- Interests: ${interests.join(', ')}`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        overview: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            tagline: { type: Type.STRING },
            description: { type: Type.STRING },
            bestTimeToVisit: { type: Type.STRING },
            estimatedTravelTime: { type: Type.STRING },
            currencySymbol: { type: Type.STRING },
            recommendedDuration: { type: Type.STRING },
          },
          required: ['name', 'tagline', 'description', 'bestTimeToVisit', 'estimatedTravelTime', 'currencySymbol', 'recommendedDuration'],
        },
        itinerary: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              dayNumber: { type: Type.INTEGER },
              title: { type: Type.STRING },
              morning: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  location: { type: Type.STRING },
                  time: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  estimatedCost: { type: Type.STRING },
                  tip: { type: Type.STRING },
                },
                required: ['title', 'description', 'location', 'time', 'duration', 'estimatedCost', 'tip'],
              },
              afternoon: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  location: { type: Type.STRING },
                  time: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  estimatedCost: { type: Type.STRING },
                  tip: { type: Type.STRING },
                },
                required: ['title', 'description', 'location', 'time', 'duration', 'estimatedCost', 'tip'],
              },
              evening: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  location: { type: Type.STRING },
                  time: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  estimatedCost: { type: Type.STRING },
                  tip: { type: Type.STRING },
                },
                required: ['title', 'description', 'location', 'time', 'duration', 'estimatedCost', 'tip'],
              },
              night: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  location: { type: Type.STRING },
                  time: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  estimatedCost: { type: Type.STRING },
                  tip: { type: Type.STRING },
                },
                required: ['title', 'description', 'location', 'time', 'duration', 'estimatedCost', 'tip'],
              },
            },
            required: ['dayNumber', 'title', 'morning', 'afternoon', 'evening'],
          },
        },
        attractions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              category: { type: Type.STRING },
              description: { type: Type.STRING },
              openingHours: { type: Type.STRING },
              suggestedDuration: { type: Type.STRING },
              entryFee: { type: Type.STRING },
              highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
              insiderTip: { type: Type.STRING },
            },
            required: ['id', 'name', 'category', 'description', 'openingHours', 'suggestedDuration', 'entryFee', 'highlights', 'insiderTip'],
          },
        },
        foodGuide: {
          type: Type.OBJECT,
          properties: {
            famousDishes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  vegOrNonVeg: { type: Type.STRING },
                  priceRange: { type: Type.STRING },
                  whereToTry: { type: Type.STRING },
                },
                required: ['name', 'description', 'vegOrNonVeg', 'priceRange', 'whereToTry'],
              },
            },
            topRestaurants: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  cuisine: { type: Type.STRING },
                  type: { type: Type.STRING },
                  address: { type: Type.STRING },
                  priceRange: { type: Type.STRING },
                  signatureDish: { type: Type.STRING },
                },
                required: ['name', 'cuisine', 'type', 'address', 'priceRange', 'signatureDish'],
              },
            },
            streetFoodSpots: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  spotName: { type: Type.STRING },
                  famousFor: { type: Type.STRING },
                  budgetLevel: { type: Type.STRING },
                  hygieneTip: { type: Type.STRING },
                },
                required: ['spotName', 'famousFor', 'budgetLevel', 'hygieneTip'],
              },
            },
            vegetarianOptions: { type: Type.ARRAY, items: { type: Type.STRING } },
            desserts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['name', 'description'],
              },
            },
          },
          required: ['famousDishes', 'topRestaurants', 'streetFoodSpots', 'vegetarianOptions', 'desserts'],
        },
        budgetBreakdown: {
          type: Type.OBJECT,
          properties: {
            currency: { type: Type.STRING },
            currencySymbol: { type: Type.STRING },
            hotelCost: {
              type: Type.OBJECT,
              properties: { estimatedTotal: { type: Type.NUMBER }, details: { type: Type.STRING } },
              required: ['estimatedTotal', 'details'],
            },
            foodExpenses: {
              type: Type.OBJECT,
              properties: { estimatedTotal: { type: Type.NUMBER }, details: { type: Type.STRING } },
              required: ['estimatedTotal', 'details'],
            },
            localTransport: {
              type: Type.OBJECT,
              properties: { estimatedTotal: { type: Type.NUMBER }, details: { type: Type.STRING } },
              required: ['estimatedTotal', 'details'],
            },
            entryTickets: {
              type: Type.OBJECT,
              properties: { estimatedTotal: { type: Type.NUMBER }, details: { type: Type.STRING } },
              required: ['estimatedTotal', 'details'],
            },
            shoppingBudget: {
              type: Type.OBJECT,
              properties: { estimatedTotal: { type: Type.NUMBER }, details: { type: Type.STRING } },
              required: ['estimatedTotal', 'details'],
            },
            emergencyBudget: {
              type: Type.OBJECT,
              properties: { estimatedTotal: { type: Type.NUMBER }, details: { type: Type.STRING } },
              required: ['estimatedTotal', 'details'],
            },
            grandTotalCost: {
              type: Type.OBJECT,
              properties: { estimatedTotal: { type: Type.NUMBER }, details: { type: Type.STRING } },
              required: ['estimatedTotal', 'details'],
            },
            costSavingTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['currency', 'currencySymbol', 'hotelCost', 'foodExpenses', 'localTransport', 'entryTickets', 'shoppingBudget', 'emergencyBudget', 'grandTotalCost', 'costSavingTips'],
        },
        travelTips: {
          type: Type.OBJECT,
          properties: {
            safetyTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            localCustoms: { type: Type.ARRAY, items: { type: Type.STRING } },
            weatherAdvice: { type: Type.STRING },
            commonScamsToAvoid: { type: Type.ARRAY, items: { type: Type.STRING } },
            publicTransportTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['safetyTips', 'localCustoms', 'weatherAdvice', 'commonScamsToAvoid', 'publicTransportTips'],
        },
        emergencyInfo: {
          type: Type.OBJECT,
          properties: {
            policeNumber: { type: Type.STRING },
            ambulanceNumber: { type: Type.STRING },
            touristHelpline: { type: Type.STRING },
            embassyOrLocalAssistance: { type: Type.STRING },
            nearbyHospitals: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['policeNumber', 'ambulanceNumber', 'touristHelpline', 'embassyOrLocalAssistance', 'nearbyHospitals'],
        },
        packingChecklist: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              items: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['category', 'items'],
          },
        },
        faqs: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              answer: { type: Type.STRING },
            },
            required: ['question', 'answer'],
          },
        },
      },
      required: [
        'overview',
        'itinerary',
        'attractions',
        'foodGuide',
        'budgetBreakdown',
        'travelTips',
        'emergencyInfo',
        'packingChecklist',
        'faqs',
      ],
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: schema as any,
        temperature: 0.7,
      },
    });

    const text = response.text || '';
    const parsedData = JSON.parse(text);

    res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error generating travel guide:', error);
    res.status(500).json({
      error: 'Failed to generate travel guide.',
      details: error?.message || 'Unknown error',
    });
  }
});

// Chat Endpoint for Travel Assistant
app.post('/api/chat', async (req, res) => {
  try {
    const { messages = [], destinationContext = '' } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const ai = getGenAIClient();

    const systemInstruction = `You are the Tourism Guide AI Assistant — a helpful, cheerful, knowledgeable travel expert.
${destinationContext ? `The user is currently planning or inquiring about a trip to "${destinationContext}". Use this context when relevant.` : ''}
Provide direct, concise, practical, and enthusiastic travel advice. Give specific place names, local dishes, budget tips, or itineraries as requested. Keep responses well-formatted with markdown lists, bold titles, and emojis.`;

    const chat = ai.chats.create({
      model: 'gemini-3.6-flash',
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    // Feed message history
    for (let i = 0; i < messages.length - 1; i++) {
      const msg = messages[i];
      await chat.sendMessage({ message: msg.text });
    }

    const lastUserMsg = messages[messages.length - 1].text;
    const response = await chat.sendMessage({ message: lastUserMsg });

    res.json({
      success: true,
      reply: response.text,
    });
  } catch (error: any) {
    console.error('Error in travel assistant chat:', error);
    res.status(500).json({
      error: 'Failed to process chat message',
      details: error?.message || 'Unknown error',
    });
  }
});

// Mount Vite middleware for development or serve static assets for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tourism Guide AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
