import axios from 'axios';
import Ajv from 'ajv';
import { config } from '../config';

const ajv = new Ajv({ allErrors: true });

// Country code to currency mapping (ISO 3166-1 alpha-2 to currency)
const countryCurrencyMap: Record<string, { currency: string; symbol: string }> = {
  // Europe
  'AT': { currency: 'EUR', symbol: '€' },
  'BE': { currency: 'EUR', symbol: '€' },
  'BG': { currency: 'BGN', symbol: 'лв' },
  'HR': { currency: 'EUR', symbol: '€' },
  'CY': { currency: 'EUR', symbol: '€' },
  'CZ': { currency: 'CZK', symbol: 'Kč' },
  'DK': { currency: 'DKK', symbol: 'kr' },
  'EE': { currency: 'EUR', symbol: '€' },
  'FI': { currency: 'EUR', symbol: '€' },
  'FR': { currency: 'EUR', symbol: '€' },
  'DE': { currency: 'EUR', symbol: '€' },
  'GR': { currency: 'EUR', symbol: '€' },
  'HU': { currency: 'HUF', symbol: 'Ft' },
  'IE': { currency: 'EUR', symbol: '€' },
  'IT': { currency: 'EUR', symbol: '€' },
  'LV': { currency: 'EUR', symbol: '€' },
  'LT': { currency: 'EUR', symbol: '€' },
  'LU': { currency: 'EUR', symbol: '€' },
  'MT': { currency: 'EUR', symbol: '€' },
  'NL': { currency: 'EUR', symbol: '€' },
  'PL': { currency: 'PLN', symbol: 'zł' },
  'PT': { currency: 'EUR', symbol: '€' },
  'RO': { currency: 'RON', symbol: 'lei' },
  'SK': { currency: 'EUR', symbol: '€' },
  'SI': { currency: 'EUR', symbol: '€' },
  'ES': { currency: 'EUR', symbol: '€' },
  'SE': { currency: 'SEK', symbol: 'kr' },
  'GB': { currency: 'GBP', symbol: '£' },
  'UK': { currency: 'GBP', symbol: '£' },
  'CH': { currency: 'CHF', symbol: 'CHF' },
  'NO': { currency: 'NOK', symbol: 'kr' },
  'IS': { currency: 'ISK', symbol: 'kr' },
  'RU': { currency: 'RUB', symbol: '₽' },
  'UA': { currency: 'UAH', symbol: '₴' },
  'TR': { currency: 'TRY', symbol: '₺' },
  
  // Asia
  'JP': { currency: 'JPY', symbol: '¥' },
  'CN': { currency: 'CNY', symbol: '¥' },
  'KR': { currency: 'KRW', symbol: '₩' },
  'HK': { currency: 'HKD', symbol: 'HK$' },
  'TW': { currency: 'TWD', symbol: 'NT$' },
  'SG': { currency: 'SGD', symbol: 'S$' },
  'MY': { currency: 'MYR', symbol: 'RM' },
  'TH': { currency: 'THB', symbol: '฿' },
  'VN': { currency: 'VND', symbol: '₫' },
  'ID': { currency: 'IDR', symbol: 'Rp' },
  'PH': { currency: 'PHP', symbol: '₱' },
  'IN': { currency: 'INR', symbol: '₹' },
  'PK': { currency: 'PKR', symbol: '₨' },
  'BD': { currency: 'BDT', symbol: '৳' },
  'LK': { currency: 'LKR', symbol: 'Rs' },
  'NP': { currency: 'NPR', symbol: '₨' },
  'AE': { currency: 'AED', symbol: 'د.إ' },
  'SA': { currency: 'SAR', symbol: '﷼' },
  'QA': { currency: 'QAR', symbol: '﷼' },
  'KW': { currency: 'KWD', symbol: 'د.ك' },
  'BH': { currency: 'BHD', symbol: 'BD' },
  'OM': { currency: 'OMR', symbol: '﷼' },
  'IL': { currency: 'ILS', symbol: '₪' },
  'JO': { currency: 'JOD', symbol: 'JD' },
  'LB': { currency: 'LBP', symbol: 'ل.ل' },
  'KH': { currency: 'KHR', symbol: '៛' },
  'MM': { currency: 'MMK', symbol: 'K' },
  'LA': { currency: 'LAK', symbol: '₭' },
  
  // Americas
  'US': { currency: 'USD', symbol: '$' },
  'CA': { currency: 'CAD', symbol: 'C$' },
  'MX': { currency: 'MXN', symbol: 'MX$' },
  'BR': { currency: 'BRL', symbol: 'R$' },
  'AR': { currency: 'ARS', symbol: 'AR$' },
  'CL': { currency: 'CLP', symbol: 'CLP$' },
  'CO': { currency: 'COP', symbol: 'COL$' },
  'PE': { currency: 'PEN', symbol: 'S/' },
  'VE': { currency: 'VES', symbol: 'Bs' },
  'EC': { currency: 'USD', symbol: '$' },
  'UY': { currency: 'UYU', symbol: '$U' },
  'PY': { currency: 'PYG', symbol: '₲' },
  'BO': { currency: 'BOB', symbol: 'Bs' },
  'CR': { currency: 'CRC', symbol: '₡' },
  'PA': { currency: 'USD', symbol: '$' },
  'GT': { currency: 'GTQ', symbol: 'Q' },
  'CU': { currency: 'CUP', symbol: '₱' },
  'DO': { currency: 'DOP', symbol: 'RD$' },
  'JM': { currency: 'JMD', symbol: 'J$' },
  'PR': { currency: 'USD', symbol: '$' },
  
  // Oceania
  'AU': { currency: 'AUD', symbol: 'A$' },
  'NZ': { currency: 'NZD', symbol: 'NZ$' },
  'FJ': { currency: 'FJD', symbol: 'FJ$' },
  'PG': { currency: 'PGK', symbol: 'K' },
  
  // Africa
  'ZA': { currency: 'ZAR', symbol: 'R' },
  'EG': { currency: 'EGP', symbol: 'E£' },
  'MA': { currency: 'MAD', symbol: 'د.م.' },
  'TN': { currency: 'TND', symbol: 'د.ت' },
  'KE': { currency: 'KES', symbol: 'KSh' },
  'NG': { currency: 'NGN', symbol: '₦' },
  'GH': { currency: 'GHS', symbol: 'GH₵' },
  'TZ': { currency: 'TZS', symbol: 'TSh' },
  'ET': { currency: 'ETB', symbol: 'Br' },
  'UG': { currency: 'UGX', symbol: 'USh' },
  'RW': { currency: 'RWF', symbol: 'FRw' },
  'MU': { currency: 'MUR', symbol: '₨' },
  'SC': { currency: 'SCR', symbol: '₨' },
};

