export interface PlayerStats {
  vitality: {
    /**
     * The total hit points of the player before death.
     */
    health: number;
    /**
     * Consumed when using weapon attacks.
     */
    stamina: number;
    /**
     * Consumed when using chi attacks.
     */
    chi: number;
  };
  offensiveAttributes: {
    /**
     * Affects the damage output of all weapon attacks.
     */
    weaponStrength: number;
    /**
     * Affects the damage output of all chi attacks.
     */
    chiFocus: number;
    /**
     * Affects how much stamina and chi, weapon and chi attacks use respectively. Each stat decreases the amount of stamina/chi used by 1%.
     */
    efficiency: number;
  };
  defensiveAttributes: {
    /**
     * Affects how quickly the player regenerates their vitality stats.
     */
    recovery: number;
    /**
     * Decreases the total damage taken. Each stat decreases damage taken by 1%.
     */
    defense: number;
    /**
     * How quickly the player is able to move and how far they're able to dash.
     */
    speed: number;
  };
}
