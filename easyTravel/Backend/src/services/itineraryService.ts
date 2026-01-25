import axios from 'axios';
import Ajv, { JSONSchemaType } from 'ajv';
import { config } from '../config';

// JSON schema for validation (as defined previously)
const itinerarySchema = {
  type: 'object',
  properties: {
    itinerary: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          day: { type: 'integer', minimum: 1 },
          date: { type: 'string', format: 'date' },
          activities: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                place: { type: 'string' },
                start_time: { type: 'string', pattern: '^\\d{2}:\\d{2}$' },
                end_time: { type: 'string', pattern: '^\\d{2}:\\d{2}$' },
                cost: { type: 'string' },
                travel_mode: { type: 'string' }
              },
              required: ['place', 'start_time', 'end_time', 'cost', 'travel_mode']
            }
          },
          total_day_cost: { type: 'string' }
        },
        required: ['day', 'date', 'activities', 'total_day_cost']
      }
    }
  },
  required: ['itinerary'],
  additionalProperties: false
} as const;

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(itinerarySchema);

// System and user prompt templates
const SYSTEM_PROMPT = `You are an expert travel planner AI. Generate a realistic, day-wise travel itinerary based on the user’s preferences and constraints. Ensure all recommendations are feasible, with logical time slots, travel modes, and costs. Output must be strictly valid JSON matching the provided schema—no extra text.`;

const USER_PROMPT = (
  trip_days: number,
  month: string,
  landing_city: string,
  budget: string,
  group_type: string,
  interests: string
) => `Generate a travel itinerary with the following details:\n- Number of trip days: ${trip_days}\n- Month of travel: ${month}\n- Landing city: ${landing_city}\n- Budget: ${budget} (Low/Medium/High)\n- Group type: ${group_type}\n- Interests: ${interests}\n\nRequirements:\n- Output only valid JSON (no extra text).\n- Structure the itinerary day-wise.\n- For each day, list places to visit, time slots, estimated cost, and travel mode between places.\n- Ensure the plan is realistic and feasible for the group and city.`;

export interface ItineraryRequest {
  trip_days: number;
  month: string;
  landing_city: string;
  budget: string;
  group_type: string;
  interests: string;
}

export async function generateItinerary(
  req: ItineraryRequest,
  maxRetries = 2
): Promise<any> {
  let lastError: any;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'mixtral-8x7b-32768',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: USER_PROMPT(
                req.trip_days,
                req.month,
                req.landing_city,
                req.budget,
                req.group_type,
                req.interests
              ) }
          ],
          temperature: 0.7,
          max_tokens: 1800
        },
        {
          headers: {
            'Authorization': `Bearer ${config.groqApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );
      // Try to parse and validate JSON
      const text = response.data.choices[0].message.content.trim();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error('OpenAI response is not valid JSON');
      }
      if (!validate(data)) {
        throw new Error('OpenAI response does not match schema: ' + ajv.errorsText(validate.errors));
      }
      return data;
    } catch (err) {
      lastError = err;
      if (attempt === maxRetries) throw err;
    }
  }
  throw lastError;
}
