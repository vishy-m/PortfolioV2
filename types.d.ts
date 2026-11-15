declare module 'three';
declare module 'vanta/dist/vanta.fog.min' {
  const FOG: (options: Record<string, unknown>) => {
    renderer: { render: (scene: unknown, camera: unknown) => void; domElement: HTMLCanvasElement };
    scene: unknown;
    camera: unknown;
    destroy: () => void;
  };
  export default FOG;
}
