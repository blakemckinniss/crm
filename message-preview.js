// Message preview component for SMS campaigns
export class MessagePreview {
    constructor(options = {}) {
        this.options = {
            maxSmsLength: 160,
            maxSmsWithEmoji: 40,
            urlTemplate: '>>> https://vbs.com/xxxxx',
            ...options
        };
        
        this.element = null;
        this.previewData = {
            brand: '',
            message: '',
            hasEmoji: false,
            tone: '',
            campaign: ''
        };
    }
    
    /**
     * Create the preview element
     */
    create() {
        const preview = document.createElement('div');
        preview.className = 'message-preview-container';
        preview.innerHTML = `
            <div class="preview-header">
                <h4 class="preview-title">Message Preview</h4>
                <button class="preview-refresh" title="Refresh preview">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                    </svg>
                </button>
            </div>
            
            <div class="preview-device">
                <div class="device-frame">
                    <div class="device-screen">
                        <div class="device-header">
                            <span class="carrier-name">Verizon</span>
                            <span class="signal-bars">📶</span>
                            <span class="battery">🔋</span>
                        </div>
                        
                        <div class="message-thread">
                            <div class="message-date">Today</div>
                            
                            <div class="message-bubble incoming">
                                <div class="sender-name">
                                    <span class="brand-name">Bahama Breeze</span>
                                    <span class="sender-number">46873</span>
                                </div>
                                <div class="message-content" id="preview-message">
                                    Your message will appear here...
                                </div>
                                <div class="message-time">Just now</div>
                            </div>
                        </div>
                        
                        <div class="message-input-area">
                            <input type="text" placeholder="Reply STOP to unsubscribe" disabled>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="preview-info">
                <div class="info-row">
                    <span class="info-label">Character Count:</span>
                    <span class="info-value character-count">0 / 160</span>
                </div>
                <div class="info-row">
                    <span class="info-label">SMS Segments:</span>
                    <span class="info-value segment-count">1</span>
                </div>
                <div class="info-row url-row">
                    <span class="info-label">Tracking URL:</span>
                    <span class="info-value url-preview">${this.options.urlTemplate}</span>
                </div>
            </div>
            
            <div class="preview-warnings" id="preview-warnings" style="display: none;">
                <div class="warning-item">
                    <span class="warning-icon">⚠️</span>
                    <span class="warning-text"></span>
                </div>
            </div>
            
            <div class="preview-suggestions">
                <h5 class="suggestions-title">💡 Quick Tips</h5>
                <ul class="suggestions-list" id="suggestions-list">
                    <li>Keep your message short and actionable</li>
                    <li>Include a clear call-to-action</li>
                    <li>Use time-sensitive language for urgency</li>
                </ul>
            </div>
        `;
        
        this.element = preview;
        this.attachEventListeners();
        this.addStyles();
        
        return preview;
    }
    
