/**
 * Tests for GitHub-style alerts markdown parsing
 */

import { marked } from "marked"
import { parseMarkdownBlocks } from "./parseMarkdownBlocks"

describe("parseMarkdownBlocks", () => {
  test("renders NOTE alert block", () => {
    const markdown = `> [!NOTE]
> This is a note`

    const blocks = parseMarkdownBlocks(markdown)
    expect(blocks).toHaveLength(1)
    expect(blocks[0]).toMatchObject({
      type: "alert",
      alertType: "NOTE",
      content: "This is a note",
    })
  })

  test("renders WARNING alert block", () => {
    const markdown = `> [!WARNING]
> This is a warning`

    const blocks = parseMarkdownBlocks(markdown)
    expect(blocks[0]).toMatchObject({
      type: "alert",
      alertType: "WARNING",
    })
  })

  test("handles prose before and after alerts", () => {
    const markdown = `Intro paragraph.

> [!TIP]
> Helpful advice here

Closing paragraph.`

    const blocks = parseMarkdownBlocks(markdown)
    expect(blocks).toHaveLength(3)
    expect(blocks[0].type).toBe("markdown")
    expect(blocks[1].type).toBe("alert")
    expect(blocks[2].type).toBe("markdown")
  })

  test("handles multiple consecutive alerts", () => {
    const markdown = `> [!WARNING]
> Warning body

> [!NOTE]
> Note body`

    const blocks = parseMarkdownBlocks(markdown)
    expect(blocks).toHaveLength(2)
    expect(blocks[0].alertType).toBe("WARNING")
    expect(blocks[1].alertType).toBe("NOTE")
  })

  test("handles case-insensitive alert types", () => {
    const markdown = `> [!note]
> Lowercase note`

    const blocks = parseMarkdownBlocks(markdown)
    expect(blocks[0].alertType).toBe("NOTE")
  })

  test("alert body supports markdown rendering", () => {
    const markdown = `> [!WARNING]
> This is **bold** and *italic*`

    const html = marked(parseMarkdownBlocks(markdown)[0].content)
    expect(html).toContain("<strong>bold</strong>")
    expect(html).toContain("<em>italic</em>")
  })

  test("handles code blocks inside alerts", () => {
    const markdown = `> [!TIP]
> Example formula:
> \`\`\`
> max = work_mem × operations
> \`\`\``

    const blocks = parseMarkdownBlocks(markdown)
    const html = marked(blocks[0].content)
    expect(html).toContain("<code>")
    expect(html).toContain("max = work_mem")
  })

  test("handles tables inside alerts", () => {
    const markdown = `> [!TIP]
> Connection recommendations:
>
> | Scenario | Connections |
> |----------|------------|
> | With pooling | 20-50 |`

    const blocks = parseMarkdownBlocks(markdown)
    const html = marked(blocks[0].content)
    expect(html).toContain("<table>")
    expect(html).toContain("With pooling")
  })
})
