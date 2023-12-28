export type LevelPrompt = {
  "1": string;
  "2": string;
  "3": string;
};

export type Level = keyof LevelPrompt;

export const SIZE: LevelPrompt = {
  "1": "1024x1024",
  "2": "1024x1024",
  "3": "1024x1024",
};

export interface Prompt {
  prompt: string;
  size: "1024x1024" | "1792x1024" | "1024x1792";
}

export class PromptManager {
  public static monster(monsterDescription: string, level: Level): Prompt {
    const levels: LevelPrompt = {
      "1": "Create a cute monster with simple details.",
      "2": "Create a monster with moderate details.",
      "3": "Create a fierce and menacing monster with intricate details.",
    };

    const prompt = `
    You are assisting in creating a 2D video game with water color style graphics with a dreamy feel. The images created will be used in a sprite sheet for an animation, specifically for a monster attacking the player.

    1. Keep the background pure white
    2. Make sure there's no text in the image
    3. Make the monster easy to identify and the center of the image
    4. Make sure there isn't any information on the image
    5. Make sure the image doesn't have anything else except the monster
    6. Focus the image on just the monster without any extra frames or text

    Create a single image for a ${monsterDescription} monster that can be used in a sprite sheet.

    ${levels[level]}
    `.trim();

    return {
      prompt,
      size: SIZE[level] as Prompt["size"],
    };
  }
}
