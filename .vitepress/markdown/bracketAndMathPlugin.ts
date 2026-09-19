import type { MarkdownRenderer } from "vitepress";

/**
 * 标点括号与 LaTeX 公式防断裂及展示公式解析增强插件
 *
 * 1. math_display_inline:
 *    解决 markdown-it-mathjax3 在列表项、表格单元格及非独立段落中遇到 $$...$$ 时
 *    直接跳过不解析并导致裸 LaTeX 泄露且无法居中的严重缺陷。
 *
 * 2. bracket_math_grouping:
 *    解决行内公式 ($...$) 与外围括号（如（$v=0$）、【$a>0$】）在浏览器行末折行时，
 *    因 <mjx-container> 为 inline-block 导致括号被孤立在行尾或行首的中文排版缺陷。
 *    同时保护类似（1）、(2) 等括号编号不被跨行撕裂。
 */
export function configureBracketAndMathPlugin(md: MarkdownRenderer): void {
  // 1. 捕获行内上下文中的 $$...$$ 展示公式
  md.inline.ruler.before("math_inline", "math_display_inline", (state, silent) => {
    const start = state.pos;
    if (state.src.slice(start, start + 2) !== "$$") return false;

    let match = start + 2;
    while ((match = state.src.indexOf("$$", match)) !== -1) {
      // 检查转义反斜杠
      let pos = match - 1;
      while (pos >= start && state.src[pos] === "\\") pos--;
      if ((match - 1 - pos) % 2 === 0) {
        // 偶数个反斜杠表示未转义
        break;
      }
      match += 2;
    }

    if (match === -1 || match <= start + 2) return false;

    const content = state.src.slice(start + 2, match).trim();
    if (!content) return false;

    if (!silent) {
      const token = state.push("math_block", "math", 0);
      token.markup = "$$";
      token.block = true;
      token.content = content;
    }

    state.pos = match + 2;
    return true;
  });

  // 2. 括号与行内公式、编号无缝绑定
  md.core.ruler.after("inline", "bracket_math_grouping", (state) => {
    const OPEN_BRACKETS = ["（", "(", "【", "〔", "［", "[", "《", "“", "‘"];
    const CLOSE_BRACKETS = ["）", ")", "】", "〕", "］", "]", "》", "”", "’"];
    const BRACKET_PAIR_MAP: Record<string, string> = {
      "（": "）",
      "(": ")",
      "【": "】",
      "〔": "〕",
      "［": "］",
      "[": "]",
      "《": "》",
      "“": "”",
      "‘": "’",
    };

    for (const blockToken of state.tokens) {
      if (blockToken.type !== "inline" || !blockToken.children) continue;

      const children = blockToken.children;
      const newChildren: typeof children = [];

      for (let i = 0; i < children.length; i++) {
        const token = children[i];

        // 处理行内公式外围括号绑定
        if (token.type === "math_inline") {
          const prevToken = i > 0 ? children[i - 1] : null;
          const nextToken = i + 1 < children.length ? children[i + 1] : null;

          let openChar: string | null = null;
          let closeChar: string | null = null;

          if (prevToken && prevToken.type === "text" && prevToken.content.length > 0) {
            const lastChar = prevToken.content.slice(-1);
            if (OPEN_BRACKETS.includes(lastChar)) openChar = lastChar;
          }

          if (nextToken && nextToken.type === "text" && nextToken.content.length > 0) {
            const firstChar = nextToken.content.slice(0, 1);
            if (CLOSE_BRACKETS.includes(firstChar)) closeChar = firstChar;
          }

          // 情况 A: 公式前后均有成对括号：如（$v=0$）
          if (openChar && closeChar && BRACKET_PAIR_MAP[openChar] === closeChar) {
            prevToken!.content = prevToken!.content.slice(0, -1);
            nextToken!.content = nextToken!.content.slice(1);

            const openSpan = new state.Token("html_inline", "", 0);
            openSpan.content = `<span class="vp-math-bracket-group">${openChar}`;
            const closeSpan = new state.Token("html_inline", "", 0);
            closeSpan.content = `${closeChar}</span>`;

            newChildren.push(openSpan);
            newChildren.push(token);
            newChildren.push(closeSpan);
            continue;
          }

          // 情况 B: 仅公式前有左括号：如（$v_1$ 和 $v_2$）中的前式，防止左括号留在行末孤立
          if (openChar && !closeChar) {
            prevToken!.content = prevToken!.content.slice(0, -1);

            const openSpan = new state.Token("html_inline", "", 0);
            openSpan.content = `<span class="vp-math-bracket-group">${openChar}`;
            const closeSpan = new state.Token("html_inline", "", 0);
            closeSpan.content = `</span>`;

            newChildren.push(openSpan);
            newChildren.push(token);
            newChildren.push(closeSpan);
            continue;
          }

          // 情况 C: 仅公式后有右括号：如（$v_1$ 和 $v_2$）中的后式，防止右括号在行首孤立
          if (!openChar && closeChar) {
            nextToken!.content = nextToken!.content.slice(1);

            const openSpan = new state.Token("html_inline", "", 0);
            openSpan.content = `<span class="vp-math-bracket-group">`;
            const closeSpan = new state.Token("html_inline", "", 0);
            closeSpan.content = `${closeChar}</span>`;

            newChildren.push(openSpan);
            newChildren.push(token);
            newChildren.push(closeSpan);
            continue;
          }
        }

        // 处理纯文本中的括号编号：如（1）、(2) 等，防止在括号与数字间断行
        if (token.type === "text") {
          if (/([（(]\d{1,3}[）)])/.test(token.content)) {
            const parts = token.content.split(/([（(]\d{1,3}[）)])/g);
            if (parts.length > 1) {
              for (const part of parts) {
                if (/^[（(]\d{1,3}[）)]$/.test(part)) {
                  const numSpan = new state.Token("html_inline", "", 0);
                  numSpan.content = `<span class="vp-bracket-num">${part}</span>`;
                  newChildren.push(numSpan);
                } else if (part.length > 0) {
                  const t = new state.Token("text", "", 0);
                  t.content = part;
                  newChildren.push(t);
                }
              }
              continue;
            }
          }
        }

        newChildren.push(token);
      }

      blockToken.children = newChildren;
    }
  });
}
