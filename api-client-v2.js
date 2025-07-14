/**
 * api-client-v2.js - Enhanced OpenRouter API client with backend feature parity
 * Includes prompt templates, validation, campaign data, and retry logic
 */

import { buildPrompt, validateSMS, interpolateTemplate, PROMPTS } from './prompt-templates.js';
import { getCampaignInsights, formatCampaignDataForPrompt } from './campaign-data.js';

export const LOCALSTORAGE_API_KEY_NAME = 'openRouterApiKey';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

/**
 * Get stored OpenRouter API key
 * @returns {string|null}
 */
export function getStoredApiKey() {
    return localStorage.getItem(LOCALSTORAGE_API_KEY_NAME);
}

/**
 * Store OpenRouter API key
 * @param {string} apiKey 
 */
export function storeApiKey(apiKey) {
    if (apiKey) {
        localStorage.setItem(LOCALSTORAGE_API_KEY_NAME, apiKey);
    } else {
        localStorage.removeItem(LOCALSTORAGE_API_KEY_NAME);
    }
}

/**
 * Validate OpenRouter API key by making a test request
 * @param {string} apiKey
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
export async function validateApiKey(apiKey) {
    if (!apiKey) return { ok: false, error: "API key is required" };
    
    try {
        const response = await fetch(`${OPENROUTER_BASE_URL}/models`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Darden CMS'
            }
        });
        
        if (response.ok) {
            return { ok: true };
        } else if (response.status === 401) {
            return { ok: false, error: "Invalid OpenRouter API Key" };
        } else {
            return { ok: false, error: `Validation failed: ${response.statusText}` };
        }
    } catch (err) {
        return { ok: false, error: "Network error. Please check your connection." };
    }
}

/**
 * Generate content using OpenRouter with advanced prompt templates
 * @param {Object} params
 * @param {string} params.apiKey - OpenRouter API key
 * @param {string} params.mode - 'sms' or 'email'
 * @param {string} params.userPrompt - User's prompt
 * @param {Object} params.settings - Generation settings
 * @param {Function} params.onProgress - Progress callback
 * @returns {Promise<{ok: boolean, data?: any, error?: string}>}
 */
export async function generateContent(params) {
    const { apiKey, mode, userPrompt, settings, onProgress } = params;
    
    if (!apiKey) return { ok: false, error: "OpenRouter API key is required" };
    if (!userPrompt && mode !== 'email') return { ok: false, error: "Prompt is required" };
    
    try {
        // Build prompts using template system
        const { systemPrompt, userInstructions } = buildPrompt(mode, settings, userPrompt);
        
        // Add campaign context for Cheddar's
        let enhancedUserInstructions = userInstructions;
        if (settings.project === "Cheddars" || settings.project === "Cheddar's Scratch Kitchen") {
            enhancedUserInstructions += getCampaignInsights(settings.project);
            enhancedUserInstructions += formatCampaignDataForPrompt(settings.project);
        }
        
        // Prepare messages
        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: enhancedUserInstructions }
        ];
        
        // Make API call
        const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Darden CMS',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: settings.ai_model || 'google/gemini-2.0-flash-exp:free',
                messages: messages,
                temperature: settings.temperature || 0.8,
                top_p: settings.top_p || 0.7,
                frequency_penalty: settings.frequency_penalty || 0,
                presence_penalty: settings.presence_penalty || 0,
                stream: false
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return { 
                ok: false, 
                error: errorData.error?.message || `API Error: ${response.statusText}` 
            };
        }
        
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '';
        
        // Process response based on mode
        if (mode === 'sms') {
            return processSMSResponse(content, settings);
        } else {
            return processEmailResponse(content, settings);
        }
        
    } catch (err) {
        console.error('Generation error:', err);
        return { ok: false, error: "Failed to generate content. Please try again." };
    }
}

/**
 * Process SMS response with validation and retry logic
 */
async function processSMSResponse(content, settings) {
    // Split multiple messages
    const messages = content.split('---').map(msg => msg.trim()).filter(msg => msg);
    
    const results = [];
    const errors = [];
    
    for (const message of messages) {
        // Validate message
        const validation = validateSMS(message, settings.use_emojis);
        
        if (validation.valid) {
            // Add template URL if needed
            const templateUrl = settings.include_template !== false ? '\n>>> https://vbs.com/xxxxx' : '';
            results.push(message + templateUrl);
        } else {
            errors.push({
                message,
                errors: validation.errors
            });
        }
    }
    
    // If we have valid results, return them
    if (results.length > 0) {
        return { ok: true, data: { results } };
    }
    
    // Otherwise return validation errors
    return {
        ok: false,
        error: 'SMS validation failed',
        validationErrors: errors
    };
}

/**
 * Process email response
 */
