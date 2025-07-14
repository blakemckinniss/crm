/**
 * prompt-templates.js - Prompt template system from backend
 * Replicates the sophisticated prompt construction logic
 */

export const PROMPTS = {
    email: {
        systemInstruction: "You are an expert email marketing copywriter for {{project}}. Your task is to generate compelling email subject lines and/or body text based on the provided context, user request, and potentially successful past campaign data (if provided). Adhere strictly to the requested output format (JSON with 'subject' and 'message' keys).",
        userInstructions: `Please generate {{num_results}} email variation(s) based on the following request and guidelines. Respond ONLY with a valid JSON object containing the keys "subject" and "message".

User Request Context:
{{user_request_context}}

Generation Task:
{{generation_task}}

Guidelines:
{{guidelines}}
- Leverage insights from the provided campaign data (subject strategies, successful emojis, content patterns).
- Ensure the tone and style align with the brand voice.
- CRITICAL: Your entire response MUST be ONLY the valid JSON object or array of objects as described. Do not include any text before or after the JSON. Example for one result: {"subject": "Generated Subject", "message": "Generated message body."}. Example for multiple: [{"subject": "Sub1", "message": "Msg1"}, {"subject": "Sub2", "message": "Msg2"}]`,
        guidelines: "{{topic_line}}{{date_line}}{{tone_line}}{{length_line}}{{href_line}}{{emoji_line}}",
        guidelines_topic: "- Focus on the topic: {{topic}}\n",
        guidelines_date: "- Relevant for the date: {{date}}\n",
        guidelines_tone: "- Use a {{tone}} tone.\n",
        guidelines_length: "- Aim for approximately {{length}} characters for the message body.\n",
        guidelines_href: "- Include this link where appropriate: {{href}}\n",
        guidelines_emoji_true: "- Include relevant emojis where appropriate, especially in the subject line.\n",
        guidelines_emoji_false: "- Do not include emojis.\n"
    },
    sms: {
        systemInstruction: "You are a highly creative and effective marketing copywriter specializing in SMS for {{project}}. Your goal is to generate unique, engaging, and high-converting SMS messages based on the provided context and user request. Avoid repetitive phrasing and focus on clarity, strong calls to action, and brand voice.",
        userInstructions: `Please generate {{num_results}} unique and effective SMS message variation(s) based on the following request and guidelines. Be creative and avoid repeating previous examples or common phrases.

User Request: "{{user_prompt}}"

Guidelines:
{{guidelines}}
- Ensure a clear Call To Action (CTA) within the message text itself.
- Generate distinct variations, exploring different angles or hooks for each.
- ABSOLUTELY CRITICAL CHARACTER LIMITS FOR THE MESSAGE TEXT (BEFORE the final link which will be added later) - NON-NEGOTIABLE:
  - STANDARD MESSAGES (NO EMOJI): The message text MUST NOT EXCEED 128 characters. NO EXCEPTIONS.
  - MESSAGES WITH EMOJI: If emojis are requested (use_emojis=true), include exactly ONE emoji and the message text MUST NOT EXCEED 40 characters. NO EXCEPTIONS.
  - VERIFY LENGTH: Double-check the character count of your generated message text BEFORE responding. Exceeding these limits is a failure.
- CRITICAL EMOJI USAGE: If emojis are requested (use_emojis=true), use exactly ONE relevant emoji. If emojis are NOT requested (use_emojis=false), DO NOT use any emojis.
- DO NOT INCLUDE THE FINAL LINK: You only need to generate the message text. The required link ('>>> https://vbs.com/xxxxx' or a custom one) will be appended automatically later.
- CRITICAL RESPONSE FORMAT: Your entire response MUST contain ONLY the generated SMS message text. If generating multiple messages, separate each distinct message with exactly three hyphens ('---') on its own line. Do not include any introductory text, explanations, numbering, labels, or any other text besides the messages and the separator.`,
        guidelines: "{{topic_line}}{{date_line}}{{tone_line}}{{length_line}}{{emoji_line}}",
        guidelines_topic: "- Focus on the topic: {{topic}}\n",
        guidelines_date: "- Relevant for the date: {{date}}\n",
        guidelines_tone: "- Adopt a {{tone}} tone.\n",
        guidelines_tone_default: "- Adopt an engaging and persuasive tone.\n",
        guidelines_length: "- Strictly adhere to a maximum message text length of {{length}} characters. If emojis are requested, the limit is 40 characters.\n",
        guidelines_length_default: "- Strictly adhere to a maximum message text length of 128 characters. If emojis are requested, the limit is 40 characters.\n",
        guidelines_emoji_true: "- Include exactly ONE relevant emoji. Remember the 40-character message text limit.\n",
        guidelines_emoji_false: "- Do not include any emojis. Remember the 128-character message text limit.\n"
    },
    enhancePrompt: {
        systemInstruction: "You are an AI assistant that refines user prompts for large-language-model (LLM) generation of {{mode}} marketing copy. Preserve the user's intent and constraints, but NEVER introduce new or assumed specifics (offers, prices, URLs, promo codes, company names, legal text) that are not in the original prompt.",
        userInstructions: `Rewrite the following prompt for clarity, brevity, and best-practice structure. Output ONLY the final, enhanced prompt—no explanations or extra text.

Original Prompt:
"{{promptText}}"`
    }
};

