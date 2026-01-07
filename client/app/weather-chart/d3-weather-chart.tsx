import * as d3 from "d3";
import { Delaunay } from "d3-delaunay";

export interface DataPoint {
  x: Date;
  y: number;
}

export interface D3WeatherChartProps {
  container: HTMLElement;
  units: string;
  colorScale: d3.ScaleLinear<string, string, never>;
  setTooltip: (point: DataPoint) => void;
}

export class D3WeatherChart {
  setTooltip: (point: DataPoint) => void;
  units: string;
  colorScale: d3.ScaleLinear<string, string, never>;

  private readonly _offset = {
    top: 33,
    right: 31,
    bottom: 33,
    left: 31,
  } as const;

  private _container: d3.Selection<HTMLElement, unknown, null, undefined>;
  private _mainCanvas: HTMLCanvasElement;
  private _hoverCanvas: HTMLCanvasElement;
  private _tooltip: HTMLElement;
  private _mainCtx: CanvasRenderingContext2D;
  private _hoverCtx: CanvasRenderingContext2D;

  private _color: { text: string; bg: string } | null = null;
  private _scale: {
    sX: d3.ScaleTime<number, number>;
    sY: d3.ScaleLinear<number, number>;
  } | null = null;
  private _zoomScale: {
    sX: d3.ScaleTime<number, number>;
    sY: d3.ScaleLinear<number, number>;
  } | null = null;

  private _data: DataPoint[] = [];

  private _hoveredPoint: DataPoint | null = null;

  private _subscriptions: (() => void)[] = [];
  private _initialized = false;
  private _delaunay: d3.Delaunay<DataPoint> | null = null;

  constructor({
    container,
    units,
    colorScale,
    setTooltip,
  }: D3WeatherChartProps) {
    this.setTooltip = setTooltip;
    this.units = units;
    this.colorScale = colorScale;
    this._container = d3.select(container);

    // Ensure we select or create canvases
    this._mainCanvas =
      this._container.select<HTMLCanvasElement>("canvas").node() ??
      this._container.append("canvas").node()!;

    this._hoverCanvas =
      this._container.select<HTMLCanvasElement>("canvas ~ canvas").node() ??
      this._container.append("canvas").node()!;

    this._tooltip = this._container.select<HTMLElement>("div").node()!;

    this._mainCtx = this._mainCanvas.getContext("2d")!;
    this._hoverCtx = this._hoverCanvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    // 3. Normalize the coordinate system
    this._mainCtx.scale(dpr, dpr);
    this._hoverCtx.scale(dpr, dpr);

    this._resizeCanvas();

    const mouseMove = this._onMouseMove.bind(this);
    const mouseLeave = this._onMouseLeave.bind(this);

    this._hoverCanvas.addEventListener("mousemove", mouseMove);
    this._hoverCanvas.addEventListener("mouseleave", mouseLeave);

    const resizeObserver = new ResizeObserver(() => {
      this._resizeCanvas();

      if (this._initialized) {
        this.draw(this._data);
      }
    });
    resizeObserver.observe(container);

    this._subscriptions.push(() => {
      this._hoverCanvas.removeEventListener("mousemove", mouseMove);
      this._hoverCanvas.removeEventListener("mouseleave", mouseLeave);
      resizeObserver.disconnect();
    });
  }

  draw(data: DataPoint[]): void {
    this._data = data;
    const { width, height } = this._canvasSize();

    const style = getComputedStyle(document.documentElement);
    this._color = {
      text: style.getPropertyValue("--text-color").trim(),
      bg: style.getPropertyValue("--bg-color").trim(),
    };

    // Calculate Limits
    const minVirtualWidth = data.length * 0.7;
    const virtualWidth = Math.max(width, minVirtualWidth);

    // Extent can return undefined if data is empty, handle safety
    const [minX, maxX] = d3.extent(data, (d) => d.x);
    const [minY, maxY] = d3.extent(data, (d) => d.y);

    if (!minX || !maxX || minY === undefined || maxY === undefined) return;

    this._scale = {
      sX: d3
        .scaleTime()
        .domain([minX, maxX])
        .range([this._offset.left, virtualWidth - this._offset.right]),
      sY: d3
        .scaleLinear()
        .domain([minY, maxY])
        .range([height - this._offset.bottom, this._offset.top]),
    };

    const zoom = d3
      .zoom<HTMLElement, unknown>()
      .scaleExtent([1, 10])
      .translateExtent([
        [0, 0],
        [virtualWidth, height],
      ])
      .on("zoom", (event: d3.D3ZoomEvent<HTMLElement, unknown>) => {
        if (!this._scale) return;
        const transform = event.transform;

        this._zoomScale = {
          sX: transform.rescaleX(this._scale.sX),
          sY:
            maxY - minY !== 0
              ? transform.rescaleY(this._scale.sY)
              : this._scale.sY,
        };

        this._delaunay = null;

        this._drawChart();
        this._drawHover();
      });

    this._container.call(zoom);

    // Initial Zoom State
    let transform = d3.zoomIdentity.translate(width - virtualWidth, 0).scale(1);

    if (this._initialized) {
      const currentT = d3.zoomTransform(this._container.node()!);
      const safeMinX = Math.min(0, width - virtualWidth * currentT.k);
      transform = d3.zoomIdentity
        .translate(Math.max(safeMinX, Math.min(currentT.x, 0)), currentT.y)
        .scale(currentT.k);
    }

    this._zoomScale = {
      sX: transform.rescaleX(this._scale.sX),
      sY:
        maxY - minY !== 0 ? transform.rescaleY(this._scale.sY) : this._scale.sY,
    };

    this._initialized = true;
    this._container.call(zoom.transform, transform);
  }

