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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to update HTML');
    }

    const data = await response.json();
    return data.html;
  } catch (error) {
    console.error("Error updating HTML:", error);
    throw new Error("Failed to update HTML. Please try again.");
  }
}
