export class Keyboard {
  public up: Phaser.Input.Keyboard.Key;
  public down: Phaser.Input.Keyboard.Key;
  public left: Phaser.Input.Keyboard.Key;
  public right: Phaser.Input.Keyboard.Key;
  public shift: Phaser.Input.Keyboard.Key;
  public space: Phaser.Input.Keyboard.Key;

  public ranged_attack: Phaser.Input.Keyboard.Key;
  public aura_attack: Phaser.Input.Keyboard.Key;
  public enforcement: Phaser.Input.Keyboard.Key;

  public sword_attack: Phaser.Input.Keyboard.Key;
  public spear_attack: Phaser.Input.Keyboard.Key;
  public rod_attack: Phaser.Input.Keyboard.Key;

  public shield: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene) {
    if (scene.input.keyboard == null) {
      throw new Error(
        "Can only play Tower of Cultivation on a device with a keyboard",
      );
    }

    const cursorKeys = scene.input.keyboard.createCursorKeys();

    this.up = cursorKeys.up;
    this.down = cursorKeys.down;
    this.left = cursorKeys.left;
    this.right = cursorKeys.right;
    this.shift = cursorKeys.shift;
    this.space = cursorKeys.space;

    this.ranged_attack = scene.input.keyboard.addKey("q");
    this.aura_attack = scene.input.keyboard.addKey("w");
    this.enforcement = scene.input.keyboard.addKey("e");

    this.sword_attack = scene.input.keyboard.addKey("a");
    this.spear_attack = scene.input.keyboard.addKey("s");
    this.rod_attack = scene.input.keyboard.addKey("d");

    this.shield = scene.input.keyboard.addKey("z");
  }
}
