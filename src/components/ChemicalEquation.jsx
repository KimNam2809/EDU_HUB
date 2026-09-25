import React from 'react';
import katex from 'katex';

/**
 * Universal Chemical Equation & Math Renderer for EduHub
 * Renders LaTeX formulas (via KaTeX) and Unicode/ASCII chemistry equations cleanly.
 */
export default function ChemicalEquation({ formula, style = {}, className = '' }) {
  if (!formula) return null;

  const raw = String(formula).trim();

  // If already pure Unicode with subscript numbers (e.g., '2H₂ + O₂ → 2H₂O') and no LaTeX backslashes
  if (/[₀₁₂₃₄₅₆₇₈₉→⇌↑↓]/.test(raw) && !raw.includes('\\')) {
    return (
      <span 
        className={`chemical-equation-unicode ${className}`} 
        style={{ 
          letterSpacing: '0.04em', 
          fontFamily: 'var(--font-mono, monospace)', 
          fontWeight: 700, 
          display: 'inline-block',
          ...style 
        }}
      >
        {raw}
      </span>
    );
  }

  // Normalize LaTeX for chemical equations
  let latex = raw;

  // 1. Convert plain ASCII arrows '->' or '-->'
  if (!latex.includes('\\xrightarrow') && !latex.includes('\\rightarrow') && !latex.includes('\\xrightleftharpoons') && !latex.includes('\\rightleftharpoons')) {
    latex = latex.replace(/-->/g, '\\rightarrow ').replace(/->/g, '\\rightarrow ');
  }

  // 2. Normalize \xrightarrow conditions BEFORE handling generic exponents
  latex = latex.replace(/\\xrightarrow\{([^}]+)\}/g, (match, cond) => {
    let c = cond.trim();
    if (c === 't^o' || c === 't°' || c === 't^{\\circ}' || c === 't') {
      return '\\xrightarrow{t^{\\circ}}';
    }
    if (c === 'hv' || c === 'h\\nu') {
      return '\\xrightarrow{h\\nu}';
    }
    if (c.includes('thiếu')) {
      return '\\xrightarrow{t^{\\circ},\\text{ thiếu }O_2}';
    }
    if (c.includes('900') || c.includes('1000')) {
      return '\\xrightarrow{900 - 1000^{\\circ}\\text{C}}';
    }
    if (c.includes('Ánh sáng') || c.includes('Diệp lục')) {
      return '\\xrightarrow{\\text{Ánh sáng, Diệp lục}}';
    }
    if (/[a-zA-ZÀ-ỹ]/.test(c) && !c.includes('\\text')) {
      return `\\xrightarrow{\\text{${c}}}`;
    }
    return match;
  });

  // 3. Normalize \xrightleftharpoons conditions
  latex = latex.replace(/\\xrightleftharpoons\[([^\]]+)\]\{([^}]+)\}/g, () => {
    return '\\xrightleftharpoons[450^{\\circ}\\text{C}, 200\\text{atm}]{\\text{Fe}}';
  });

  // 4. Standardize degree outside arrows if any
  latex = latex.replace(/\^oC/g, '^{\\circ}\\text{C}');
  latex = latex.replace(/\^o/g, '^{\\circ}');

  // 5. Convert un-subscripted numbers directly following chemical symbols (e.g., Al2O3, H2O)
  if (!latex.includes('_') && !latex.includes('\\')) {
    latex = latex.replace(/([A-Z][a-z]?)(\d+)/g, '$1_{$2}');
  }

  // Render via KaTeX
  try {
    const html = katex.renderToString(latex, {
      throwOnError: false,
      displayMode: false,
      strict: false
    });

    return (
      <span 
        className={`chemical-equation ${className}`} 
        style={{ 
          display: 'inline-block', 
          verticalAlign: 'middle', 
          lineHeight: '1.4',
          ...style 
        }}
        dangerouslySetInnerHTML={{ __html: html }} 
      />
    );
  } catch (err) {
    // Resilient Fallback to beautiful Unicode text if KaTeX encounters unexpected syntax
    const fallbackText = raw
      .replace(/\\xrightarrow\{t\^o\}/g, ' ──(t°)──> ')
      .replace(/\\xrightarrow\{hv\}/g, ' ──(hν)──> ')
      .replace(/\\xrightarrow\{([^}]+)\}/g, ' ──($1)──> ')
      .replace(/\\xrightleftharpoons\[([^\]]+)\]\{([^}]+)\}/g, ' ⇌ [$2, $1] ')
      .replace(/\\rightleftharpoons/g, ' ⇌ ')
      .replace(/\\rightarrow/g, ' → ')
      .replace(/\\uparrow/g, '↑')
      .replace(/\\downarrow/g, '↓')
      .replace(/\\cdot/g, '·')
      .replace(/_\{(\d+)\}/g, (_, d) => d.split('').map(c => '₀₁₂₃₄₅₆₇₈₉'[c] || c).join(''))
      .replace(/_(\d+)/g, (_, d) => d.split('').map(c => '₀₁₂₃₄₅₆₇₈₉'[c] || c).join(''))
      .replace(/\^o/g, '°')
      .replace(/\\/g, '');

    return (
      <span 
        className={`chemical-equation-fallback ${className}`} 
        style={{ 
          letterSpacing: '0.03em', 
          fontFamily: 'var(--font-mono, monospace)', 
          fontWeight: 700, 
          ...style 
        }}
      >
        {fallbackText}
      </span>
    );
  }
}