    /**
     * Add CSS styles
     */
    addStyles() {
        if (document.getElementById('message-preview-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'message-preview-styles';
        style.textContent = `
            .message-preview-container {
                background: white;
                border-radius: 12px;
                padding: 1.5rem;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            }
            
            .preview-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            }
            
            .preview-title {
                font-size: 1.125rem;
                font-weight: 600;
                color: #1e293b;
                margin: 0;
            }
            
            .preview-refresh {
                width: 32px;
                height: 32px;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                background: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                color: #64748b;
            }
            
            .preview-refresh:hover {
                border-color: #8b1109;
                color: #8b1109;
                background: #fef1f1;
            }
            
            .preview-refresh:active svg {
                animation: spin 0.5s ease;
            }
            
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            /* Phone Device Mock */
            .preview-device {
                display: flex;
                justify-content: center;
                margin-bottom: 1.5rem;
            }
            
            .device-frame {
                width: 320px;
                background: #1a1a1a;
                border-radius: 28px;
                padding: 8px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            }
            
            .device-screen {
                background: #f5f5f5;
                border-radius: 20px;
                height: 400px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }
            
            .device-header {
                background: white;
                padding: 8px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.75rem;
                border-bottom: 1px solid #e5e5e5;
            }
            
            .carrier-name {
                font-weight: 500;
            }
            
            .message-thread {
                flex: 1;
                padding: 16px;
                overflow-y: auto;
                background: #f5f5f5;
            }
            
            .message-date {
                text-align: center;
                font-size: 0.75rem;
                color: #666;
                margin-bottom: 12px;
            }
            
            .message-bubble {
                max-width: 85%;
                margin-bottom: 8px;
            }
            
            .message-bubble.incoming {
                margin-right: auto;
            }
            
            .sender-name {
                display: flex;
                align-items: center;
                gap: 6px;
                margin-bottom: 4px;
                font-size: 0.75rem;
            }
            
            .brand-name {
                font-weight: 600;
                color: #333;
            }
            
            .sender-number {
                color: #666;
            }
            
            .message-content {
                background: white;
                padding: 12px 16px;
                border-radius: 18px;
                border-top-left-radius: 4px;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                font-size: 0.9375rem;
                line-height: 1.4;
                color: #1a1a1a;
                word-wrap: break-word;
            }
            
            .message-time {
                font-size: 0.6875rem;
                color: #999;
                margin-top: 4px;
                margin-left: 4px;
            }
            
            .message-input-area {
                background: white;
                padding: 8px 16px;
                border-top: 1px solid #e5e5e5;
            }
            
            .message-input-area input {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #e5e5e5;
                border-radius: 20px;
                font-size: 0.875rem;
                background: #f9f9f9;
            }
            
            /* Preview Info */
            .preview-info {
                background: #f8fafc;
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1rem;
            }
            
            .info-row {
                display: flex;
                justify-content: space-between;
                padding: 0.5rem 0;
                border-bottom: 1px solid #e2e8f0;
            }
            
            .info-row:last-child {
                border-bottom: none;
            }
            
            .info-label {
                font-weight: 500;
                color: #64748b;
                font-size: 0.875rem;
            }
            
            .info-value {
                font-weight: 600;
                color: #1e293b;
                font-size: 0.875rem;
            }
            
            .character-count.warning {
                color: #f59e0b;
            }
            
            .character-count.danger {
                color: #ef4444;
            }
            
            .segment-count.multiple {
                color: #f59e0b;
            }
            
            .url-preview {
                font-family: monospace;
                font-size: 0.8125rem;
                background: #e2e8f0;
                padding: 2px 6px;
                border-radius: 4px;
            }
            
            /* Warnings */
            .preview-warnings {
                background: #fef3c7;
                border: 1px solid #fbbf24;
                border-radius: 8px;
                padding: 0.75rem 1rem;
                margin-bottom: 1rem;
            }
            
            .warning-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.875rem;
                color: #92400e;
            }
            
            /* Suggestions */
            .preview-suggestions {
                background: #fef1f1;
                border-radius: 8px;
                padding: 1rem;
            }
            
            .suggestions-title {
                font-size: 0.875rem;
                font-weight: 600;
                margin: 0 0 0.5rem 0;
                color: #8b1109;
            }
            
            .suggestions-list {
                margin: 0;
                padding-left: 1.25rem;
                font-size: 0.8125rem;
                color: #6b0d07;
            }
            
            .suggestions-list li {
                margin-bottom: 0.25rem;
            }
            
            .suggestions-list li:last-child {
                margin-bottom: 0;
            }
            
            /* Animation for message appearance */
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .message-bubble {
                animation: slideIn 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Refresh button
        this.element.querySelector('.preview-refresh').addEventListener('click', () => {
            this.refresh();
        });
    }
    
    /**
     * Update preview with new data
     */
    update(data) {
        // Update preview data
        Object.assign(this.previewData, data);
        
        // Update brand name
        const brandName = this.element.querySelector('.brand-name');
        brandName.textContent = this.previewData.brand || 'Restaurant';
        
        // Update message content
        const messageContent = this.element.querySelector('#preview-message');
        const fullMessage = this.formatMessage(this.previewData.message);
        messageContent.textContent = fullMessage;
        
        // Update character count
        this.updateCharacterCount(fullMessage);
        
        // Update warnings
        this.updateWarnings(fullMessage);
        
        // Update suggestions based on content
        this.updateSuggestions();
        
        // Animate message bubble
        const bubble = this.element.querySelector('.message-bubble');
        bubble.style.animation = 'none';
        setTimeout(() => {
            bubble.style.animation = 'slideIn 0.3s ease';
        }, 10);
    }
    
    /**
     * Format message with URL
     */
    formatMessage(message) {
        if (!message) return 'Your message will appear here...';
        
        // Ensure message ends with URL if not already present
        if (!message.includes('>>>')) {
            message = `${message} ${this.options.urlTemplate}`;
        }
        
        return message;
    }
    
    /**
     * Update character count display
     */
    updateCharacterCount(message) {
        const length = message.length;
        const maxLength = this.previewData.hasEmoji ? this.options.maxSmsWithEmoji : this.options.maxSmsLength;
        
        // Update character count
        const charCount = this.element.querySelector('.character-count');
        charCount.textContent = `${length} / ${maxLength}`;
        
        // Update character count color
        charCount.classList.remove('warning', 'danger');
        if (length > maxLength) {
            charCount.classList.add('danger');
        } else if (length > maxLength * 0.8) {
            charCount.classList.add('warning');
        }
        
        // Update segment count
        const segments = Math.ceil(length / maxLength);
        const segmentCount = this.element.querySelector('.segment-count');
        segmentCount.textContent = segments.toString();
        segmentCount.classList.toggle('multiple', segments > 1);
    }
    
    /**
     * Update warnings based on message content
     */
    updateWarnings(message) {
        const warnings = [];
        const length = message.length;
        const maxLength = this.previewData.hasEmoji ? this.options.maxSmsWithEmoji : this.options.maxSmsLength;
        
        if (length > maxLength) {
            warnings.push(`Message exceeds ${maxLength} character limit by ${length - maxLength} characters`);
        }
        
        if (this.previewData.hasEmoji && length > this.options.maxSmsWithEmoji) {
            warnings.push('With emojis, messages are limited to 40 characters');
        }
        
        if (!message.toLowerCase().includes('stop')) {
            warnings.push('Consider mentioning "Reply STOP to unsubscribe" for compliance');
        }
        
        const warningsEl = this.element.querySelector('#preview-warnings');
        const warningText = this.element.querySelector('.warning-text');
        
        if (warnings.length > 0) {
            warningText.textContent = warnings[0]; // Show first warning
            warningsEl.style.display = 'block';
        } else {
            warningsEl.style.display = 'none';
        }
    }
    
    /**
     * Update suggestions based on campaign type and content
     */
    updateSuggestions() {
        const suggestions = [];
        
        // Campaign-specific suggestions
        switch (this.previewData.campaign) {
            case 'flash-sale':
                suggestions.push('Add specific time limit (e.g., "Ends at 6pm")');
                suggestions.push('Include discount percentage');
                suggestions.push('Create urgency with "TODAY ONLY"');
                break;
            case 'weekend-special':
                suggestions.push('Mention specific days (Fri-Sun)');
                suggestions.push('Include happy hour times');
                suggestions.push('Add "See you this weekend!"');
                break;
            case 'loyalty-reward':
                suggestions.push('Personalize with member name if possible');
                suggestions.push('Include expiration date');
                suggestions.push('Thank them for their loyalty');
                break;
            default:
                suggestions.push('Keep your message short and actionable');
                suggestions.push('Include a clear call-to-action');
                suggestions.push('Use time-sensitive language for urgency');
        }
        
        // Tone-specific suggestions
        if (this.previewData.tone === 'urgent') {
            suggestions.push('Use action words like "NOW", "TODAY", "HURRY"');
        } else if (this.previewData.tone === 'playful') {
            suggestions.push('Add fun emojis to match your tone');
        }
        
        const suggestionsList = this.element.querySelector('#suggestions-list');
        suggestionsList.innerHTML = suggestions.map(s => `<li>${s}</li>`).join('');
    }
    
    /**
     * Refresh preview
     */
    refresh() {
        const refreshBtn = this.element.querySelector('.preview-refresh');
        refreshBtn.querySelector('svg').style.animation = 'spin 0.5s ease';
        
        // Trigger any refresh callbacks
        if (this.options.onRefresh) {
            this.options.onRefresh();
        }
        
        setTimeout(() => {
            refreshBtn.querySelector('svg').style.animation = '';
        }, 500);
    }
    
    /**
     * Clear preview
     */
    clear() {
        this.update({
            brand: '',
            message: '',
            hasEmoji: false,
            tone: '',
            campaign: ''
        });
    }
}

// Export factory function
export function createMessagePreview(container, options = {}) {
    const preview = new MessagePreview(options);
    const element = preview.create();
    container.appendChild(element);
    return preview;
}