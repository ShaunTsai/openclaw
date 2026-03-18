import { describe, expect, it, vi } from "vitest";
import { runExtraParamsCase } from "./extra-params.test-support.js";

vi.mock("./logger.js", () => ({
  log: { debug: vi.fn(), warn: vi.fn() },
}));

describe("prompt_cache_key stripping for unsupported providers", () => {
  it("strips prompt_cache_key and prompt_cache_retention for non-allowlisted provider", () => {
    const payload: Record<string, unknown> = {
      model: "deepseek-v3",
      prompt_cache_key: "session-123",
      prompt_cache_retention: "auto",
    };
    const captured = runExtraParamsCase({
      applyProvider: "volcengine",
      model: { provider: "volcengine", id: "deepseek-v3", api: "openai-responses" },
      payload,
      applyModelId: "deepseek-v3",
    });
    expect(captured.payload.prompt_cache_key).toBeUndefined();
    expect(captured.payload.prompt_cache_retention).toBeUndefined();
    expect(captured.payload.model).toBe("deepseek-v3");
  });

  it("preserves prompt_cache_key for openai provider", () => {
    const payload: Record<string, unknown> = {
      model: "gpt-4.1",
      prompt_cache_key: "session-456",
      prompt_cache_retention: "auto",
    };
    const captured = runExtraParamsCase({
      applyProvider: "openai",
      model: { provider: "openai", id: "gpt-4.1", api: "openai-responses" },
      payload,
      applyModelId: "gpt-4.1",
    });
    expect(captured.payload.prompt_cache_key).toBe("session-456");
    expect(captured.payload.prompt_cache_retention).toBe("auto");
  });
});