function processEmailResponse(content, settings) {
    try {
        // Try to parse as JSON
        let parsed;
        
        // Handle both single object and array responses
        if (content.trim().startsWith('[')) {
            parsed = JSON.parse(content);
        } else if (content.trim().startsWith('{')) {
            parsed = [JSON.parse(content)];
        } else {
            // Fallback: try to extract JSON from response
            const jsonMatch = content.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
            if (jsonMatch) {
                const json = jsonMatch[1];
                parsed = json.startsWith('[') ? JSON.parse(json) : [JSON.parse(json)];
            } else {
                throw new Error('No valid JSON found in response');
            }
        }
        
        // Validate structure
        const results = parsed.map(item => {
            if (!item.subject || !item.message) {
                throw new Error('Invalid email format: missing subject or message');
            }
            return {
                subject: item.subject,
                body: item.message
            };
        });
        
        return { ok: true, data: { results } };
        
    } catch (err) {
        console.error('Email parsing error:', err);
        // Fallback: treat as plain text
        return {
            ok: true,
            data: {
                results: [{
                    subject: 'Generated Email',
                    body: content
                }]
            }
        };
    }
}

/**
 * Generate SMS with retry logic for validation failures
 */
export async function generateSMSWithRetry(params, maxRetries = 2) {
    const { onProgress, onValidationError } = params;
    
    let attempt = 0;
    let lastError = null;
    
    while (attempt <= maxRetries) {
        if (attempt > 0 && onProgress) {
            onProgress(`Retry ${attempt}/${maxRetries}`);
        }
        
        const result = await generateContent(params);
        
        if (result.ok) {
            return result;
        }
        
        // If validation errors, prepare feedback for next attempt
        if (result.validationErrors) {
            lastError = result;
            
            if (onValidationError) {
                onValidationError(result.validationErrors, attempt + 1);
            }
            
            // Add validation feedback to prompt for retry
            if (attempt < maxRetries) {
                const feedback = result.validationErrors
                    .map(e => `- "${e.message}": ${e.errors.join(', ')}`)
                    .join('\n');
                
                params.userPrompt = `${params.userPrompt}\n\nPREVIOUS ATTEMPT FAILED VALIDATION:\n${feedback}\n\nPlease generate new messages that meet all requirements.`;
            }
        } else {
            // Non-validation error, don't retry
            return result;
        }
        
        attempt++;
    }
    
    return lastError || { ok: false, error: 'Max retries exceeded' };
}

/**
 * Enhance a user prompt using OpenRouter
 */
export async function enhancePrompt(apiKey, prompt, settings = {}) {
    if (!apiKey) return { ok: false, error: "OpenRouter API key is required" };
    if (!prompt) return { ok: false, error: "Prompt is required" };
    
    try {
        const template = PROMPTS.enhancePrompt;
        const values = {
            mode: settings.mode || 'sms',
            promptText: prompt
        };
        
        const systemPrompt = interpolateTemplate(template.systemInstruction, values);
        const userPrompt = interpolateTemplate(template.userInstructions, values);
        
        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ];
        
        const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Darden CMS',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-exp:free',
                messages: messages,
                temperature: 0.7,
                max_tokens: 200
            })
        });
        
        if (!response.ok) {
            return { ok: false, error: "Failed to enhance prompt" };
        }
        
        const data = await response.json();
        const enhanced = data.choices[0]?.message?.content || prompt;
        
        return { ok: true, data: enhanced.trim() };
        
    } catch (err) {
        console.error('Enhance prompt error:', err);
        return { ok: false, error: "Failed to enhance prompt" };
    }
}

/**
 * Generate initial prompt from topic and tone
 */
export async function generatePromptFromTopicTone(apiKey, topic, tone, mode = 'sms') {
    if (!apiKey || !topic || !tone) {
        return { ok: false, error: "API key, topic, and tone are required" };
    }
    
    try {
        const template = PROMPTS.generatePromptFromTopicTone || PROMPTS.enhancePrompt;
        const values = { mode, topic, tone };
        
        const systemPrompt = interpolateTemplate(
            "You are an AI assistant that crafts initial user prompts for marketing copy generation.",
            values
        );
        
        const userPrompt = `Create a clear, specific prompt for generating ${mode} marketing content about "${topic}" with a ${tone} tone. Output only the prompt text.`;
        
        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ];
        
        const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Darden CMS',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-exp:free',
                messages: messages,
                temperature: 0.7,
                max_tokens: 150
            })
        });
        
        if (!response.ok) {
            return { ok: false, error: "Failed to generate prompt" };
        }
        
        const data = await response.json();
        const generatedPrompt = data.choices[0]?.message?.content || '';
        
        return { ok: true, data: generatedPrompt.trim() };
        
    } catch (err) {
        console.error('Generate prompt error:', err);
        return { ok: false, error: "Failed to generate prompt" };
    }
}