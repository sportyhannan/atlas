import { GoogleGenerativeAI } from '@google/generative-ai';

export type ParsedQuery = {
  indication: string | null;
  phase: string[];
  geography: string[];
  risingStarsOnly: boolean;
  minVelocity: number | null;
  requiredDrugs: string[];
  keywords: string[];
  raw: string;
};

export async function parseSearchQuery(query: string): Promise<ParsedQuery> {
  if (!process.env.GEMINI_API_KEY) {
    return fallbackParse(query);
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: `You are parsing a clinical trial investigator search query for a pharma site selection platform.
Extract structured criteria. Return ONLY valid JSON, no markdown.

Query: "${query}"

Return this exact JSON shape:
{
  "indication": string or null,
  "phase": string[],
  "geography": string[],
  "risingStarsOnly": boolean,
  "minVelocity": number or null,
  "requiredDrugs": string[],
  "keywords": string[]
}

Examples:
- "Phase 3 R/R DLBCL rising stars globally" → indication:"R/R DLBCL", phase:["Phase 3"], geography:["global"], risingStarsOnly:true
- "NSCLC East Asia 15+ enrollments/yr Ordspono-eligible" → indication:"NSCLC", phase:[], geography:["East Asia"], minVelocity:15, requiredDrugs:["Ordspono"]`
        }]
      }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
    });

    const parsed = JSON.parse(result.response.text());
    return { ...parsed, raw: query };
  } catch (err) {
    console.warn('Gemini parse failed, using fallback:', err);
    return fallbackParse(query);
  }
}

function fallbackParse(query: string): ParsedQuery {
  const q = query.toLowerCase();
  return {
    indication: q.includes('dlbcl') ? 'R/R DLBCL'
      : q.includes('nsclc') || q.includes('lung') ? 'NSCLC'
      : q.includes('hemophilia') ? 'Hemophilia A/B'
      : q.includes('her2') || q.includes('breast') ? 'HER2+ breast cancer'
      : null,
    phase: q.includes('phase 3') ? ['Phase 3']
      : q.includes('phase 2') ? ['Phase 2']
      : q.includes('phase 1') ? ['Phase 1']
      : [],
    geography: q.includes('east asia') ? ['East Asia']
      : q.includes('global') ? ['global']
      : q.includes('africa') ? ['Africa']
      : q.includes('latin america') || q.includes('brazil') ? ['Latin America']
      : [],
    risingStarsOnly: q.includes('rising star'),
    minVelocity: (() => {
      const m = q.match(/(\d+)\+?\s*enroll/);
      return m ? parseInt(m[1]) : null;
    })(),
    requiredDrugs: q.includes('ordspono') || q.includes('odronextamab') ? ['Ordspono'] : [],
    keywords: [],
    raw: query,
  };
}