/**
 * Build guidelines string based on settings
 */
export function buildGuidelines(mode, settings) {
    const template = PROMPTS[mode];
    if (!template) return '';
    
    let guidelines = '';
    
    // Topic
    if (settings.topic && template.guidelines_topic) {
        guidelines += template.guidelines_topic.replace('{{topic}}', settings.topic);
    }
    
    // Date
    if (settings.date && template.guidelines_date) {
        guidelines += template.guidelines_date.replace('{{date}}', settings.date);
    }
    
    // Tone
    if (settings.tone && template.guidelines_tone) {
        guidelines += template.guidelines_tone.replace('{{tone}}', settings.tone);
    } else if (template.guidelines_tone_default) {
        guidelines += template.guidelines_tone_default;
    }
    
    // Length
    if (settings.length && template.guidelines_length) {
        guidelines += template.guidelines_length.replace('{{length}}', settings.length);
    } else if (template.guidelines_length_default) {
        guidelines += template.guidelines_length_default;
    }
    
    // Href (email only)
    if (mode === 'email' && settings.href && template.guidelines_href) {
        guidelines += template.guidelines_href.replace('{{href}}', settings.href);
    }
    
    // Emojis
    if (settings.use_emojis && template.guidelines_emoji_true) {
        guidelines += template.guidelines_emoji_true;
    } else if (!settings.use_emojis && template.guidelines_emoji_false) {
        guidelines += template.guidelines_emoji_false;
    }
    
    return guidelines;
}

/**
 * Interpolate template with values
 */
export function interpolateTemplate(template, values) {
    let result = template;
    for (const [key, value] of Object.entries(values)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, value || '');
    }
    return result;
}

/**
 * Build complete prompt for AI generation
 */
export function buildPrompt(mode, settings, userPrompt) {
    const template = PROMPTS[mode];
    if (!template) throw new Error(`Unknown mode: ${mode}`);
    
    // Build guidelines
    const guidelines = buildGuidelines(mode, settings);
    
    // Prepare values for interpolation
    const values = {
        project: settings.project || 'restaurant',
        num_results: settings.num_results || 1,
        user_prompt: userPrompt,
        user_request_context: userPrompt,
        generation_task: mode === 'email' 
            ? (settings.subject || settings.message ? 'Generate based on provided subject/message' : 'Generate email content')
            : 'Generate SMS message',
        guidelines: guidelines,
        ...settings
    };
    
    // Interpolate templates
    const systemPrompt = interpolateTemplate(template.systemInstruction, values);
    const userInstructions = interpolateTemplate(template.userInstructions, values);
    
    return { systemPrompt, userInstructions };
}

/**
 * Validate SMS message according to backend rules
 */
export function validateSMS(message, useEmojis) {
    // Count emojis
    const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F000}-\u{1F02F}]|[\u{1F0A0}-\u{1F0FF}]|[\u{1F100}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA70}-\u{1FAFF}]/gu;
    const emojis = message.match(emojiRegex) || [];
    const emojiCount = emojis.length;
    
    // Character limit based on emoji usage
    const maxLength = useEmojis ? 40 : 128;
    
    // Validation checks
    const errors = [];
    
    if (message.length > maxLength) {
        errors.push(`Message exceeds ${maxLength} character limit (current: ${message.length})`);
    }
    
    if (useEmojis && emojiCount !== 1) {
        errors.push(`Expected exactly 1 emoji, found ${emojiCount}`);
    }
    
    if (!useEmojis && emojiCount > 0) {
        errors.push(`No emojis allowed, found ${emojiCount}`);
    }
    
    return {
        valid: errors.length === 0,
        errors,
        charCount: message.length,
        emojiCount
    };
}