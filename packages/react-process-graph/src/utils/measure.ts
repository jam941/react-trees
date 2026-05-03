/**
 * Measures the natural rendered size of React nodes using a hidden offscreen
 * container and ResizeObserver. Nodes with explicit width/height bypass this.
 */

export interface MeasuredSize {
  width: number;
  height: number;
}

let container: HTMLDivElement | null = null;

function getContainer(): HTMLDivElement {
  if (!container) {
    container = document.createElement('div');
    container.style.cssText =
      'position:absolute;visibility:hidden;pointer-events:none;left:-9999px;top:-9999px;';
    document.body.appendChild(container);
  }
  return container;
}

/**
 * Measures the size of a rendered element using ResizeObserver.
 * Caller is responsible for cleanup (call the returned dispose fn).
 */
export function measureElement(
  el: HTMLElement,
  onSize: (size: MeasuredSize) => void,
): () => void {
  const c = getContainer();
  c.appendChild(el);

  const ro = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;
    const { width, height } = entry.contentRect;
    if (width > 0 && height > 0) {
      onSize({ width: Math.ceil(width), height: Math.ceil(height) });
    }
  });

  ro.observe(el);

  return () => {
    ro.disconnect();
    if (el.parentNode === c) c.removeChild(el);
  };
}
