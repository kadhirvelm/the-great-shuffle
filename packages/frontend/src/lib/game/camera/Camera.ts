export class Camera {
  public constructor(
    private scene: Phaser.Scene,
    background: Phaser.GameObjects.Image,
  ) {
    this.scene.cameras.main.setBounds(
      0,
      0,
      background.displayWidth,
      background.displayHeight,
    );
    this.scene.cameras.main.setZoom(1.25);
  }

  public followPlayer(player: Phaser.GameObjects.Sprite) {
    this.scene.cameras.main.startFollow(player);
  }
}
