// @flow

import React, { Component } from 'react';
import fit from 'canvas-fit';

const n = require('noisejs');
const noise = new n.Noise(Math.random());

type Props = {};
type State = {};

const Badge = () => (
  <span className="Badge br-4 bgc-white c-coral fw-semibold ls-loose tt-uppercase ta-center">
    Beta
  </span>
);

const CurvedSectionMask = () => (
  <svg
    viewBox="0 0 1200 53"
    className="p-absolute b-0 c-offwhite z-5"
    width="100%">
    <path
      fill="currentColor"
      d="M1196.008 53H1200V0H0v44.816-8.184C159.341 14.63 311.343 2.484 456.007.196 600.122-2.084 846.789 15.518 1196.008 53z"
      transform="scale(1,-1) translate(0, -53)"
    />
  </svg>
);

const TWO_PI = Math.PI * 2;

class HomeIntro extends Component<Props, State> {
  resizeHandler: ?Function;
  size: number = 50;
  noiseZ: number;
  columns: number;
  rows: number;
  noiseField: Array<Array<Array<number>>>;
  canvas: ?HTMLCanvasElement;
  ctx: ?CanvasRenderingContext2D;

  componentDidMount() {
    const canvas = this.canvas;

    if (canvas) {
      this.ctx = canvas.getContext('2d');
      this.resizeHandler = fit(
        canvas,
        canvas.parentNode,
        window.devicePixelRatio,
      );
      this.setupGrid();
      this.setupField();
    }

    window.addEventListener('resize', this.handleResize, false);
    requestAnimationFrame(this.tick);
  }

  handleResize = () => {
    if (this.resizeHandler) {
      this.resizeHandler();
    }
    this.setupGrid();
    this.setupField();
    if (this.ctx) {
      this.renderField(this.ctx);
    }
  };

  setupGrid = () => {
    const canvas = this.canvas;

    if (canvas) {
      this.columns = Math.floor(canvas.width / this.size) + 1;
      this.rows = Math.floor(canvas.height / this.size) + 1;
    }
  };

  setupField = () => {
    noise.seed(Math.random());
    this.noiseField = Array(this.columns).fill(Array(this.rows).fill([0, 0]));
    this.noiseZ = Math.random();
  };

