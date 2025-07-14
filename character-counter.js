// Enhanced visual character counter for SMS messages
export class CharacterCounter {
    constructor(options = {}) {
        this.options = {
            maxLength: 160,
            maxLengthWithEmoji: 40,
            warningThreshold: 0.8,
            dangerThreshold: 0.95,
            ...options
        };
        
        this.element = null;
        this.inputElement = null;
        this.useEmoji = false;
    }
    
    /**
     * Initialize the character counter on a text input/textarea
     * @param {HTMLElement} inputElement - The input or textarea element
     * @param {HTMLElement} containerElement - Container to append the counter to
     */
    init(inputElement, containerElement) {
        this.inputElement = inputElement;
        
        // Create counter HTML structure
        this.element = this.createCounterElement();
        containerElement.appendChild(this.element);
        
        // Bind event listeners
        this.inputElement.addEventListener('input', () => this.update());
        this.inputElement.addEventListener('focus', () => this.show());
        this.inputElement.addEventListener('blur', () => this.hide());
        
        // Initial update
        this.update();
    }
    
    /**
     * Create the counter element structure
     */
    createCounterElement() {
        const counter = document.createElement('div');
        counter.className = 'character-counter-container';
        counter.innerHTML = `
            <div class="character-counter">
                <div class="counter-bar">
                    <div class="counter-fill"></div>
                    <div class="counter-markers">
                        <div class="marker warning" style="left: 80%"></div>
                        <div class="marker danger" style="left: 95%"></div>
                    </div>
                </div>
                <div class="counter-info">
                    <span class="counter-text">0 / 160</span>
                    <span class="counter-status">Perfect length</span>
                </div>
                <div class="counter-tips" style="display: none;">
                    <div class="tip">💡 Keep it short and actionable</div>
                </div>
            </div>
        `;
        
        // Add styles
        this.addStyles();
        
        return counter;
    }
    
