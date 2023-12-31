export class Keyboard {
  public up: Phaser.Input.Keyboard.Key;
  public down: Phaser.Input.Keyboard.Key;
  public left: Phaser.Input.Keyboard.Key;
  public right: Phaser.Input.Keyboard.Key;
  public shift: Phaser.Input.Keyboard.Key;
  public space: Phaser.Input.Keyboard.Key;

  public chiPowerSlotA: Phaser.Input.Keyboard.Key;
  public chiPowerSlotB: Phaser.Input.Keyboard.Key;
  public chiPowerSlotC: Phaser.Input.Keyboard.Key;

  public weaponSlotA: Phaser.Input.Keyboard.Key;
  public weaponSlotB: Phaser.Input.Keyboard.Key;

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

    this.chiPowerSlotA = scene.input.keyboard.addKey("q");
    this.chiPowerSlotB = scene.input.keyboard.addKey("w");
    this.chiPowerSlotC = scene.input.keyboard.addKey("e");

    this.weaponSlotA = scene.input.keyboard.addKey("a");
    this.weaponSlotB = scene.input.keyboard.addKey("s");
  }
}
