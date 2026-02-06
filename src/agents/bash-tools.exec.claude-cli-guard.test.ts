import { describe, expect, it } from "vitest";
import { fixClaudeCliInteractiveHang } from "./bash-tools.exec.js";

describe("fixClaudeCliInteractiveHang", () => {
  it("injects -p for bare `claude` command", () => {
    const result = fixClaudeCliInteractiveHang("claude");
    expect(result).not.toBeNull();
    expect(result!.fixed).toBe("claude -p");
  });

  it("injects -p for `claude` with prompt argument", () => {
    const result = fixClaudeCliInteractiveHang('claude "search for something"');
    expect(result).not.toBeNull();
    expect(result!.fixed).toBe('claude -p "search for something"');
  });

  it("injects -p for `claude` with flags but no -p", () => {
    const result = fixClaudeCliInteractiveHang("claude --model opus --output-format json");
    expect(result).not.toBeNull();
    expect(result!.fixed).toBe("claude -p --model opus --output-format json");
  });

  it("skips when -p already present", () => {
    expect(fixClaudeCliInteractiveHang('claude -p "hello"')).toBeNull();
  });

  it("skips when --print already present", () => {
    expect(fixClaudeCliInteractiveHang('claude --print "hello"')).toBeNull();
  });

  it("skips when --resume is used", () => {
    expect(fixClaudeCliInteractiveHang("claude --resume abc123")).toBeNull();
  });

  it("skips non-claude commands", () => {
    expect(fixClaudeCliInteractiveHang("ls -la")).toBeNull();
    expect(fixClaudeCliInteractiveHang("npm install")).toBeNull();
    expect(fixClaudeCliInteractiveHang("node script.js")).toBeNull();
  });

  it("handles claude with full path", () => {
    const result = fixClaudeCliInteractiveHang("/usr/local/bin/claude --model sonnet");
    expect(result).not.toBeNull();
    expect(result!.fixed).toBe("/usr/local/bin/claude -p --model sonnet");
  });

  it("skips when claude is part of another command name", () => {
    expect(fixClaudeCliInteractiveHang("claude-code run")).toBeNull();
  });

  it("handles piped commands — only fixes first segment", () => {
    const result = fixClaudeCliInteractiveHang('claude "prompt" | grep result');
    expect(result).not.toBeNull();
    expect(result!.fixed).toContain("claude -p");
  });

  it("includes a descriptive warning", () => {
    const result = fixClaudeCliInteractiveHang("claude");
    expect(result).not.toBeNull();
    expect(result!.warning).toContain("-p");
    expect(result!.warning).toContain("interactive");
  });

  it("handles leading whitespace", () => {
    const result = fixClaudeCliInteractiveHang("  claude --model haiku");
    expect(result).not.toBeNull();
    expect(result!.fixed).toContain("claude -p");
  });
});