    /**
     * Add CSS styles for the counter
     */
    addStyles() {
        if (document.getElementById('character-counter-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'character-counter-styles';
        style.textContent = `
            .character-counter-container {
                margin-top: 0.5rem;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .character-counter-container.visible {
                opacity: 1;
            }
            
            .character-counter {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 1rem;
            }
            
            .counter-bar {
                position: relative;
                height: 8px;
                background: #e2e8f0;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 0.75rem;
            }
            
            .counter-fill {
                height: 100%;
                background: #10b981;
                transition: width 0.3s ease, background-color 0.3s ease;
                border-radius: 4px;
            }
            
            .counter-fill.warning {
                background: #f59e0b;
            }
            
            .counter-fill.danger {
                background: #ef4444;
            }
            
            .counter-markers {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 100%;
            }
            
            .marker {
                position: absolute;
                top: -2px;
                width: 2px;
                height: 12px;
                opacity: 0.3;
            }
            
            .marker.warning {
                background: #f59e0b;
            }
            
            .marker.danger {
                background: #ef4444;
            }
            
            .counter-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.875rem;
            }
            
            .counter-text {
                font-weight: 500;
                color: #64748b;
            }
            
            .counter-status {
                color: #10b981;
                font-weight: 500;
            }
            
            .counter-status.warning {
                color: #f59e0b;
            }
            
            .counter-status.danger {
                color: #ef4444;
            }
            
            .counter-tips {
                margin-top: 0.75rem;
                padding-top: 0.75rem;
                border-top: 1px solid #e2e8f0;
            }
            
            .tip {
                font-size: 0.8125rem;
                color: #64748b;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            /* Animation for exceeding limit */
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            .character-counter.shake {
                animation: shake 0.3s ease;
            }
            
            /* Pulse animation for perfect length */
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            .counter-status.perfect {
                animation: pulse 0.5s ease;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Update emoji mode
     * @param {boolean} useEmoji - Whether emoji mode is enabled
     */
    setEmojiMode(useEmoji) {
        this.useEmoji = useEmoji;
        this.update();
    }
    
    /**
     * Update the counter based on current input
     */
    update() {
        const text = this.inputElement.value;
        const length = text.length;
        const maxLength = this.useEmoji ? this.options.maxLengthWithEmoji : this.options.maxLength;
        const percentage = (length / maxLength) * 100;
        
        // Update counter bar
        const fill = this.element.querySelector('.counter-fill');
        fill.style.width = Math.min(percentage, 100) + '%';
        
        // Update counter text
        const counterText = this.element.querySelector('.counter-text');
        counterText.textContent = `${length} / ${maxLength}`;
        
        // Update status and colors
        const status = this.element.querySelector('.counter-status');
        const warningThreshold = this.options.warningThreshold * 100;
        const dangerThreshold = this.options.dangerThreshold * 100;
        
        // Remove animation classes
        this.element.querySelector('.character-counter').classList.remove('shake');
        status.classList.remove('perfect');
        
        if (percentage > 100) {
            fill.className = 'counter-fill danger';
            status.className = 'counter-status danger';
            status.textContent = `${length - maxLength} over limit!`;
            this.element.querySelector('.character-counter').classList.add('shake');
            this.showTips(['Try removing unnecessary words', 'Use abbreviations where appropriate']);
        } else if (percentage > dangerThreshold) {
            fill.className = 'counter-fill danger';
            status.className = 'counter-status danger';
            status.textContent = 'Almost at limit!';
            this.showTips(['Consider shortening your message']);
        } else if (percentage > warningThreshold) {
            fill.className = 'counter-fill warning';
            status.className = 'counter-status warning';
            status.textContent = 'Getting close';
            this.hideTips();
        } else if (percentage > 60 && percentage < 80) {
            fill.className = 'counter-fill';
            status.className = 'counter-status perfect';
            status.textContent = 'Perfect length! ✨';
            this.hideTips();
        } else if (percentage < 20 && length > 0) {
            fill.className = 'counter-fill';
            status.className = 'counter-status';
            status.textContent = 'Very short';
            this.showTips(['Add more details to engage customers']);
        } else {
            fill.className = 'counter-fill';
            status.className = 'counter-status';
            status.textContent = length === 0 ? 'Start typing...' : 'Good length';
            this.hideTips();
        }
        
        // Special emoji mode warnings
        if (this.useEmoji && length > this.options.maxLengthWithEmoji) {
            this.showTips(['With emojis, limit is 40 characters', 'Each emoji counts as multiple characters']);
        }
    }
    
    /**
     * Show the counter with animation
     */
    show() {
        this.element.classList.add('visible');
    }
    
    /**
     * Hide the counter with animation
     */
    hide() {
        setTimeout(() => {
            this.element.classList.remove('visible');
        }, 200);
    }
    
    /**
     * Show helpful tips
     * @param {Array<string>} tips - Array of tip messages
     */
    showTips(tips) {
        const tipsContainer = this.element.querySelector('.counter-tips');
        tipsContainer.innerHTML = tips.map(tip => `<div class="tip">💡 ${tip}</div>`).join('');
        tipsContainer.style.display = 'block';
    }
    
    /**
     * Hide tips
     */
    hideTips() {
        const tipsContainer = this.element.querySelector('.counter-tips');
        tipsContainer.style.display = 'none';
    }
    
    /**
     * Get current character count info
     */
    getInfo() {
        const text = this.inputElement.value;
        const length = text.length;
        const maxLength = this.useEmoji ? this.options.maxLengthWithEmoji : this.options.maxLength;
        
        return {
            length,
            maxLength,
            remaining: maxLength - length,
            percentage: (length / maxLength) * 100,
            isValid: length <= maxLength && length > 0,
            isEmpty: length === 0,
            isOverLimit: length > maxLength
        };
    }
    
    /**
     * Destroy the counter and clean up
     */
    destroy() {
        if (this.element) {
            this.element.remove();
        }
        this.inputElement = null;
        this.element = null;
    }
}

// Export a factory function for easy initialization
export function createCharacterCounter(inputElement, containerElement, options = {}) {
    const counter = new CharacterCounter(options);
    counter.init(inputElement, containerElement);
    return counter;
}