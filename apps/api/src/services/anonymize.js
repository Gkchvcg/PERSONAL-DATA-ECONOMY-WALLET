// AI Privacy Layer: turn raw data into privacy-preserving insights (hackathon: rule-based; production: ML/NER + aggregation)
const CATEGORY_RULES = {
  HEALTH: (p) => ({
    ageRange: p.age ? `${Math.floor(p.age / 10) * 10}-${Math.floor(p.age / 10) * 10 + 9}` : "unknown",
    conditionCategory: p.condition ? "chronic_condition" : "general",
    region: p.region || "anonymous",
    noPII: true,
  }),
  SHOPPING: (p) => ({
    category: p.category || "retail",
    frequency: p.frequency || "monthly",
    spendRange: p.amount ? (p.amount < 50 ? "low" : p.amount < 200 ? "mid" : "high") : "unknown",
    noPII: true,
  }),
  FITNESS: (p) => ({
    activityLevel: p.activityLevel || "moderate",
    goal: p.goal || "wellness",
    weeklyFrequency: p.weeklySessions ? `${p.weeklySessions}x/week` : "unknown",
    noPII: true,
  }),
  LOCATION: (p) => ({
    pattern: p.pattern || "urban",
    frequency: p.frequency || "regular",
    region: p.region ? "region_anonymous" : "anonymous",
    noPII: true,
  }),
  SOCIAL: (p) => ({
    engagementLevel: p.engagement || "medium",
    topics: Array.isArray(p.topics) ? p.topics : [],
    noPII: true,
  }),
};

function runRule(category, obj) {
  const fn = CATEGORY_RULES[category.toUpperCase()] || (() => ({ ...obj, noPII: true }));
  return fn(obj);
}

export function anonymize(category, payload) {
  const p = typeof payload === "string" ? JSON.parse(payload) : payload;
  if (Array.isArray(p)) {
    const sample = p[0] ? runRule(category, p[0]) : { noPII: true };
    return { rowCount: p.length, sample, noPII: true };
  }
  if (p && typeof p === "object" && Array.isArray(p.rows)) {
    const sample = p.rows[0] ? runRule(category, p.rows[0]) : { noPII: true };
    return { rowCount: p.rows.length, sample, noPII: true };
  }
  if (p && typeof p.text === "string") {
    return { noPII: true, length: p.text.length };
  }
  return runRule(category, p);
}
