export interface Interactable {
  onInteraction: () => void;
  getBounds: () => Phaser.Geom.Rectangle;
}
