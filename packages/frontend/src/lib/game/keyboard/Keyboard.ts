export class Keyboard {
  public up: Phaser.Input.Keyboard.Key;
  public down: Phaser.Input.Keyboard.Key;
  public left: Phaser.Input.Keyboard.Key;
  public right: Phaser.Input.Keyboard.Key;
  public shift: Phaser.Input.Keyboard.Key;
  public space: Phaser.Input.Keyboard.Key;

  public attack: Phaser.Input.Keyboard.Key;

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

    this.attack = scene.input.keyboard.addKey("q");
  }
}