  destroy(): void {
    this._subscriptions.forEach((sub) => sub());
  }

  private _drawChart(): void {
    if (!this._zoomScale || !this._scale || !this._color) return;
    const { sX, sY } = this._zoomScale;
    const { width, height } = this._canvasSize();
    const transform = d3.zoomTransform(this._container.node()!);

    this._hoveredPoint = null;
    this._tooltip.style.display = "none";

    this._mainCtx.clearRect(0, 0, width, height);

    // Clip area
    this._mainCtx.save();
    this._mainCtx.beginPath();
    this._mainCtx.rect(0, 0, width, height);
    this._mainCtx.clip();

    const [minY, maxY] = d3.extent(this._data, (d) => d.y);

    // 1. Create Vertical Gradient for the Line
    // We map the gradient to the Y-coordinates of our temperature range
    const y0 = this.colorScale.domain().at(1)!;
    const y1 = this.colorScale.domain().at(-2)!;

    if (minY === maxY) {
      this._mainCtx.strokeStyle = this.colorScale(maxY!);
    } else {
      const gradient = this._mainCtx.createLinearGradient(0, sY(y0), 0, sY(y1));

      this.colorScale.domain().forEach((t) => {
        if (t === -Infinity || t === Infinity) return;

        // Offset must be between 0 and 1
        const offet = (t - y0) / (y1 - y0);
        if (offet >= 0 && offet <= 1) {
          gradient.addColorStop(offet, this.colorScale(t));
        }
      });

      this._mainCtx.strokeStyle = gradient;
    }

    // 2. Draw the Line (Single Path = High Performance)
    this._mainCtx.beginPath();
    this._mainCtx.lineWidth = Math.min(1.35 + transform.k * 0.15, 2);
    this._mainCtx.lineJoin = "round"; // Smoother corners

    const lineGen = d3
      .line<DataPoint>()
      .x((d) => sX(d.x))
      .y((d) => sY(d.y))
      .curve(d3.curveLinear) // or curveMonotoneX for smoother look
      .context(this._mainCtx);

    lineGen(this._data);
    this._mainCtx.stroke();

    // 3. Draw Points & Labels (Using your deterministic anchor logic)
    const interval = this._getPointInterval(transform);

    // Pre-calculate p0X for your anchor logic
    const p0X = this._scale.sX(this._data.at(-1)!.x);
    let lastPx = p0X;
    let prevSlot = 0;

    for (let i = this._data.length - 1; i >= 0; i--) {
      const d = this._data[i];

      const xPix = sX(d.x);
      const yPix = sY(d.y);

      const pX = this._scale!.sX(d.x);
      const nextSlot = Math.floor((p0X - pX) / interval) + 1;
      const shouldDrawPoint =
        prevSlot === 0 || (nextSlot > prevSlot && lastPx - pX > interval);

      if (shouldDrawPoint) {
        lastPx = pX;
        prevSlot = nextSlot;
      }

      // Skip off-screen points
      if (xPix < -20 || xPix > width + 20) continue;

      if (shouldDrawPoint) {
        this._drawPoint(d, { xPix, yPix });
      }

      // Always highlight Min/Max
      if (d.y === minY || d.y === maxY) {
        this._drawCircle(xPix, yPix, d.y, true);
      }
    }

    this._mainCtx.restore();
  }

  // Helper for drawing circles to avoid code duplication
  private _drawCircle(x: number, y: number, temp: number, stroke: boolean) {
    this._mainCtx.fillStyle = this.colorScale(temp);
    this._mainCtx.beginPath();
    this._mainCtx.arc(x, y, 6, 0, 2 * Math.PI);
    this._mainCtx.fill();
    if (stroke) {
      this._mainCtx.strokeStyle = this._color!.text;
      this._mainCtx.lineWidth = 1;
      this._mainCtx.stroke();
    }
  }

