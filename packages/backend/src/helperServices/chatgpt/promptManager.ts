export type LevelPrompt = {
  "1": string;
  "2": string;
  "3": string;
};

export type Level = keyof LevelPrompt;

export type PowerType = "aura" | "enforcement" | "ranged";

export type Weapon = "sword" | "spear" | "rod" | "shield";

export interface Prompt {
  prompt: string;
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
    };
  }

  public static power(
    elementDescription: string,
    type: PowerType,
    level: Level,
  ): Prompt {
    const levels: LevelPrompt = {
      "1": "Create a simple attack with minimal details.",
      "2": "Create an attack with some details.",
      "3": "Create a fierce attack with intricate details.",
    };

    switch (type) {
      case "aura":
        return { prompt: this.aura(elementDescription, levels[level]) };
      case "enforcement":
        return { prompt: this.enforcement(elementDescription, levels[level]) };
      case "ranged":
        return { prompt: this.ranged(elementDescription, levels[level]) };
    }
  }

  private static aura(elementDescription: string, level: string) {
    return `
    You are assisting in creating a 2D video game with water color style graphics with a dreamy feel. The images created will be used in a sprite sheet for an animation, specifically for a character's aura elemental attack that takes the form of a sphere of particles.

    1. Keep the background simple and white
    2. Make sure there's no text in the image
    3. Make sure there is no character in the image
    4. Focus on the aura elemental attack and make it easy to animate
    5. Make sure there isn't any information on the image
    6. Make sure the image doesn't have anything else except the elemental attack
    7. Focus the image on just the attack without any extra frames or text

    Create a single image for a ${elementDescription} elemental aura attack that can be used in a sprite sheet.
    
    ${level}`.trim();
  }

  private static enforcement(elementDescription: string, level: string) {
    return `
    You are assisting in creating a 2D video game with water color style graphics with a dreamy feel. The images created will be used in a sprite sheet for an animation, specifically for a character's enforcement technique that takes the form of particles in a circle.

    1. Keep the background simple and white
    2. Make sure there's no text in the image
    3. Make sure there is no character in the image
    4. Focus on the enforcement technique and make it easy to animate
    5. Make sure there isn't any information on the image
    6. Make sure the image doesn't have anything else except the enforcement technique
    7. Focus the image on just the enforcement technique without any extra frames

    Create a single image for a ${elementDescription} elemental enforcement that can be used in a sprite sheet.

    ${level}`.trim();
  }

  private static ranged(elementDescription: string, level: string) {
    return `
    You are assisting in creating a 2D video game with water color style graphics with a dreamy feel. The images created will be used in a sprite sheet for an animation, specifically for a character's ranged elemental attack.

    1. Keep the background simple and white
    2. Make sure there's no text in the image
    3. Make sure there is no character in the image
    4. Focus on the elemental attack and make it easy to animate
    5. Make sure there isn't any information on the image
    6. Make sure the image doesn't have anything else except the elemental attack
    7. Focus the image on just the attack and without any extra frames

    Create a single image for a ${elementDescription} elemental ball attack that can be used in a sprite sheet.
    
    ${level}`.trim();
  }

  public static weapon(
    weaponType: Weapon,
    weaponDescription: string,
    level: Level,
  ): Prompt {
    const levels: LevelPrompt = {
      "1": "Create a weapon with simple details.",
      "2": "Create a weapon with moderate details.",
      "3": "Create a fierce looking weapon with intricate details.",
    };

    const prompt = `
    You are assisting in creating a 2D video game with water color style graphics with a dreamy feel. The images created will be used in a sprite sheet for an animation, specifically for the weapons a character can pick up, which takes the form of either a sword, a spear, or a rod.

    1. Keep the background simple and white
    2. Make sure there’s no text in the image
    3. Make sure there is no character in the image
    4. Make the weapon easy to animate
    5. Make sure there isn’t any information on the image
    6. Make sure the image doesn’t have anything else except the weapon
    7. Focus the image on just the weapon without any extra frames

    Create a single image for a ${weaponDescription} ${weaponType} that can be used in a sprite sheet.
    
    ${levels[level]}`.trim();

    return {
      prompt,
    };
  }
}
