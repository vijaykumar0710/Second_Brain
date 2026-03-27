const Link = require("../models/Links");
const cheerio = require("cheerio");
const axios = require("axios");

// 1. SAVE LINK
exports.saveLink = async (req, res) => {
  try {
    const { url, customTitle } = req.body;
    if (!url) return res.status(400).json({ message: "URL is required" });

    const { getLinkPreview } = await import("link-preview-js");
    let metadata = {};
    try {
      metadata = await getLinkPreview(url, {
        followRedirects: `follow`,
        headers: { "user-agent": "Mozilla/5.0" },
        timeout: 4000,
      });
    } catch (err) {
      console.warn("Meta failed");
    }

    const newLink = new Link({
      url,
      title: customTitle || metadata.title || "Untitled Link",
      description: metadata.description || "",
      imageUrl:
        metadata.images?.[0] ||
        metadata.favicons?.[0] ||
        "https://via.placeholder.com/400x200?text=No+Preview",
      user: req.user.id,
    });

    const savedLink = await newLink.save();
    res.status(201).json(savedLink);
  } catch (error) {
    res.status(500).json({ message: "Error saving", error: error.message });
  }
};

// 2. GET USER LINKS
exports.getLinks = async (req, res) => {
  try {
    const links = await Link.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(links);
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

// 3. AI SUMMARIZE (BALANCED & POINT-WISE)
exports.summarizeLink = async (req, res) => {
  try {
    const { id } = req.params;
    const link = await Link.findOne({ _id: id, user: req.user.id });
    if (!link) return res.status(404).json({ message: "Not found" });

    const apiKey = process.env.GROQ_API_KEY;
    let content = `Title: ${link.title}. Description: ${link.description}`;

    try {
      const isVideo =
        link.url.includes("youtube.com") || link.url.includes("youtu.be");
      if (!isVideo) {
        const { data: html } = await axios.get(link.url, {
          headers: { "User-Agent": "Mozilla/5.0" },
          timeout: 5000,
        });
        const $ = cheerio.load(html);
        $("script, style").remove();
        const bodyText = $("p").text().substring(0, 3000).trim();
        if (bodyText.length > 100) content = bodyText;
      }
    } catch (e) {}

    const prompt = `Summarize this content professionally:
    - First line: Overview: [1 catchy sentence]
    - Then exactly 5 bullet points (starting with '-') highlighting key facts. 
    Keep it medium length.
    Content: ${content}`;

    const groqRes = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
      },
      { headers: { Authorization: `Bearer ${apiKey}` } },
    );

    res
      .status(200)
      .json({ aiSummary: groqRes.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ message: "AI failed" });
  }
};

// 4. DELETE
exports.deleteLink = async (req, res) => {
  await Link.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  res.status(200).json({ message: "Deleted" });
};
