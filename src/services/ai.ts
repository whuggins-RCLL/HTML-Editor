export async function updateHtml(originalHtml: string, instruction: string): Promise<string> {
  try {
    const response = await fetch('/api/update-html', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ html: originalHtml, instruction }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    // Handle streamed response
    const reader = response.body?.getReader();
    if (!reader) throw new Error("Response body is not readable");

    let text = "";
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode(); // flush

    // Clean up any potential markdown fences
    return text.replace(/^```html\s*/, "").replace(/^```\s*/, "").replace(/```$/, "").trim();
  } catch (error) {
    console.error("Error updating HTML:", error);
    throw new Error("Failed to update HTML. Please try again.");
  }
}
