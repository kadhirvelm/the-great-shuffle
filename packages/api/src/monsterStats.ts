export interface MonsterStats {
  vitality: {
    health: {
      current: number;
      max: number;
    };
  };
  offensiveAttributes: {
    collisionStrength: number;
    aggroRange: number;
  };
  defensiveAttributes: {
    defense: number;
    speed: number;
    jump: number;
  };
}
