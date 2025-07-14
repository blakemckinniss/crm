// SMS Templates for common marketing scenarios
export const smsTemplates = {
    'weekend-special': {
        name: 'Weekend Special',
        icon: '🎉',
        description: 'Promote weekend deals and happy hour specials',
        templates: {
            'Olive Garden': [
                "🍝 Italian weekend feast! Unlimited soup & salad all weekend",
                "Weekend at Olive Garden! Never Ending Pasta Bowl is back. Join us!",
                "🍷 TGIF! Half-price wine bottles with any entrée today"
            ],
            'Cheddars': [
                "🧀 Weekend comfort! Kids eat free Sat-Sun with adult entrée",
                "Happy Hour extended! $3 beers & $5 apps all weekend long",
                "Sunday Funday at Cheddar's! 20% off family meals today"
            ],
            'Yardhouse': [
                "🍺 Weekend special: Half-price drafts during all games!",
                "BOGO appetizers this weekend! Perfect for the big game",
                "Late night happy hour Fri & Sat 10pm-close. See you there!"
            ]
        },
        variables: ['dayOfWeek', 'time', 'offer']
    },
    
    'new-menu': {
        name: 'New Menu Launch',
        icon: '🍽️',
        description: 'Announce new dishes or seasonal menu items',
        templates: {
            'Olive Garden': [
                "🍝 NEW! Chicken Marsala ravioli just arrived. Try it today!",
                "Fresh Italian menu alert! 5 new authentic dishes await you",
                "🥖 Introducing truffle mushroom risotto - limited time only!"
            ],
            'Cheddars': [
                "🍖 NEW BBQ menu! Smoked ribs, brisket & more. Come taste!",
                "Fresh from scratch! Try our new loaded potato soup today",
                "Just dropped: 3 new burgers including our spicy jalapeño!"
            ],
            'Yardhouse': [
                "🍕 Pizza lovers! 6 new artisan pizzas just hit our menu",
                "NEW craft cocktail menu! Unique drinks you won't find anywhere",
                "Fresh additions: Vegan bowl, keto options & gluten-free pasta!"
            ]
        },
        variables: ['dishName', 'cuisine', 'availability']
    },
    
    'loyalty-reward': {
        name: 'Loyalty Reward',
        icon: '⭐',
        description: 'Send exclusive offers to loyalty members',
        templates: {
            'Olive Garden': [
                "⭐ VIP perk! Free appetizer with entrée today. Show this SMS",
                "You've earned it! $10 off your check. Valid this week only",
                "🎁 Surprise reward! Double breadstick baskets today only"
            ],
            'Cheddars': [
                "⭐ Thanks for being loyal! Free dessert with any entrée today",
                "Special for you: 25% off your entire check. Show this text",
                "You're a star! Enjoy a complimentary appetizer on us"
            ],
            'Yardhouse': [
                "⭐ Member exclusive: Free beer flight with any entrée!",
                "Your loyalty pays off! $15 reward loaded to your account",
                "VIP access: Try our new menu items before anyone else!"
            ]
        },
        variables: ['memberName', 'rewardAmount', 'expiryDate']
    },
    
    'flash-sale': {
        name: 'Flash Sale',
        icon: '⚡',
        description: 'Time-sensitive offers to drive immediate action',
        templates: {
            'Olive Garden': [
                "⚡ FLASH SALE! 50% off all appetizers next 2 hours only!",
                "TODAY ONLY: Buy 1 entrée, get 1 FREE! Ends at 8pm",
                "🔥 3-HOUR SPECIAL: All house wines $5! Starting NOW"
            ],
            'Cheddars': [
                "⚡ QUICK! Half-price family meals TODAY 5-7pm only!",
                "FLASH: Free kids meal with each adult entrée! Next 3 hrs",
                "LIMITED TIME: 40% off everything! Today until 6pm"
            ],
            'Yardhouse': [
                "⚡ BEER FLASH SALE! All drafts $3 for next 2 hours!",
                "URGENT: 50% off all food! TODAY 3-5pm only",
                "🍺 Happy Hour EXTENDED! $2 off everything until 8pm"
            ]
        },
        variables: ['discount', 'timeLimit', 'menuItems']
    },
    
    'event': {
        name: 'Special Event',
        icon: '🎊',
        description: 'Promote holiday specials or themed events',
        templates: {
            'Olive Garden': [
                "🎊 Join our Italian Festival! House wine $5 all day",
                "Valentine's special: 3-course dinner for 2 only $60",
                "🎃 Halloween party! Kids in costume eat free Oct 31"
            ],
            'Cheddars': [
                "🦃 Thanksgiving to-go! Order your family feast by Nov 20",
                "Mother's Day brunch special! Reserve your table now",
                "🎅 Kids eat free every night in December! Ho ho ho!"
            ],
            'Yardhouse': [
                "🏈 Super Bowl HQ! Reserve your table for the big game",
                "St. Patty's celebration! Green beer & Irish specials Mar 17",
                "🎆 NYE party! Live DJ, champagne toast & midnight buffet"
            ]
        },
        variables: ['eventName', 'date', 'specialOffer']
    },
    
    'birthday': {
        name: 'Birthday Greeting',
        icon: '🎂',
        description: 'Personal birthday messages with special offers',
        templates: {
            'Olive Garden': [
                "🎂 Happy Birthday! Enjoy a FREE tiramisu on us today!",
                "It's your special day! Free appetizer with any entrée 🎉",
                "🎈 Birthday cheers! Come celebrate with complimentary dessert"
            ],
            'Cheddars': [
                "🎂 Happy Birthday! Your meal comes with a free dessert today",
                "Special day, special treat! 20% off your birthday meal",
                "🎉 It's your birthday! Enjoy a free app or dessert on us"
            ],
            'Yardhouse': [
                "🎂 Cheers to you! Free beer or dessert for your birthday",
                "Happy Birthday! First round's on us when you visit today",
                "🎈 Birthday special: Free appetizer + surprise from our team!"
            ]
        },
        variables: ['customerName', 'validityPeriod']
    },
    
    'delivery-promo': {
        name: 'Delivery & Takeout',
        icon: '🚗',
        description: 'Promote delivery and curbside pickup options',
        templates: {
            'Olive Garden': [
                "🚗 Free delivery today! Order your Italian favorites now",
                "Curbside special: 15% off all pickup orders. We'll bring it out!",
                "📱 Order ahead & skip the wait! 10% off app orders today"
            ],
            'Cheddars': [
                "🚗 Family meals to-go! Free delivery on orders $30+",
                "Quick pickup! Order online and get 20% off today only",
                "Comfort food delivered! Free sides with family meal orders"
            ],
            'Yardhouse': [
                "🚗 Game day delivery! Free with any order over $40",
                "Curbside is here! Text 'PICKUP' when you arrive",
                "📱 Order on our app, get 15% off + free delivery!"
            ]
        },
        variables: ['deliveryFee', 'minimumOrder', 'promoCode']
    }
};