  renderField = (ctx: CanvasRenderingContext2D) => {
    for (let x = 0; x < this.columns; x++) {
      for (let y = 0; y < this.rows; y++) {
        const angle = noise.perlin3(x / 100, y / 100, this.noiseZ) * TWO_PI;
        const length = noise.perlin3(x / 100 + 500, y / 100, this.noiseZ);

        ctx.save();
        ctx.translate(x * this.size, y * this.size);
        ctx.rotate(angle);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, Math.max(Math.min(length * this.size, 400), 15));
        ctx.stroke();
        ctx.restore();
      }
    }
  };

  tick = () => {
    const ctx = this.ctx;

    if (ctx) {
      const canvas = ctx.canvas;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.renderField(ctx);
      this.noiseZ += 0.0008;
    }
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandler, false);
  }

  render() {
    return (
      <div className="p-relative x xd-column xj-center xa-center ta-center c-white bgc-fadedLightCoral mh-50vh">
        <svg
          className="p-absolute p-center c-coral"
          height="200"
          viewBox="0 0 286 65"
          width="1200"
          xmlns="http://www.w3.org/2000/svg">
          <g fill="currentColor" fillRule="evenodd">
            <path
              className="HomeIntro-p"
              d="m225.618243 33.7280453v-20.694051h-6.5c-1.712838 0-3.118243-1.3597733-3.118243-3.0169971 0-1.65722383 1.405405-3.0169972 3.118243-3.0169972h19.763514c1.712838 0 3.118243 1.35977337 3.118243 3.0169972 0 1.6572238-1.405405 3.0169971-3.118243 3.0169971h-6.5v20.694051c0 1.8271955-1.493243 3.2719547-3.381757 3.2719547s-3.381757-1.4447592-3.381757-3.2719547z"
            />
            <path
              className="HomeIntro-oa"
              d="m159.428571 32c-1.914656 0-3.428571-1.4571429-3.428571-3.3v-23.4c0-1.84285714 1.513915-3.3 3.428571-3.3h17.276438c2.44898 0 3.072356 1.32857143 3.072356 2.95714286s-1.380333 2.91428571-3.072356 2.91428571h-13.892393v6.08571433h11.888683c1.692022 0 3.072356 1.3285714 3.072356 2.9571428s-1.380334 2.9142857-3.072356 2.9142857h-11.888683v6.3h14.115028c1.692022 0 3.072356 1.3285715 3.072356 2.9571429s-1.380334 2.9142857-3.072356 2.9142857z"
            />
            <path
              className="HomeIntro-k"
              d="m108 43.6474719v-24.2949438c0-1.872191 1.511111-3.3525281 3.422222-3.3525281s3.422222 1.4803371 3.422222 3.3525281v10.2317416l12.622223-12.2780899c.844444-.8272472 1.688889-1.3061798 2.888889-1.3061798 1.911111 0 3.155555 1.4367978 3.155555 3.0912921 0 1.0449439-.488889 1.8286517-1.244444 2.5252809l-8.755556 8.011236 9.555556 11.755618c.533333.6530899.933333 1.3497191.933333 2.3511236 0 1.872191-1.466667 3.2654494-3.466667 3.2654494-1.333333 0-2.133333-.6530899-2.888889-1.6109551l-8.888888-11.4073033-3.911112 3.5702247v6.0955056c0 1.872191-1.511111 3.3525281-3.422222 3.3525281s-3.422222-1.4803371-3.422222-3.3525281z"
            />
            <path
              className="HomeIntro-e"
              d="m62.9569892 37c-9.2903225 0-15.9569892-6.8936464-15.9569892-15.4143646 0-8.6063536 6.7526882-15.5856354 16.0430108-15.5856354 9.2903225 0 15.9569892 6.8936464 15.9569892 15.4143646 0 8.6063536-6.7526882 15.5856354-16.0430108 15.5856354zm.0860216-6.0801105c5.3333333 0 9.032258-4.1961326 9.032258-9.3342541v-.0856354c0-5.1381215-3.7849462-9.4198895-9.1182796-9.4198895-5.3333333 0-9.032258 4.1961326-9.032258 9.3342541v.0856354c0 5.1381215 3.7849462 9.4198895 9.1182796 9.4198895z"
            />
            <path
              className="HomeIntro-t"
              d="m269.956989 65c-9.290322 0-15.956989-6.8936464-15.956989-15.4143646 0-8.6063536 6.752688-15.5856354 16.043011-15.5856354 9.290322 0 15.956989 6.8936464 15.956989 15.4143646 0 8.6063536-6.752688 15.5856354-16.043011 15.5856354zm.086022-6.0801105c5.333333 0 9.032258-4.1961326 9.032258-9.3342541v-.0856354c0-5.1381215-3.784946-9.4198895-9.11828-9.4198895-5.333333 0-9.032258 4.1961326-9.032258 9.3342541v.0856354c0 5.1381215 3.784946 9.4198895 9.11828 9.4198895z"
            />
            <path
              className="HomeIntro-ob"
              d="m2 56.7280453v-23.4560906c0-1.8271955 1.47292419-3.2719547 3.33574007-3.2719547h9.05415163c7.234657 0 11.6101083 4.2067989 11.6101083 10.2832861 0 6.9688385-5.4584838 10.5382436-12.2599278 10.5382436h-5.06859206v5.9065156c0 1.8271955-1.47292418 3.2719547-3.33574007 3.2719547-1.86281588 0-3.33574007-1.4447592-3.33574007-3.2719547zm6.67148014-11.7280453h5.28519856c3.3357401 0 5.2851986-1.9546742 5.2851986-4.5042493v-.0849858c0-2.9320114-2.0794224-4.5042493-5.4151625-4.5042493h-5.15523466z"
            />
          </g>
        </svg>
        <div className="p-absolute b-0 l-0 r-0 mb-3">
          <Badge />
        </div>
        <CurvedSectionMask />
        <canvas className="o-50p" ref={el => (this.canvas = el)}>
          Poketo
        </canvas>
      </div>
    );
  }
}

export default HomeIntro;
