/**
 * marked extension for GitHub-style alerts
 * Supports: NOTE, TIP, IMPORTANT, WARNING, CAUTION
 */

const alertTypes = {
  NOTE: { slug: 'note', title: 'Note' },
  TIP: { slug: 'tip', title: 'Tip' },
  IMPORTANT: { slug: 'important', title: 'Important' },
  WARNING: { slug: 'warning', title: 'Warning' },
  CAUTION: { slug: 'caution', title: 'Caution' },
};

export const githubAlertsExtension = {
  name: 'githubAlerts',
  level: 'block',
  start(src) {
    return src.match(/^\s*>\s*\[!/)?.index;
  },
  tokenizer(src) {
    const rule = /^(?:\s*>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n)((?:\s*>(?!\s*\[!).*\n?)+)/i;
    const match = rule.exec(src);

    if (match) {
      const alertType = match[1].toUpperCase();
      const content = match[2]
        .split('\n')
        .map((line) => line.replace(/^\s*>\s?/, ''))
        .join('\n')
        .trim();

      const token = {
        type: 'githubAlerts',
        raw: match[0],
        alertType,
        content,
        tokens: [],
      };

      this.lexer.blockTokens(content, token.tokens);

      return token;
    }
  },
  renderer(token) {
    const alert = alertTypes[token.alertType];
    if (!alert) return '';

    return `<aside class="md-alert md-alert-${alert.slug}" role="note">
  <p class="md-alert-title">${alert.title}</p>
  <div class="md-alert-body">
    ${this.parser.parse(token.tokens)}
  </div>
</aside>`;
  },
};

export function configureMarked(marked) {
  marked.use({ extensions: [githubAlertsExtension] });
  return marked;
}
