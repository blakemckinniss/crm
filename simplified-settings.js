// Simplified settings panel for non-technical marketers
export class SimplifiedSettings {
    constructor(options = {}) {
        this.options = {
            defaultModel: 'google/gemini-2.5-flash',
            defaultNumResults: 3,
            defaultTone: 'friendly',
            ...options
        };
        
        this.settings = {
            brand: 'Olive Garden',
            campaign: null,
            tone: this.options.defaultTone,
            numResults: this.options.defaultNumResults,
            useEmojis: false,
            aiModel: this.options.defaultModel,
            // Hidden technical settings with sensible defaults
            temperature: 0.8,
            topP: 0.7,
            frequencyPenalty: 0,
            presencePenalty: 0
        };
        
        this.element = null;
        this.callbacks = {};
    }
    
    /**
     * Create the simplified settings panel
     */
    create() {
        const panel = document.createElement('div');
        panel.className = 'simplified-settings-panel';
        panel.innerHTML = `
            <div class="settings-section">
                <h3 class="settings-title">Quick Setup</h3>
                
                <!-- Brand Selection -->
                <div class="setting-group">
                    <label class="setting-label">
                        <span class="label-text">Select Brand</span>
                        <span class="help-icon" title="Choose which restaurant brand">?</span>
                    </label>
                    <div class="brand-selector">
                        <button class="brand-btn active" data-brand="Olive Garden">
                            <span class="brand-logo">
                                <img src="https://www.darden.com/sites/default/files/2021-03/olive-garden--logo.svg" alt="Olive Garden">
                            </span>
                        </button>
                        <button class="brand-btn" data-brand="Cheddars">
                            <span class="brand-logo">
                                <img src="https://www.darden.com/sites/default/files/2023-06/cheddars-logo.png" alt="Cheddar's">
                            </span>
                        </button>
                        <button class="brand-btn" data-brand="Yardhouse">
                            <span class="brand-logo">
                                <img src="https://www.darden.com/sites/default/files/2023-06/Yard%20House%20logo_0.png" alt="Yard House">
                            </span>
                        </button>
                    </div>
                </div>
                
                <!-- Campaign Quick Select -->
                <div class="setting-group">
                    <label class="setting-label">
                        <span class="label-text">Campaign Type</span>
                        <span class="help-icon" title="What kind of message do you want to send?">?</span>
                    </label>
                    <select class="setting-select" id="campaign-type">
                        <option value="">Choose a campaign type...</option>
                        <option value="weekend-special">🎉 Weekend Special</option>
                        <option value="new-menu">🍽️ New Menu Item</option>
                        <option value="loyalty-reward">⭐ Loyalty Reward</option>
                        <option value="flash-sale">⚡ Flash Sale</option>
                        <option value="event">🎊 Special Event</option>
                        <option value="birthday">🎂 Birthday Greeting</option>
                        <option value="delivery-promo">🚗 Delivery Special</option>
                        <option value="custom">✏️ Custom Message</option>
                    </select>
                </div>
                
                <!-- Message Tone -->
                <div class="setting-group">
                    <label class="setting-label">
                        <span class="label-text">Message Tone</span>
                        <span class="help-icon" title="How should your message sound?">?</span>
                    </label>
                    <div class="tone-selector">
                        <button class="tone-btn active" data-tone="friendly">
                            <span class="tone-icon">😊</span>
                            <span class="tone-text">Friendly</span>
                        </button>
                        <button class="tone-btn" data-tone="urgent">
                            <span class="tone-icon">⏰</span>
                            <span class="tone-text">Urgent</span>
                        </button>
                        <button class="tone-btn" data-tone="playful">
                            <span class="tone-icon">🎈</span>
                            <span class="tone-text">Playful</span>
                        </button>
                        <button class="tone-btn" data-tone="professional">
                            <span class="tone-icon">💼</span>
                            <span class="tone-text">Professional</span>
                        </button>
                    </div>
                </div>
                
                <!-- Number of Variations -->
                <div class="setting-group">
                    <label class="setting-label">
                        <span class="label-text">How many versions?</span>
                        <span class="help-icon" title="Generate multiple options to choose from">?</span>
                    </label>
                    <div class="number-selector">
                        <button class="minus-btn">-</button>
                        <input type="number" class="number-input" value="3" min="1" max="10">
                        <button class="plus-btn">+</button>
                    </div>
                    <div class="setting-hint">We'll create 3 different versions</div>
                </div>
                
                <!-- Emoji Toggle -->
                <div class="setting-group">
                    <label class="setting-toggle">
                        <input type="checkbox" class="toggle-input" id="emoji-toggle">
                        <span class="toggle-slider"></span>
                        <span class="toggle-label">
                            <span class="toggle-text">Include Emojis</span>
                            <span class="toggle-hint">Makes messages more fun!</span>
                        </span>
                    </label>
                </div>
                
                <!-- Advanced Options (Collapsed by default) -->
                <div class="advanced-section">
                    <button class="advanced-toggle">
                        <span class="toggle-icon">▶</span>
                        <span class="toggle-text">Advanced Options</span>
                    </button>
                    <div class="advanced-content" style="display: none;">
                        <div class="setting-group">
                            <label class="setting-label">AI Model</label>
                            <select class="setting-select" id="ai-model">
                                <option value="google/gemini-2.5-flash">Gemini 2.5 Flash (Recommended)</option>
                                <option value="openai/gpt-4o-mini">GPT-4 Mini (Faster)</option>
                                <option value="anthropic/claude-3.5-haiku">Claude Haiku (Creative)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="quick-actions">
                <button class="action-btn primary" id="generate-btn">
                    <span class="btn-icon">✨</span>
                    <span class="btn-text">Generate Messages</span>
                </button>
                <button class="action-btn secondary" id="reset-btn">
                    <span class="btn-icon">🔄</span>
                    <span class="btn-text">Reset</span>
                </button>
            </div>
            
            <!-- Status Message -->
            <div class="status-message" id="status-message" style="display: none;"></div>
        `;
        
        this.element = panel;
        this.attachEventListeners();
        this.addStyles();
        
        return panel;
    }
    