// Fetch country from city using Nominatim (OpenStreetMap) geocoding API
async function getCountryFromCity(city: string): Promise<{ countryCode: string; country: string } | null> {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: city,
        format: 'json',
        addressdetails: 1,
        limit: 1,
      },
      headers: {
        'User-Agent': 'PrimeTravel/1.0', // Required by Nominatim
      },
      timeout: 5000,
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      const countryCode = result.address?.country_code?.toUpperCase();
      const country = result.address?.country;
      
      if (countryCode) {
        return { countryCode, country: country || countryCode };
      }
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// Get currency info for a city (dynamically fetches country)
async function getCurrencyForCity(city: string): Promise<{ currency: string; symbol: string; country: string }> {
  // Try to get country from geocoding
  const locationInfo = await getCountryFromCity(city);
  
  if (locationInfo && countryCurrencyMap[locationInfo.countryCode]) {
    const currencyInfo = countryCurrencyMap[locationInfo.countryCode];
    return {
      ...currencyInfo,
      country: locationInfo.country,
    };
  }
  
  // Default to USD if country not found
  return { currency: 'USD', symbol: '$', country: 'Unknown' };
}

// Strict JSON schema for AI response validation
const aiResponseSchema = {
  type: 'object',
  properties: {
    tripSummary: { type: 'string' },
    totalEstimatedCost: { type: 'string' },
    currency: { type: 'string' },
    currencySymbol: { type: 'string' },
    travelTips: { type: 'array', items: { type: 'string' } },
    itinerary: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          day: { type: 'integer', minimum: 1 },
          date: { type: 'string' },
          dailyCost: { type: 'string' },
          places: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                time: { type: 'string' },
                duration: { type: 'string' },
                travelMode: { type: 'string' },
                cost: { type: 'string' },
                description: { type: 'string' },
              },
              required: ['name', 'time', 'duration', 'travelMode', 'cost'],
            },
          },
        },
        required: ['day', 'places', 'dailyCost'],
      },
    },
  },
  required: ['tripSummary', 'totalEstimatedCost', 'itinerary'],
};

const validateAIResponse = ajv.compile(aiResponseSchema);

