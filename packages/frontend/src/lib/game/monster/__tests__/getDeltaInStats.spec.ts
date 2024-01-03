import { describe, it } from "@jest/globals";
import { DEFAULT_MONSTER_STATS } from "@tower/api";
import { cloneDeep } from "lodash-es";
import { Monster } from "../Monster";
import { MonsterStatsHandler } from "../MonsterStatsHandler";

describe("getDeltaInStats", () => {
  it("should return the delta in stats - simple", () => {
    const monsterStats = new MonsterStatsHandler({
      monsterTypeHandler: {
        getBaseStats: () => {
          return cloneDeep(DEFAULT_MONSTER_STATS);
        },
      },
    } as unknown as Monster);

    monsterStats.affectedStats = {
      test: {
        defensiveAttributes: {
          defense: 1,
          jump: 1,
          speed: 1,
          resistance: 1,
        },
      },
      test2: {
        defensiveAttributes: {
          defense: 1,
          jump: 1,
          speed: 1,
          resistance: 1,
        },
      },
    };

    expect(monsterStats._getDeltaInStats("defensiveAttributes")).toEqual({
      defense: 2,
      jump: 2,
      speed: 2,
      resistance: 2,
    });
  });

  it("should return the delta in stats - complex", () => {
    const monsterStats = new MonsterStatsHandler({
      monsterTypeHandler: {
        getBaseStats: () => {
          return cloneDeep(DEFAULT_MONSTER_STATS);
        },
      },
    } as unknown as Monster);

    monsterStats.affectedStats = {
      test: {
        defensiveAttributes: {
          defense: 1,
          jump: 1,
          speed: 1,
        },
      },
      test2: {
        offensiveAttributes: {
          collisionStrength: 1,
          aggroRange: 1,
        },
      },
    };

    expect(monsterStats._getDeltaInStats("defensiveAttributes")).toEqual({
      defense: 1,
      jump: 1,
      speed: 1,
      resistance: 0,
    });
    expect(monsterStats._getDeltaInStats("offensiveAttributes")).toEqual({
      collisionStrength: 1,
      aggroRange: 1,
    });
  });
});
