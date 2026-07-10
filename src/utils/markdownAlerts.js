/**
 * marked extension for GitHub-style alerts
 * Supports: NOTE, TIP, IMPORTANT, WARNING, CAUTION
 *
 * Syntax:
 * > [!NOTE]
 * > This is a note
 *
 * Renders as styled callout boxes with icons
 */

const alertTypes = {
  NOTE: {
    variantClass: 'is-info',
    icon: 'fa-info-circle',
    title: 'Note'
  },
  TIP: {
    variantClass: 'is-success',
    icon: 'fa-lightbulb',
    title: 'Tip'
  },
  IMPORTANT: {
    variantClass: 'is-link',
    icon: 'fa-bullhorn',
    title: 'Important'
  },
  WARNING: {
    variantClass: 'is-warning',
    icon: 'fa-exclamation-triangle',
    title: 'Warning'
  },
  CAUTION: {
    variantClass: 'is-danger',
    icon: 'fa-ban',
    title: 'Caution'
  }
};

/**
 * Extension for marked to parse GitHub-style alerts
 */
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
        .map(line => line.replace(/^\s*>\s?/, ''))
        .join('\n')
        .trim();

      const token = {
        type: 'githubAlerts',
        raw: match[0],
        alertType,
        content,
        tokens: []
      };

      // Tokenize as block-level content (supports tables, code blocks, etc.)
      this.lexer.blockTokens(content, token.tokens);

      return token;
    }
  },
  renderer(token) {
    const alert = alertTypes[token.alertType];
    if (!alert) return '';

    return `<article class="message ${alert.variantClass} github-alert">
  <div class="message-header">
    <p><i class="fas ${alert.icon}"></i> ${alert.title}</p>
  </div>
  <div class="message-body">
    ${this.parser.parse(token.tokens)}
  </div>
</article>`;
  }
};

/**
 * Configure marked with GitHub alerts extension
 */
export function configureMarked(marked) {
  marked.use({ extensions: [githubAlertsExtension] });
  return marked;
}
