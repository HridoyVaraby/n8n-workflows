// Process Unsplash response and select best image
const unsplashData = $input.first().json;
const titleData = $('Select Random Title').item.json;
const aiAgentResponse = $('Generate Blog Content with AI Agent').item.json;

// Extract content from AI Agent response
let blogContent = '';
if (aiAgentResponse.output) {
  blogContent = aiAgentResponse.output;
} else if (aiAgentResponse.text) {
  blogContent = aiAgentResponse.text;
} else if (typeof aiAgentResponse === 'string') {
  blogContent = aiAgentResponse;
}

// Fallback if content extraction fails
if (!blogContent) {
  blogContent = `<h2>About ${titleData.title}</h2><p>This is a placeholder blog post about ${titleData.title}. The AI content generation encountered an issue.</p>`;
}

let selectedImage = null;

if (unsplashData.results && unsplashData.results.length > 0) {
  // Select the first high-quality image
  const image = unsplashData.results[0];
  selectedImage = {
    url: image.urls.regular,
    downloadUrl: image.urls.full,
    alt: image.alt_description || titleData.title,
    photographer: image.user.name,
    photographerUrl: image.user.links.html,
    unsplashUrl: image.links.html
  };
}

return [{
  json: {
    title: titleData.title,
    content: blogContent,
    category: titleData.category,
    rowNumber: titleData.rowNumber,
    featuredImage: selectedImage,
    tags: titleData.tags,
    slug: titleData.slug,
    status: 'draft',
    publishDate: new Date().toISOString()
  }
}];