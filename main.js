// Entry point for Darden Content Generator Frontend (Frontend-only version)
// No backend required - uses OpenRouter API directly

// Import modules
import { initializeChat, addMessageToChat, getSmsChatDisplay } from './chat.js';
import { initializeModal, configureModal, showApiKeyModal, handleModalInputKeydown, handleValidateAndSaveKey } from './modal.js';
import { initializeMode, updateModeUI } from './mode.js';
import { initializeSettings, getSettings, collectSettingsForGeneration } from './settings.js';
import { 
    getStoredApiKey, 
    storeApiKey, 
    generateSMSWithRetry,
    generateContent, 
    enhancePrompt 
} from './api-client-v2.js';

// --- Initialize UI Components ---
let currentMode = 'sms';
const settingsClearButtons = ['clear-settings-button', 'clear-settings-button-email', 'clear-files-button-left'];

function initializeApp() {
    // Check for stored API key
    const storedKey = getStoredApiKey();
    
    // Initialize UI modules
    initializeChat();
    initializeSettings();
    
    // Configure modal with chat dependency
    configureModal({ addMessage: addMessageToChat });
    initializeModal();
    
    // Show modal if no API key
    if (!storedKey) {
        showApiKeyModal();
    } else {
        addMessageToChat('ai', 'Welcome! Your OpenRouter API key is loaded. Start generating content!');
    }
    
    // Initialize mode switching
    initializeMode({
        onModeChange: (newMode) => {
            currentMode = newMode;
            updateModeUI(newMode);
        }
    });
    
    // Set up event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Modal events
    const modalInput = document.getElementById('modal-api-key-input');
    const validateButton = document.getElementById('validate-key-button');
    
    if (modalInput) {
        modalInput.addEventListener('keydown', handleModalInputKeydown);
    }
    
    if (validateButton) {
        validateButton.addEventListener('click', handleValidateAndSaveKey);
    }
    
    // Send button events
    const smsSendButton = document.getElementById('sms-send-button');
    const emailSendButton = document.getElementById('email-send-button');
    
    if (smsSendButton) {
        smsSendButton.addEventListener('click', () => handleSendMessage('sms'));
    }
    
    if (emailSendButton) {
        emailSendButton.addEventListener('click', () => handleSendMessage('email'));
    }
    
    // User input events
    const smsInput = document.getElementById('sms-user-input');
    const emailInput = document.getElementById('email-user-input');
    
    if (smsInput) {
        smsInput.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage('sms');
            }
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage('email');
            }
        });
    }
    
    // Enhance prompt buttons
    const smsEnhanceButton = document.getElementById('sms-enhance-button');
    const emailEnhanceButton = document.getElementById('email-enhance-button');
    
    if (smsEnhanceButton) {
        smsEnhanceButton.addEventListener('click', () => handleEnhancePrompt('sms'));
    }
    
    if (emailEnhanceButton) {
        emailEnhanceButton.addEventListener('click', () => handleEnhancePrompt('email'));
    }
    
    // Clear buttons
    const clearSettingsButtons = document.querySelectorAll('#clear-settings-button, #clear-settings-button-email');
    clearSettingsButtons.forEach(button => {
        button.addEventListener('click', handleClearSettings);
    });
    
    // Clear chat history buttons
    const clearSmsButton = document.getElementById('clear-sms-history-button');
    const clearEmailButton = document.getElementById('clear-email-history-button');
    
    if (clearSmsButton) {
        clearSmsButton.addEventListener('click', () => clearChatHistory('sms'));
    }
    
    if (clearEmailButton) {
        clearEmailButton.addEventListener('click', () => clearChatHistory('email'));
    }
    
    // Download buttons
    const downloadSmsButton = document.getElementById('download-sms-history-button');
    const downloadEmailButton = document.getElementById('download-email-history-button');
    
    if (downloadSmsButton) {
        downloadSmsButton.addEventListener('click', () => downloadChatHistory('sms'));
    }
    
    if (downloadEmailButton) {
        downloadEmailButton.addEventListener('click', () => downloadChatHistory('email'));
    }
    
    // Clear project button
    const clearProjectButton = document.getElementById('clear-project-button');
    if (clearProjectButton) {
        clearProjectButton.addEventListener('click', () => {
            const projectSelect = document.getElementById('project');
            if (projectSelect) {
                projectSelect.selectedIndex = 0;
            }
        });
    }
}