// Helper function to get template by type and brand
export function getTemplate(templateType, brand, index = 0) {
    const template = smsTemplates[templateType];
    if (!template || !template.templates[brand]) {
        return null;
    }
    
    const brandTemplates = template.templates[brand];
    return brandTemplates[index % brandTemplates.length];
}

// Helper function to get all templates for a type
export function getAllTemplates(templateType) {
    return smsTemplates[templateType] || null;
}

// Helper function to generate variations based on template
export function generateVariations(templateType, brand, customValues = {}) {
    const template = smsTemplates[templateType];
    if (!template || !template.templates[brand]) {
        return [];
    }
    
    const brandTemplates = template.templates[brand];
    const variations = [];
    
    // Generate variations by substituting variables
    brandTemplates.forEach(tmpl => {
        let variation = tmpl;
        
        // Replace any variables if custom values provided
        if (template.variables && customValues) {
            template.variables.forEach(variable => {
                if (customValues[variable]) {
                    // Simple replacement - in real implementation would be more sophisticated
                    variation = variation.replace(new RegExp(variable, 'gi'), customValues[variable]);
                }
            });
        }
        
        // Add URL at the end
        variation += " >>> https://vbs.com/xxxxx";
        
        variations.push(variation);
    });
    
    return variations;
}

// Template categories for easy filtering
export const templateCategories = {
    'promotional': ['weekend-special', 'flash-sale', 'delivery-promo'],
    'loyalty': ['loyalty-reward', 'birthday'],
    'announcement': ['new-menu', 'event'],
    'seasonal': ['event'],
    'engagement': ['birthday', 'loyalty-reward']
};

// Get templates by category
export function getTemplatesByCategory(category) {
    const templateTypes = templateCategories[category] || [];
    return templateTypes.map(type => ({
        type,
        ...smsTemplates[type]
    }));
}