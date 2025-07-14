/**
 * campaign-data.js - Cheddar's campaign data for context
 * Top performing email campaigns to help guide AI generation
 */

export const CHEDDAR_CAMPAIGN_DATA = {
    metadata: {
        brand: "Cheddar's Scratch Kitchen",
        analysis_date: "2025-04-11",
        dataset_description: "Top 20 performing email campaigns ranked by composite performance score"
    },
    campaigns: [
        {
            rank: 1,
            subject_line: "Get 2 true loves for 1 low price",
            message_preview: "Valentine's Day is for pairing up HERE.",
            performance: { open_rate: 0.238, click_rate: 0.0216, composite_score: 0.0879 }
        },
        {
            rank: 2,
            subject_line: "A BIG thank you calls for BIG savings",
            message_preview: "Enjoy 15% off as our way of saying thanks.",
            performance: { open_rate: 0.219, click_rate: 0.0197, composite_score: 0.0800 }
        },
        {
            rank: 3,
            subject_line: "Sweetheart, you get 2 entrées for $22",
            message_preview: "Fall in love with our Valentine's deal.",
            performance: { open_rate: 0.201, click_rate: 0.0183, composite_score: 0.0742 }
        },
        {
            rank: 4,
            subject_line: "🎄 Holiday feast mode: ON",
            message_preview: "Order your holiday favorites for pickup!",
            performance: { open_rate: 0.195, click_rate: 0.0176, composite_score: 0.0714 }
        },
        {
            rank: 5,
            subject_line: "Your table's ready... with 20% OFF",
            message_preview: "Limited time savings on your favorites.",
            performance: { open_rate: 0.187, click_rate: 0.0171, composite_score: 0.0696 }
        }
    ]
};

/**
 * Get campaign insights for AI context
 */
export function getCampaignInsights(project) {
    if (project !== "Cheddars" && project !== "Cheddar's Scratch Kitchen") {
        return '';
    }
    
    const insights = `
Based on Cheddar's top-performing email campaigns:
- Successful subject lines often use:
  - Value propositions (2 for 1, 15% off, 20% off)
  - Emotional appeals (love, thank you, sweetheart)
  - Urgency and exclusivity
  - Holiday/seasonal themes
  - Emojis sparingly but effectively
- Best practices:
  - Keep subject lines concise (20-40 characters)
  - Lead with the offer or benefit
  - Use action-oriented language
  - Create FOMO with limited-time language
`;
    
    return insights;
}

/**
 * Format campaign data for prompt context
 */
export function formatCampaignDataForPrompt(project) {
    if (project !== "Cheddars" && project !== "Cheddar's Scratch Kitchen") {
        return '';
    }
    
    let context = '\n\nTop Performing Campaign Examples:\n';
    
    CHEDDAR_CAMPAIGN_DATA.campaigns.slice(0, 5).forEach(campaign => {
        context += `- Subject: "${campaign.subject_line}" | Preview: "${campaign.message_preview}"\n`;
    });
    
    return context;
}