async function handleSendMessage(mode) {
    const apiKey = getStoredApiKey();
    if (!apiKey) {
        showApiKeyModal();
        return;
    }
    
    const inputId = mode === 'sms' ? 'sms-user-input' : 'email-user-input';
    const userInput = document.getElementById(inputId);
    if (!userInput) return;
    
    const userPrompt = userInput.value.trim();
    const settings = collectSettingsForGeneration();
    
    // For email mode, check if we have content to generate
    if (mode === 'email' && !userPrompt && !settings.subject && !settings.message) {
        addMessageToChat('ai', 'Please provide a prompt, subject, or message to generate email content.', false);
        return;
    }
    
    if (mode === 'sms' && !userPrompt) {
        addMessageToChat('ai', 'Please enter a prompt to generate SMS content.', false);
        return;
    }
    
    // Add user message to chat
    if (userPrompt) {
        addMessageToChat('user', userPrompt, false);
        userInput.value = '';
    }
    
    // Show loading state
    const loadingMsg = addMessageToChat('ai', '<span class="spinner-border spinner-border-sm"></span> Generating...', true, { asHtml: true });
    
    try {
        let result;
        
        if (mode === 'sms') {
            // Use enhanced SMS generation with retry logic
            result = await generateSMSWithRetry({
                apiKey,
                mode,
                userPrompt: userPrompt || `Generate ${mode} content`,
                settings,
                onProgress: (msg) => {
                    if (loadingMsg) {
                        loadingMsg.innerHTML = `<span class="spinner-border spinner-border-sm"></span> ${msg}...`;
                    }
                },
                onValidationError: (errors, attempt) => {
                    const errorMsg = `Validation failed (attempt ${attempt}): ${errors.map(e => e.errors.join(', ')).join('; ')}`;
                    addMessageToChat('ai', errorMsg, false, { className: 'alert-warning' });
                }
            });
        } else {
            // Regular generation for email
            result = await generateContent({
                apiKey,
                mode,
                userPrompt: userPrompt || `Generate ${mode} content`,
                settings
            });
        }
        
        // Remove loading message
        if (loadingMsg) loadingMsg.remove();
        
        if (result.ok) {
            // Display results
            if (mode === 'sms') {
                result.data.results.forEach(sms => {
                    const urlMatch = sms.match(/(.*?)(>>> https?:\/\/[^\s]+)?$/);
                    const messageOnly = urlMatch ? urlMatch[1].trim() : sms;
                    const charCount = messageOnly.length;
                    
                    const formattedMessage = `<div class="sms-message-content">${messageOnly}</div><div class="sms-char-count">${charCount} chars</div>`;
                    addMessageToChat('ai', formattedMessage, false, { asHtml: true, messageOnly });
                });
            } else {
                // Email mode
                result.data.results.forEach(email => {
                    const formattedEmail = `<div class="email-content"><strong>Subject:</strong> ${email.subject}<br><br>${email.body}</div>`;
                    addMessageToChat('ai', formattedEmail, false, { asHtml: true });
                });
            }
        } else {
            // Handle validation errors specially
            if (result.validationErrors) {
                const errorDetails = result.validationErrors
                    .map(e => `"${e.message}": ${e.errors.join(', ')}`)
                    .join('\n');
                addMessageToChat('ai', `SMS validation failed:\n${errorDetails}`, false);
            } else {
                addMessageToChat('ai', `Error: ${result.error}`, false);
            }
        }
    } catch (error) {
        if (loadingMsg) loadingMsg.remove();
        console.error('Generation error:', error);
        addMessageToChat('ai', 'Failed to generate content. Please check your API key and try again.', false);
    }
}

async function handleEnhancePrompt(mode) {
    const apiKey = getStoredApiKey();
    if (!apiKey) {
        showApiKeyModal();
        return;
    }
    
    const inputId = mode === 'sms' ? 'sms-user-input' : 'email-user-input';
    const userInput = document.getElementById(inputId);
    if (!userInput || !userInput.value.trim()) {
        addMessageToChat('ai', 'Please enter a prompt to enhance.', false);
        return;
    }
    
    const enhanceButton = document.getElementById(`${mode}-enhance-button`);
    if (enhanceButton) {
        enhanceButton.disabled = true;
        enhanceButton.textContent = 'Enhancing...';
    }
    
    try {
        const result = await enhancePrompt(apiKey, userInput.value, getSettings());
        
        if (result.ok) {
            userInput.value = result.data;
            addMessageToChat('ai', 'Prompt enhanced successfully!', false);
        } else {
            addMessageToChat('ai', `Failed to enhance prompt: ${result.error}`, false);
        }
    } catch (error) {
        console.error('Enhance error:', error);
        addMessageToChat('ai', 'Failed to enhance prompt.', false);
    } finally {
        if (enhanceButton) {
            enhanceButton.disabled = false;
            enhanceButton.textContent = 'Enhance Prompt';
        }
    }
}

function handleClearSettings() {
    // Clear all form inputs
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        // Clear selects
        settingsForm.querySelectorAll('select').forEach(select => {
            select.selectedIndex = 0;
        });
        
        // Clear text inputs
        settingsForm.querySelectorAll('input[type="text"], input[type="url"], input[type="number"], textarea').forEach(input => {
            input.value = input.defaultValue || '';
        });
        
        // Clear checkboxes
        settingsForm.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset number inputs to defaults
        const numResults = document.getElementById('num-results');
        if (numResults) numResults.value = '1';
    }
    
    addMessageToChat('ai', 'Settings cleared.', false);
}

function clearChatHistory(mode) {
    const chatDisplay = document.getElementById(`${mode}-chat-display`);
    if (chatDisplay) {
        // Remove all messages except the welcome message
        const messages = chatDisplay.querySelectorAll('.message');
        messages.forEach((msg, index) => {
            if (index > 0) msg.remove();
        });
    }
}

function downloadChatHistory(mode) {
    const chatDisplay = document.getElementById(`${mode}-chat-display`);
    if (!chatDisplay) return;
    
    const messages = chatDisplay.querySelectorAll('.message.ai');
    let content = `${mode.toUpperCase()} Generation History\n`;
    content += `Generated on: ${new Date().toLocaleString()}\n\n`;
    
    messages.forEach((msg, index) => {
        if (index === 0) return; // Skip welcome message
        
        const textContent = msg.querySelector('.sms-message-content') || 
                          msg.querySelector('.email-content') || 
                          msg;
        
        content += `--- Message ${index} ---\n`;
        content += textContent.textContent + '\n\n';
    });
    
    // Create and download file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mode}-history-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);