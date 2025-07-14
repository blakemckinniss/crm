// modal.js - Handles OpenRouter API key modal logic (Frontend-only version)

import {
    validateApiKey,
    storeApiKey,
    LOCALSTORAGE_API_KEY_NAME
} from './api-client-v2.js';

let apiKeyModal, modalApiKeyInput, validateKeyButton, modalErrorMessage, apiKeyModalElement;
let addMessage = () => {}; // Placeholder for addMessageToChat dependency

/**
 * Configures the modal module with dependencies.
 * @param {object} config
 * @param {function} config.addMessage - Function to add messages to the chat UI.
 */
export function configureModal(config) {
    addMessage = config.addMessage || addMessage;
}

export function initializeModal() {
    apiKeyModalElement = document.getElementById('api-key-modal');
    modalApiKeyInput = document.getElementById('modal-api-key-input');
    validateKeyButton = document.getElementById('validate-key-button');
    modalErrorMessage = document.getElementById('modal-error-message');
    if (!apiKeyModalElement) return;
    apiKeyModal = new bootstrap.Modal(apiKeyModalElement, {
        backdrop: 'static',
        keyboard: false
    });
}

export function showApiKeyModal() {
    if (!modalErrorMessage || !modalApiKeyInput || !apiKeyModal) return;
    modalErrorMessage.textContent = '';
    modalErrorMessage.style.display = 'none';
    modalApiKeyInput.value = '';
    apiKeyModal.show();
    apiKeyModalElement.addEventListener('shown.bs.modal', () => modalApiKeyInput.focus(), { once: true });
}

function hideApiKeyModal() {
    if (apiKeyModal) apiKeyModal.hide();
}

export function handleModalInputKeydown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleValidateAndSaveKey();
    }
}

async function handleValidateAndSaveKey() {
    const apiKey = modalApiKeyInput.value.trim();
    if (!apiKey) {
        modalErrorMessage.textContent = 'Please enter your OpenRouter API key.';
        modalErrorMessage.style.display = 'block';
        return;
    }
    
    modalErrorMessage.textContent = 'Validating OpenRouter API key...';
    modalErrorMessage.style.display = 'block';
    modalErrorMessage.classList.remove('alert-danger');
    modalErrorMessage.classList.add('alert-info');
    validateKeyButton.disabled = true;
    
    try {
        const result = await validateApiKey(apiKey);
        
        if (result.ok) {
            // Store the API key
            storeApiKey(apiKey);
            
            modalErrorMessage.textContent = '';
            modalErrorMessage.style.display = 'none';
            console.log('OpenRouter API Key validated and saved.');
            hideApiKeyModal();
            addMessage('ai', '✅ OpenRouter API Key validated successfully! You can now generate content.');
        } else {
            modalErrorMessage.textContent = result.error || 'Invalid OpenRouter API Key';
            modalErrorMessage.classList.remove('alert-info');
            modalErrorMessage.classList.add('alert-danger');
            modalErrorMessage.style.display = 'block';
            console.warn('OpenRouter API Key validation failed:', result.error);
        }
    } catch (error) {
        console.error('Error validating OpenRouter API key:', error);
        modalErrorMessage.textContent = 'Network error during validation. Please check your connection and try again.';
        modalErrorMessage.classList.remove('alert-info');
        modalErrorMessage.classList.add('alert-danger');
        modalErrorMessage.style.display = 'block';
    } finally {
        validateKeyButton.disabled = false;
    }
}

// Export the validation handler for use in main.js
export { handleValidateAndSaveKey };