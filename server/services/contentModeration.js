const DEFAULT_TIMEOUT_MS = 8000;

const localFindings = [
  [/discord\.gg\/|bit\.ly\/|tinyurl\.com/i, "suspect_link", 0.55],
  [/(\bgane\b.*\b(gratis|dinheiro)\b|\binvestimento garantido\b)/i, "possible_scam", 0.65],
];

export const analyzeContentLocally = (content = "") => {
  const text = String(content).trim();
  const findings = localFindings
    .filter(([pattern]) => pattern.test(text))
    .map(([, category, score]) => ({ category, score }));
  const normalizedWords = text.toLowerCase().split(/\s+/).filter(Boolean);
  const repeatedWord = normalizedWords.length >= 4 && normalizedWords.slice(-4).every((word) => word === normalizedWords.at(-4));
  if (text.length >= 20 && repeatedWord) findings.push({ category: "repetitive_content", score: 0.7 });

  return {
    status: findings.length ? "flagged" : "approved",
    provider: "local-rules",
    categories: findings,
    reviewedAt: new Date(),
  };
};

export const analyzeContent = async (content = "") => {
  const local = analyzeContentLocally(content);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !String(content).trim()) return local;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  try {
    const response = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ input: String(content).slice(0, 20000) }),
      signal: controller.signal,
    });
    if (!response.ok) return { ...local, provider: "local-rules", providerError: `HTTP ${response.status}` };
    const payload = await response.json();
    const result = payload.results?.[0];
    const categories = Object.entries(result?.categories || {})
      .filter(([, flagged]) => flagged)
      .map(([category]) => ({ category, score: result.category_scores?.[category] ?? 0 }));
    return {
      status: categories.length ? "flagged" : "approved",
      provider: "openai-moderation",
      categories,
      reviewedAt: new Date(),
    };
  } catch (error) {
    return { ...local, provider: "local-rules", providerError: error.name === "AbortError" ? "timeout" : "unavailable" };
  } finally {
    clearTimeout(timeout);
  }
};