  private _drawPoint(d: DataPoint, pos: { xPix: number; yPix: number }): void {
    if (!this._color) return;
    const { xPix, yPix } = pos;

    // Draw dot
    this._mainCtx.strokeStyle = this._color.text;
    this._mainCtx.fillStyle = this._color.bg; // hollow dot look
    this._mainCtx.lineWidth = 1;

    this._mainCtx.beginPath();
    this._mainCtx.arc(xPix, yPix, 4, 0, 2 * Math.PI);
    this._mainCtx.fill();
    this._mainCtx.fillStyle = this.colorScale(d.y);
    this._mainCtx.fill();
    this._mainCtx.stroke();

    // Draw Text with outline (halo) for readability
    this._mainCtx.textAlign = "center";
    this._mainCtx.font = "800 1rem sans-serif";

    // Halo
    this._mainCtx.strokeStyle = this._color.bg;
    this._mainCtx.lineWidth = 5;
    this._mainCtx.strokeText(d.y.toFixed(1) + this.units, xPix, yPix - 20);

    // Text
    this._mainCtx.fillStyle = this._color.text;
    this._mainCtx.fillText(d.y.toFixed(1) + this.units, xPix, yPix - 20);

    // Time Label
    this._mainCtx.font = "1rem sans-serif";
    this._mainCtx.strokeText(d3.timeFormat("%H:%M")(d.x), xPix, yPix + 30);
    this._mainCtx.fillText(d3.timeFormat("%H:%M")(d.x), xPix, yPix + 30);
  }

  private _onMouseMove(event: MouseEvent): void {
    if (!this._zoomScale) return;
    const { sX, sY } = this._zoomScale;
    const rect = this._hoverCanvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    this._hoveredPoint = null;
    this._tooltip.style.display = "none";
    this._delaunay ??= Delaunay.from(
      this._data,
      (d) => sX(d.x),
      (d) => sY(d.y)
    );

    // Find the index of the closest point in 2D space
    const index = this._delaunay.find(mouseX, mouseY);

    if (index !== -1) {
      const d = this._data[index];
      const xPix = sX(d.x);
      const yPix = sY(d.y);
      const dist = Math.sqrt((mouseX - xPix) ** 2 + (mouseY - yPix) ** 2);

      if (dist < 50) {
        this._hoveredPoint = d;
        this._updateTooltip(d, xPix, yPix);
      }
    }

    this._drawHover();
  }

  private _updateTooltip(d: DataPoint, x: number, y: number) {
    this._tooltip.style.display = "block";
    this.setTooltip(d);

    const tRect = this._tooltip.getBoundingClientRect();
    const canvasWidth = parseFloat(this._mainCanvas.style.width);
    const canvasHeight = parseFloat(this._mainCanvas.style.height);

    this._tooltip.style.left = `${Math.min(x + 10, canvasWidth - tRect.width)}px`;
    this._tooltip.style.top = `${Math.min(y - tRect.height - 10, canvasHeight - tRect.height)}px`;
  }

  private _drawHover(): void {
    if (!this._zoomScale) return;
    const { sX, sY } = this._zoomScale;
    const { width, height } = this._canvasSize();
    this._hoverCtx.clearRect(0, 0, width, height);

    if (this._hoveredPoint === null) return;
    const d = this._hoveredPoint;

    const xPix = sX(d.x);
    const yPix = sY(d.y);

    // Draw Hover Circle
    this._hoverCtx.save();
    // Clip ensures we don't draw outside canvas bounds if point is on edge
    this._hoverCtx.beginPath();
    this._hoverCtx.rect(0, 0, width, height);
    this._hoverCtx.clip();

    this._hoverCtx.fillStyle = this.colorScale(d.y);
    this._hoverCtx.beginPath();
    this._hoverCtx.arc(xPix, yPix, 6, 0, 2 * Math.PI);
    this._hoverCtx.fill();

    this._hoverCtx.restore();
  }

  private _onMouseLeave(): void {
    this._hoveredPoint = null;
    this._tooltip.style.display = "none";
    this._drawHover();
  }

  private _getPointInterval(transform: { k: number }) {
    const baseInterval = 80;
    return transform.k <= 2
      ? baseInterval
      : transform.k <= 4
        ? baseInterval / 2
        : baseInterval / 4;
  }

  private _resizeCanvas(): void {
    const { width, height } = this._container.node()!.getBoundingClientRect();
    const dpi = window.devicePixelRatio || 1;

    this._hoverCanvas.width = this._mainCanvas.width = width * dpi;
    this._hoverCanvas.height = this._mainCanvas.height = height * dpi;

    this._mainCanvas.style.width = `${width}px`;
    this._mainCanvas.style.height = `${height}px`;
    this._hoverCanvas.style.width = `${width}px`;
    this._hoverCanvas.style.height = `${height}px`;

    [this._mainCtx, this._hoverCtx].forEach((ctx) => {
      ctx.scale(dpi, dpi);
    });
  }

  private _canvasSize(): { width: number; height: number } {
    const dpi = window.devicePixelRatio || 1;

    const width = this._mainCanvas.width / dpi;
    const height = this._mainCanvas.height / dpi;

    return { width, height };
  }
}