// System prompt for AI
const SYSTEM_PROMPT = `You are an expert travel planner AI. Generate realistic, practical day-by-day travel itineraries.

RULES:
- Output ONLY valid JSON, no extra text or markdown
- Respect the user's budget level (Low = budget-friendly, Medium = moderate comfort, High = luxury)
- Consider the travel month for weather-appropriate activities
- Tailor activities to the group type (Solo = adventure/exploration, Couple = romantic, Family = kid-friendly)
- Focus on the specified interests
- Avoid excessive travel in one day (max 3-4 major activities per day)
- Include realistic time slots, travel modes, and cost estimates
- Use the LOCAL CURRENCY of the destination for ALL cost estimates
- Provide practical travel tips for the destination

OUTPUT FORMAT (STRICT JSON):
{
  "tripSummary": "Brief overview of the trip",
  "totalEstimatedCost": "XXX - XXX [LOCAL_CURRENCY_SYMBOL]",
  "currency": "CURRENCY_CODE",
  "currencySymbol": "CURRENCY_SYMBOL",
  "travelTips": ["tip1", "tip2", "tip3"],
  "itinerary": [
    {
      "day": 1,
      "date": "Day 1",
      "dailyCost": "XXX - XXX [LOCAL_CURRENCY_SYMBOL]",
      "places": [
        {
          "name": "Place Name",
          "time": "09:00 AM",
          "duration": "2 hours",
          "travelMode": "Walking/Taxi/Metro",
          "cost": "XXX [LOCAL_CURRENCY_SYMBOL]",
          "description": "Brief description"
        }
      ]
    }
  ]
}`;

// User prompt builder
async function buildUserPrompt(params: {
  tripDays: number;
  month: string;
  landingCity: string;
  budget: string;
  groupType: string;
  interests: string[];
}): Promise<{ prompt: string; currencyInfo: { currency: string; symbol: string; country: string } }> {
  const currencyInfo = await getCurrencyForCity(params.landingCity);
  
  const prompt = `Generate a ${params.tripDays}-day travel itinerary for ${params.landingCity}.

TRAVELER DETAILS:
- Travel month: ${params.month}
- Budget: ${params.budget}
- Group type: ${params.groupType}
- Interests: ${params.interests.join(', ')}

DESTINATION COUNTRY: ${currencyInfo.country}
LOCAL CURRENCY: ${currencyInfo.currency} (${currencyInfo.symbol})
IMPORTANT: Use ${currencyInfo.symbol} (${currencyInfo.currency}) for ALL cost estimates. This is the official local currency of ${currencyInfo.country}.

Requirements:
- Create a day-by-day plan with specific places, times, and costs in ${currencyInfo.currency}
- Consider ${params.month} weather and seasonal events
- Match activities to ${params.groupType} travelers
- Focus on: ${params.interests.join(', ')}
- Keep the ${params.budget} budget in mind for all recommendations
- Include realistic travel times between locations
- ALL prices must be in local currency: ${currencyInfo.symbol} (${currencyInfo.currency})
- Include "currency": "${currencyInfo.currency}" and "currencySymbol": "${currencyInfo.symbol}" in your response
- Output STRICT JSON only, no markdown or extra text`;

  return { prompt, currencyInfo };
}

export interface AITripRequest {
  tripDays: number;
  month: string;
  landingCity: string;
  budget: string;
  groupType: string;
  interests: string[];
}

export async function generateTripWithAI(req: AITripRequest, maxRetries = 2): Promise<any> {
  let lastError: any;
  
  // Fetch currency info dynamically based on the city
  const { prompt: userPrompt, currencyInfo } = await buildUserPrompt(req);
  console.log(`Generating trip for ${req.landingCity} - Currency: ${currencyInfo.currency} (${currencyInfo.symbol}) - Country: ${currencyInfo.country}`);

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 3000,
          response_format: { type: 'json_object' },
        },
        {
          headers: {
            Authorization: `Bearer ${config.groqApiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000,
        }
      );

      const content = response.data.choices[0].message.content.trim();
      let data;

      // Parse JSON
      try {
        data = JSON.parse(content);
      } catch (e) {
        throw new Error('AI response is not valid JSON');
      }

      // Validate against schema
      if (!validateAIResponse(data)) {
        throw new Error('AI response does not match expected schema: ' + ajv.errorsText(validateAIResponse.errors));
      }

      // Ensure currency info is always included (fallback if AI didn't include it)
      if (!data.currency) {
        data.currency = currencyInfo.currency;
      }
      if (!data.currencySymbol) {
        data.currencySymbol = currencyInfo.symbol;
      }
      // Add country info
      data.country = currencyInfo.country;

      return data;
    } catch (err: any) {
      lastError = err;
      console.error(`AI generation attempt ${attempt + 1} failed:`, err.message);
      
      // If rate limited (429), wait before retrying
      if (err.response?.status === 429 && attempt < maxRetries) {
        const waitTime = (attempt + 1) * 5000; // 5s, 10s, 15s...
        console.log(`Rate limited. Waiting ${waitTime / 1000}s before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      if (attempt === maxRetries) throw err;
    }
  }

  throw lastError;
}
