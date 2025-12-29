import * as d3 from "d3";

export interface DataPoint {
  x: Date;
  y: number;
}

export interface RealPoint extends DataPoint {
  type: "real";
}

export interface AggregatedPoint extends DataPoint {
  min: number;
  max: number;
  _slice: DataPoint[];
  type: "agg";
}

/**
 * D3WeatherChart class for rendering weather data using D3 and HTML5 Canvas
 */
export class D3WeatherChart {
  private _container: d3.Selection<HTMLElement, unknown, null, undefined>;

  private _mainCanvas: HTMLCanvasElement;
  private _hoverCanvas: HTMLCanvasElement;
  private _tooltip: HTMLElement;

  private _mainCtx: CanvasRenderingContext2D;
  private _hoverCtx: CanvasRenderingContext2D;

  private readonly _padding = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  } as const;
  private readonly _scaleOffset = {
    top: 5,
    right: 18,
    bottom: 20,
    left: 18,
  } as const;

  private _textColor!: string;
  private _bgColor!: string;
  private _fadeColor!: string;

  private readonly _hoverRadius = 6;
  private _hoveredIndex: number | null = null;
  private _visiblePoints: (AggregatedPoint | RealPoint)[] = [];
  private _xScale!: d3.ScaleTime<number, number, never>;
  private _yScale!: d3.ScaleLinear<number, number, never>;
  private _destroyHandler: (() => void) | undefined;

  private tempColor = d3
    .scaleLinear<string>()
    .domain([0, 15, 25, 35, 45])
    .range(["#2196F3", "#4CAF50", "#FFC107", "#FF5722", "#B71C1C"]);

  /**
   * Constructor for D3WeatherChart
   * @param container - The HTML element to contain the chart
   */
  constructor(
    container: HTMLElement,
    public setTooltip: (point: AggregatedPoint | RealPoint) => void
  ) {
    this._container = d3.select(container);

    this._mainCanvas =
      (this._container.select("canvas").node() as HTMLCanvasElement | null) ??
      this._container.append("canvas").node()!;

    this._hoverCanvas =
      (this._container
        .select("canvas ~ canvas")
        .node() as HTMLCanvasElement | null) ??
      this._container.append("canvas").node()!;

    this._tooltip = this._container.select("div").node() as HTMLElement;

    this._mainCtx = this._mainCanvas.getContext("2d")!;
    this._hoverCtx = this._hoverCanvas.getContext("2d")!;
  }

  /**
   * Draw the weather chart
   * @param data - Array of DataPoint objects to be rendered
   */
  draw(data: DataPoint[]): void {
    const containerRect = this._container.node()!.getBoundingClientRect();
    this._hoverCanvas.width = this._mainCanvas.width = containerRect.width;
    this._hoverCanvas.height = this._mainCanvas.height = containerRect.height;

    const style = getComputedStyle(document.documentElement);
    this._textColor = style.getPropertyValue("--text-color").trim();
    this._bgColor = style.getPropertyValue("--bg-color").trim();
    this._fadeColor = `color-mix(in srgb, ${this._textColor} 65%, transparent 35%)`;

    const width = this._mainCanvas.width;
    const height = this._mainCanvas.height;

    this._mainCtx.clearRect(0, 0, width, height);
    this._hoverCtx.clearRect(0, 0, width, height);

    const minVirtualWidth = data.length * 0.6;
    const virtualWidth = Math.max(width, minVirtualWidth);

    const xDomain = d3.extent(data, (d) => d.x);

    this._xScale = d3
      .scaleTime()
      .domain([
        xDomain[0] ?? new Date(Date.now() - 24 * 60 * 60 * 1000),
        xDomain[1] ?? new Date(),
      ])
      .range([
        this._padding.left + this._hoverRadius + this._scaleOffset.left,
        virtualWidth - this._padding.right - this._scaleOffset.right,
      ]);

    const yValues = data.map((d) => d.y);
    const yMin = d3.min(yValues) ?? 0;
    const yMax = d3.max(yValues) ?? 10;
    const yPadding = (yMax - yMin) * 0.05;

    this._yScale = d3
      .scaleLinear<number, number>()
      .domain([yMin - yPadding, yMax + yPadding])
      .range([
        height -
          this._padding.bottom -
          this._hoverRadius -
          this._scaleOffset.bottom,
        this._padding.top + this._hoverRadius + this._scaleOffset.top,
      ]);

    const zoom = d3
      .zoom<HTMLElement, unknown>()
      .scaleExtent([1, 50])
      .translateExtent([
        [0, 0], // allow full panning left/top
        [virtualWidth, height], // allow full panning right/bottom
      ])
      .on("zoom", (event: d3.D3ZoomEvent<HTMLElement, unknown>) => {
        const transform = event.transform;
        const newX = transform.rescaleX(this._xScale);
        const newY = transform.rescaleY(this._yScale);
        this._drawStatic(data, newX, newY, transform);
        this._drawHover(newX, newY);
      });

    this._container.call(zoom);

    if (!this._destroyHandler) {
      zoom.transform(
        this._container,
        d3.zoomIdentity.translate(width - virtualWidth, 0).scale(1)
      );

      const mouseMove = this._onMouseMove.bind(this);
      this._hoverCanvas.addEventListener("mousemove", mouseMove);

      const mouseLeave = this._onMouseLeave.bind(this);
      this._hoverCanvas.addEventListener("mouseleave", mouseLeave);

      const resizeObserver = new ResizeObserver(() => this.draw(data));
      resizeObserver.observe(this._container.node()!);

      this._destroyHandler = () => {
        resizeObserver.disconnect();
        this._hoverCanvas.removeEventListener("mousemove", mouseMove);
        this._hoverCanvas.removeEventListener("mouseleave", mouseLeave);
      };
    } else {
      let transform = d3.zoomTransform(this._container.node()!);
      const minX = Math.min(0, width - virtualWidth * transform.k);
      const maxX = 0;

      transform = d3.zoomIdentity
        .translate(Math.max(minX, Math.min(transform.x, maxX)), transform.y)
        .scale(transform.k);

      this._container.call(zoom.transform, transform);
    }
  }

  /**
   * Destroy the chart and clean up resources
   */
  destroy(): void {
    this._destroyHandler?.();
  }

  /**
   * Draw the static elements of the chart
   * @param data - Array of DataPoint objects
   * @param xS - X-axis scale
   * @param yS - Y-axis scale
   * @param transform - Zoom transform object
   */
  private _drawStatic(
    data: DataPoint[],
    xS: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>,
    yS: d3.ScaleLinear<number, number>,
    transform: { k: number } = { k: 1 }
  ) {
    const width = this._mainCanvas.width;
    const height = this._mainCanvas.height;

    this._hoveredIndex = null;
    this._tooltip.style.display = "none";

    this._mainCtx.clearRect(0, 0, width, height);
    // this._drawGridlines(this._mainCtx, xS as d3.ScaleTime<number, number>, yS);
    // this._drawAxes(this._mainCtx, xS as d3.ScaleTime<number, number>, yS);
    this._mainCtx.save();
    this._mainCtx.beginPath();
    this._mainCtx.rect(
      this._padding.left,
      this._padding.top,
      width - this._padding.left - this._padding.right,
      height - this._padding.top - this._padding.bottom
    );
    this._mainCtx.clip();

    /*  const interval = this._getZoomInterval(transform);
    if (interval === 1) { */
    this._visiblePoints = data.map((d) => ({ ...d, type: "real" }));
    /* } else {
      this._visiblePoints = this._aggregatePoints(data, interval);
    } */

    this._mainCtx.beginPath();
    this._mainCtx.lineWidth = 1.35 + Math.min(transform.k * 0.15, 1);
    this._mainCtx.strokeStyle = this._textColor;

    const lineGen = d3
      .line<(typeof this._visiblePoints)[0]>()
      .x((d) => xS(d.x))
      .y((d) => yS(d.y))
      .curve(d3.curveLinear)
      .context(this._mainCtx);
    /* lineGen(this._visiblePoints);
    this._mainCtx.stroke(); */

    for (let i = 0; i < data.length - 1; i++) {
      const segment = [this._visiblePoints[i], this._visiblePoints[i + 1]];

      this._mainCtx.beginPath();
      lineGen(segment);

      this._mainCtx.strokeStyle = this.tempColor(
        (data[i].y + data[i + 1].y) / 2
      );
      this._mainCtx.stroke();
    }

    const [min, max] = d3.extent(data, (d) => d.y);
    const minPoints: {
      x: number;
      y: number;
      point: RealPoint | AggregatedPoint;
    }[] = [];
    const maxPoints: {
      x: number;
      y: number;
      point: RealPoint | AggregatedPoint;
    }[] = [];

    this._visiblePoints.forEach((d, index) => {
      const xPix = xS(d.x);
      const yPix = yS(d.y);

      if (
        xPix < this._padding.left ||
        xPix > width - this._padding.right ||
        yPix < this._padding.top ||
        yPix > height - this._padding.bottom
      ) {
        return;
      }
      /* mainCtx.fillStyle = "orange"; */
      /* mainCtx.beginPath();
      mainCtx.arc(xPix, yPix, normalRadius, 0, 2 * Math.PI);
      mainCtx.fill(); */

      if ("type" in d && d.type === "agg") {
        const yMinPix = yS(d.min);
        const yMaxPix = yS(d.max);
        this._mainCtx.beginPath();
        this._mainCtx.moveTo(xPix, yMinPix);
        this._mainCtx.lineTo(xPix, yMaxPix);
        this._mainCtx.strokeStyle = "rgba(255,165,0,0.5)";
        this._mainCtx.lineWidth = 1;
        this._mainCtx.stroke();
      } else {
        this._painPoint(this._visiblePoints, index, transform, {
          x: xPix,
          y: yPix,
        });
      }

      if (d.y === min) {
        minPoints.push({ x: xPix, y: yPix, point: d });
      } else if (d.y === max) {
        maxPoints.push({ x: xPix, y: yPix, point: d });
      }
    });

    this._mainCtx.strokeStyle = this._textColor;
    this._mainCtx.lineWidth = 1;
    minPoints.forEach(({ x, y, point }) => {
      this._mainCtx.fillStyle = this.tempColor(point.y);
      this._mainCtx.beginPath();
      this._mainCtx.arc(x, y, 6, 0, 2 * Math.PI);
      this._mainCtx.fill();
      this._mainCtx.stroke();
    });

    maxPoints.forEach(({ x, y, point }) => {
      this._mainCtx.fillStyle = this.tempColor(point.y);
      this._mainCtx.beginPath();
      this._mainCtx.arc(x, y, 6, 0, 2 * Math.PI);
      this._mainCtx.fill();
      this._mainCtx.stroke();
    });

    this._mainCtx.restore();
  }

  /**
   * Draw hover effects on the chart
   * @param xS - X-axis scale
   * @param yS - Y-axis scale
   */
  private _drawHover(
    xS: d3.ScaleTime<number, number>,
    yS: d3.ScaleLinear<number, number>
  ): void {
    const width = this._mainCanvas.width;
    const height = this._mainCanvas.height;

    this._hoverCtx.clearRect(0, 0, width, height);
    if (
      this._hoveredIndex === null ||
      this._hoveredIndex < 0 ||
      this._hoveredIndex >= this._visiblePoints.length
    )
      return;

    const d = this._visiblePoints[this._hoveredIndex];
    if (!d) return;

    const xPix = xS(d.x);
    const yPix = yS(d.y);
    if (
      xPix < this._padding.left ||
      xPix > width - this._padding.right ||
      yPix < this._padding.top ||
      yPix > height - this._padding.bottom
    ) {
      this._hoveredIndex = null;
      this._tooltip.style.display = "none";
      return;
    }

    this._hoverCtx.save();
    this._hoverCtx.beginPath();
    this._hoverCtx.rect(
      this._padding.left,
      this._padding.top,
      width - this._padding.left - this._padding.right,
      height - this._padding.top - this._padding.bottom
    );
    this._hoverCtx.clip();

    this._hoverCtx.beginPath();
    this._hoverCtx.fillStyle = this.tempColor(d.y);
    this._hoverCtx.arc(xPix, yPix, this._hoverRadius, 0, 2 * Math.PI);
    this._hoverCtx.fill();
    this._hoverCtx.restore();
  }

  /**
   * Handle mouse move events
   * @param event - MouseEvent object
   */
  private _onMouseMove(event: MouseEvent): void {
    const width = this._mainCanvas.width;
    const height = this._mainCanvas.height;
    const rect = this._hoverCanvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const transform = d3.zoomTransform(this._container.node()!);
    const xS = transform.rescaleX(this._xScale);
    const yS = transform.rescaleY(this._yScale);

    this._hoveredIndex = null;
    let minDist = Infinity;

    for (let i = 0; i < this._visiblePoints.length; i++) {
      const d = this._visiblePoints[i];
      const xPix = xS(d.x);
      const yPix = yS(d.y);
      const dx = mouseX - xPix;
      const dy = mouseY - yPix;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 20 && dist < minDist) {
        this._hoveredIndex = i;
        minDist = dist;
      }
    }

    if (this._hoveredIndex !== null) {
      const d = this._visiblePoints[this._hoveredIndex];
      this._tooltip.style.display = "block";

      this.setTooltip(d);

      // Use container's offset for tooltip placement
      const tooltipRect = this._tooltip.getBoundingClientRect();

      // Position relative to container
      this._tooltip.style.left = `${Math.min(
        xS(d.x) + 10,
        width - tooltipRect.width
      )}px`;
      this._tooltip.style.top = `${Math.min(
        yS(d.y) - tooltipRect.height - 10,
        height - tooltipRect.height
      )}px`;
    } else {
      this._tooltip.style.display = "none";
    }

    this._drawHover(xS, yS);
  }

  /**
   * Handle mouse leave events
   */
  private _onMouseLeave(): void {
    this._hoveredIndex = null;
    this._tooltip.style.display = "none";
    const transform = d3.zoomTransform(this._container.node()!);
    const xS = transform.rescaleX(this._xScale);
    const yS = transform.rescaleY(this._yScale);
    this._drawHover(xS, yS);
  }

  /**
   * Draw gridlines on the chart
   * @param ctx - Canvas rendering context
   * @param xS - X-axis scale
   * @param yS - Y-axis scale
   */
  private _drawGridlines(
    ctx: CanvasRenderingContext2D,
    xS: d3.ScaleTime<number, number>,
    yS: d3.ScaleLinear<number, number>
  ): void {
    const width = this._mainCanvas.width;
    const height = this._mainCanvas.height;

    ctx.strokeStyle = this._fadeColor;
    ctx.lineWidth = 1;

    // Horizontal gridlines
    yS.ticks(10).forEach((t) => {
      const y = yS(t);
      ctx.beginPath();
      ctx.moveTo(this._padding.left, y);
      ctx.lineTo(width - this._padding.right, y);
      ctx.stroke();
    });

    // Vertical gridlines
    xS.ticks(d3.timeHour.every(2)!).forEach((t) => {
      const x = xS(t);
      if (x < this._padding.left || x > width - this._padding.right) return; // <— clamp to visible area
      ctx.beginPath();
      ctx.moveTo(x, this._padding.top);
      ctx.lineTo(x, height - this._padding.bottom);
      ctx.stroke();
    });
  }

  /**
   * Draw axes on the chart
   * @param ctx - Canvas rendering context
   * @param xS - X-axis scale
   * @param yS - Y-axis scale
   */
  private _drawAxes(
    ctx: CanvasRenderingContext2D,
    xS: d3.ScaleTime<number, number>, // already zoom-rescaled
    yS: d3.ScaleLinear<number, number>
  ): void {
    const width = this._mainCanvas.width;
    const height = this._mainCanvas.height;

    ctx.strokeStyle = this._fadeColor;
    ctx.fillStyle = this._fadeColor;
    ctx.lineWidth = 1;
    ctx.font = "12px sans-serif";

    const xTicks = xS.ticks(d3.timeHour.every(2)!); // zoomed scale
    const yTicks = yS.ticks(10);
    const yPos = height - this._padding.bottom;

    // X-axis line
    ctx.beginPath();
    ctx.moveTo(this._padding.left, yPos);
    ctx.lineTo(width - this._padding.right, yPos);
    ctx.stroke();

    ctx.textAlign = "center"; // center the label above/below the tick
    ctx.textBaseline = "top"; // vertical alignment

    xTicks.forEach((t) => {
      const x = xS(t);
      if (x < this._padding.left || x > width - this._padding.right) return; // clamp to canvas

      ctx.beginPath();
      ctx.moveTo(x, yPos);
      ctx.lineTo(x, yPos + 5);
      ctx.stroke();

      // Ensure the label stays inside the right margin
      const label = d3.timeFormat("%H:%M")(t);
      const textX = Math.min(
        Math.max(x, this._padding.left),
        width - this._padding.right
      );
      ctx.fillText(label, textX, yPos + 8);
    });

    // Y-axis ticks
    const xPos = this._padding.left;
    ctx.beginPath();
    ctx.moveTo(xPos, this._padding.top);
    ctx.lineTo(xPos, height - this._padding.bottom);
    ctx.stroke();

    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    yTicks.forEach((t) => {
      const y = yS(t);
      ctx.beginPath();
      ctx.moveTo(xPos - 5, y);
      ctx.lineTo(xPos, y);
      ctx.stroke();
      ctx.fillText(t.toString(), xPos - 8, y);
    });
  }

  /**
   * Aggregate data points based on zoom level
   * @param data - Array of DataPoint objects
   * @param intervalMinutes - Interval for aggregation in minutes
   * @returns Array of AggregatedPoint objects
   */
  private _aggregatePoints(
    data: DataPoint[],
    intervalMinutes: number
  ): AggregatedPoint[] {
    const aggregated: AggregatedPoint[] = [];
    for (let i = 0; i < data.length; i += intervalMinutes) {
      const slice = data.slice(i, i + intervalMinutes);
      const avgY = d3.mean(slice, (d) => d.y)!;
      const minY = d3.min(slice, (d) => d.y)!;
      const maxY = d3.max(slice, (d) => d.y)!;
      aggregated.push({
        x: slice[0].x,
        y: avgY,
        min: minY,
        max: maxY,
        _slice: slice,
        type: "agg",
      });
    }
    return aggregated;
  }

  /**
   * Determine the appropriate zoom interval
   * @param transform - Zoom transform object
   * @returns Zoom interval in minutes
   */
  private _getZoomInterval(transform: { k: number }): number {
    const scale = transform.k;
    if (scale < 1.3) return 30;
    if (scale < 1.7) return 15;
    if (scale < 2.3) return 10;
    if (scale < 3.5) return 5;
    if (scale < 6) return 2;
    return 1;
  }

  /**
   * Draw a point on the chart
   * @param points - Array of DataPoint objects
   * @param index - Index of the point to draw
   * @param transform - Zoom transform object
   * @param point - Point to draw
   */
  private _painPoint(
    points: DataPoint[],
    index: number,
    transform: { k: number },
    point: {
      x: number;
      y: number;
    }
  ): void {
    const { x: xPix, y: yPix } = point;
    const baseInterval = 80;

    const interval =
      transform.k <= 2
        ? baseInterval
        : transform.k <= 4
          ? baseInterval / 2
          : baseInterval / 4;

    const p0 = points[0];
    const prevP = points[index - 1];
    const currP = points[index];

    const currPoints = Math.floor(
      (this._xScale(prevP?.x ?? p0.x) - this._xScale(p0.x) - 15) / interval + 1
    );

    const expectedPoints =
      Math.floor((this._xScale(currP.x) - this._xScale(p0.x) - 15) / interval) +
      1;

    if (expectedPoints <= currPoints) {
      return;
    }

    this._mainCtx.strokeStyle = this._textColor;
    this._mainCtx.fillStyle = this._bgColor;
    this._mainCtx.font = "1rem sans-serif";
    this._mainCtx.textAlign = "center";

    this._mainCtx.fillStyle = this.tempColor(currP.y);
    this._mainCtx.lineWidth = 1;
    this._mainCtx.beginPath();
    this._mainCtx.arc(xPix, yPix, 4, 0, 2 * Math.PI);
    this._mainCtx.fill();
    this._mainCtx.stroke();

    this._mainCtx.strokeStyle = this._bgColor;
    this._mainCtx.fillStyle = this._textColor;
    this._mainCtx.lineWidth = 5;
    this._mainCtx.font = "800 1rem sans-serif";
    this._mainCtx.strokeText(currP.y.toFixed(1) + "º", xPix, yPix - 20); // text above the point
    this._mainCtx.fillText(currP.y.toFixed(1) + "º", xPix, yPix - 20); // text above the point

    this._mainCtx.font = "1rem sans-serif";
    this._mainCtx.strokeText(d3.timeFormat("%H:%M")(currP.x), xPix, yPix + 30); // text above the point
    this._mainCtx.fillText(d3.timeFormat("%H:%M")(currP.x), xPix, yPix + 30); // text above the point
  }
}