    /**
     * Add CSS styles
     */
    addStyles() {
        if (document.getElementById('simplified-settings-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'simplified-settings-styles';
        style.textContent = `
            .simplified-settings-panel {
                background: white;
                border-radius: 12px;
                padding: 1.5rem;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            }
            
            .settings-title {
                font-size: 1.25rem;
                font-weight: 600;
                margin-bottom: 1.5rem;
                color: #1e293b;
            }
            
            .setting-group {
                margin-bottom: 1.5rem;
            }
            
            .setting-label {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 0.75rem;
                font-weight: 500;
                color: #334155;
            }
            
            .help-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #e2e8f0;
                color: #64748b;
                font-size: 0.75rem;
                cursor: help;
            }
            
            /* Brand Selector */
            .brand-selector {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 0.5rem;
            }
            
            .brand-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 0.75rem;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                background: white;
                cursor: pointer;
                transition: all 0.2s ease;
                min-height: 90px;
            }
            
            .brand-btn:hover {
                border-color: #8b1109;
                background: #fef1f1;
            }
            
            .brand-btn.active {
                border-color: #8b1109;
                background: #fef1f1;
            }
            
            .brand-icon {
                font-size: 1.5rem;
                margin-bottom: 0.25rem;
            }
            
            .brand-logo {
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
            }
            
            .brand-logo img {
                max-height: 100%;
                max-width: 100%;
                object-fit: contain;
            }
            
            /* Select Dropdown */
            .setting-select {
                width: 100%;
                padding: 0.75rem;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                font-size: 0.9375rem;
                background: white;
                cursor: pointer;
                transition: border-color 0.2s ease;
            }
            
            .setting-select:focus {
                outline: none;
                border-color: #3b82f6;
            }
            
            /* Tone Selector */
            .tone-selector {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 0.5rem;
            }
            
            .tone-btn {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 0.75rem;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                background: white;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .tone-btn:hover {
                border-color: #8b1109;
                background: #fef1f1;
            }
            
            .tone-btn.active {
                border-color: #8b1109;
                background: #fef1f1;
            }
            
            .tone-icon {
                font-size: 1.25rem;
            }
            
            .tone-text {
                font-size: 0.875rem;
                font-weight: 500;
            }
            
            /* Number Selector */
            .number-selector {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .minus-btn, .plus-btn {
                width: 36px;
                height: 36px;
                border: 2px solid #e2e8f0;
                border-radius: 50%;
                background: white;
                font-size: 1.125rem;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .minus-btn:hover, .plus-btn:hover {
                border-color: #8b1109;
                background: #fef1f1;
            }
            
            .number-input {
                width: 60px;
                text-align: center;
                padding: 0.5rem;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                font-size: 1.125rem;
                font-weight: 500;
            }
            
            .setting-hint {
                margin-top: 0.5rem;
                font-size: 0.8125rem;
                color: #64748b;
            }
            
            /* Toggle Switch */
            .setting-toggle {
                display: flex;
                align-items: center;
                cursor: pointer;
            }
            
            .toggle-input {
                display: none;
            }
            
            .toggle-slider {
                width: 48px;
                height: 24px;
                background: #e2e8f0;
                border-radius: 12px;
                position: relative;
                transition: background 0.3s ease;
                margin-right: 0.75rem;
            }
            
            .toggle-slider::after {
                content: '';
                position: absolute;
                top: 2px;
                left: 2px;
                width: 20px;
                height: 20px;
                background: white;
                border-radius: 50%;
                transition: transform 0.3s ease;
            }
            
            .toggle-input:checked + .toggle-slider {
                background: #8b1109;
            }
            
            .toggle-input:checked + .toggle-slider::after {
                transform: translateX(24px);
            }
            
            .toggle-label {
                display: flex;
                flex-direction: column;
            }
            
            .toggle-text {
                font-weight: 500;
                color: #334155;
            }
            
            .toggle-hint {
                font-size: 0.8125rem;
                color: #64748b;
            }
            
            /* Advanced Section */
            .advanced-section {
                margin-top: 1.5rem;
                padding-top: 1.5rem;
                border-top: 1px solid #e2e8f0;
            }
            
            .advanced-toggle {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                width: 100%;
                padding: 0.5rem;
                background: none;
                border: none;
                cursor: pointer;
                font-weight: 500;
                color: #64748b;
            }
            
            .advanced-toggle:hover {
                color: #334155;
            }
            
            .toggle-icon {
                transition: transform 0.2s ease;
            }
            
            .advanced-toggle.open .toggle-icon {
                transform: rotate(90deg);
            }
            
            .advanced-content {
                margin-top: 1rem;
            }
            
            /* Action Buttons */
            .quick-actions {
                display: flex;
                gap: 0.75rem;
                margin-top: 2rem;
            }
            
            .action-btn {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                padding: 0.875rem 1.5rem;
                border: none;
                border-radius: 8px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .action-btn.primary {
                background: #8b1109;
                color: white;
            }
            
            .action-btn.primary:hover {
                background: #6b0d07;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(139, 17, 9, 0.3);
            }
            
            .action-btn.secondary {
                background: #f1f5f9;
                color: #64748b;
            }
            
            .action-btn.secondary:hover {
                background: #e2e8f0;
            }
            
            .btn-icon {
                font-size: 1.125rem;
            }
            
            /* Status Message */
            .status-message {
                margin-top: 1rem;
                padding: 0.75rem 1rem;
                border-radius: 8px;
                font-size: 0.875rem;
                text-align: center;
            }
            
            .status-message.success {
                background: #d1fae5;
                color: #065f46;
            }
            
            .status-message.error {
                background: #fee2e2;
                color: #991b1b;
            }
            
            .status-message.info {
                background: #dbeafe;
                color: #1e40af;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Brand selection
        this.element.querySelectorAll('.brand-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.element.querySelectorAll('.brand-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.settings.brand = btn.dataset.brand;
                this.trigger('brandChange', this.settings.brand);
            });
        });
        
        // Campaign type
        this.element.querySelector('#campaign-type').addEventListener('change', (e) => {
            this.settings.campaign = e.target.value;
            this.trigger('campaignChange', this.settings.campaign);
        });
        
        // Tone selection
        this.element.querySelectorAll('.tone-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.element.querySelectorAll('.tone-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.settings.tone = btn.dataset.tone;
                this.trigger('toneChange', this.settings.tone);
            });
        });
        
        // Number selector
        const numberInput = this.element.querySelector('.number-input');
        this.element.querySelector('.minus-btn').addEventListener('click', () => {
            const current = parseInt(numberInput.value);
            if (current > 1) {
                numberInput.value = current - 1;
                this.settings.numResults = current - 1;
                this.updateNumberHint();
            }
        });
        
        this.element.querySelector('.plus-btn').addEventListener('click', () => {
            const current = parseInt(numberInput.value);
            if (current < 10) {
                numberInput.value = current + 1;
                this.settings.numResults = current + 1;
                this.updateNumberHint();
            }
        });
        
        numberInput.addEventListener('change', (e) => {
            const value = Math.max(1, Math.min(10, parseInt(e.target.value) || 3));
            numberInput.value = value;
            this.settings.numResults = value;
            this.updateNumberHint();
        });
        
        // Emoji toggle
        this.element.querySelector('#emoji-toggle').addEventListener('change', (e) => {
            this.settings.useEmojis = e.target.checked;
            this.trigger('emojiChange', this.settings.useEmojis);
        });
        
        // Advanced toggle
        const advancedToggle = this.element.querySelector('.advanced-toggle');
        const advancedContent = this.element.querySelector('.advanced-content');
        advancedToggle.addEventListener('click', () => {
            const isOpen = advancedContent.style.display !== 'none';
            advancedContent.style.display = isOpen ? 'none' : 'block';
            advancedToggle.classList.toggle('open', !isOpen);
        });
        
        // AI Model
        this.element.querySelector('#ai-model').addEventListener('change', (e) => {
            this.settings.aiModel = e.target.value;
        });
        
        // Action buttons
        this.element.querySelector('#generate-btn').addEventListener('click', () => {
            this.trigger('generate', this.settings);
        });
        
        this.element.querySelector('#reset-btn').addEventListener('click', () => {
            this.reset();
            this.trigger('reset');
        });
    }
    
    /**
     * Update number hint text
     */
    updateNumberHint() {
        const hint = this.element.querySelector('.setting-hint');
        const num = this.settings.numResults;
        hint.textContent = `We'll create ${num} different version${num > 1 ? 's' : ''}`;
    }
    
    /**
     * Show status message
     */
    showStatus(message, type = 'info') {
        const statusEl = this.element.querySelector('#status-message');
        statusEl.textContent = message;
        statusEl.className = `status-message ${type}`;
        statusEl.style.display = 'block';
        
        setTimeout(() => {
            statusEl.style.display = 'none';
        }, 3000);
    }
    
    /**
     * Register event callback
     */
    on(event, callback) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [];
        }
        this.callbacks[event].push(callback);
    }
    
    /**
     * Trigger event
     */
    trigger(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event].forEach(cb => cb(data));
        }
    }
    
    /**
     * Reset to default settings
     */
    reset() {
        // Reset UI
        this.element.querySelector('[data-brand="Olive Garden"]').click();
        this.element.querySelector('#campaign-type').value = '';
        this.element.querySelector('[data-tone="friendly"]').click();
        this.element.querySelector('.number-input').value = 3;
        this.element.querySelector('#emoji-toggle').checked = false;
        
        // Reset settings
        this.settings = {
            brand: 'Olive Garden',
            campaign: null,
            tone: 'friendly',
            numResults: 3,
            useEmojis: false,
            aiModel: this.options.defaultModel,
            temperature: 0.8,
            topP: 0.7,
            frequencyPenalty: 0,
            presencePenalty: 0
        };
        
        this.updateNumberHint();
        this.showStatus('Settings reset to defaults', 'info');
    }
    
    /**
     * Get current settings
     */
    getSettings() {
        return { ...this.settings };
    }
    
    /**
     * Update settings programmatically
     */
    updateSettings(newSettings) {
        Object.assign(this.settings, newSettings);
        // Update UI to reflect new settings
        // ... implementation
    }
}

// Export factory function
export function createSimplifiedSettings(container, options = {}) {
    const settings = new SimplifiedSettings(options);
    const element = settings.create();
    container.appendChild(element);
    return settings;
}