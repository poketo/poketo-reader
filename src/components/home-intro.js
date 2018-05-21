// @flow

import React, { Component } from 'react';
import fit from 'canvas-fit';
import { Noise } from 'noisejs';
import throttle from 'throttle-debounce/throttle';

import background from '../assets/intro-bg.svg';
import HomePoketoLetter from './home-poketo-letter';

const noise = new Noise(Math.random());
const random = (min, max) => Math.random() * (max - min) + min;

type Props = {};
type State = {
  windowSizeKey: 's' | 'm',
  hasRendered: boolean,
};

const Badge = () => (
  <span className="Badge br-4 bgc-white c-black fw-semibold ls-loose tt-uppercase ta-center">
    Beta
  </span>
);

const getWindowSizeKey = () => (window.innerWidth > 768 ? 'm' : 's');

const TWO_PI = Math.PI * 2;
const POKETO = [
  { key: 'a', letter: 'p' },
  { key: 'b', letter: 'o' },
  { key: 'c', letter: 'k' },
  { key: 'd', letter: 'e' },
  { key: 'e', letter: 't' },
  { key: 'f', letter: 'o' },
];

class HomeIntro extends Component<Props, State> {
  resizeHandler: ?Function;
  size: number = 45;
  noiseZ: number;
  columns: number;
  rows: number;
  noiseField: Array<Array<Array<number>>>;
  canvas: ?HTMLCanvasElement;
  ctx: ?CanvasRenderingContext2D;
  timerId: ?TimeoutID;

  state = {
    hasRendered: false,
    windowSizeKey: getWindowSizeKey(),
  };

  componentDidMount() {
    const canvas = this.canvas;

    if (canvas) {
      this.ctx = canvas.getContext('2d');
      this.resizeHandler = fit(canvas, canvas.parentNode, window.devicePixelRatio);
      this.setupGrid();
      this.setupField();
    }

    this.timerId = setTimeout(() => {
      this.setState({ hasRendered: true });
    }, 100);

    window.addEventListener('resize', this.handleResize, false);
    requestAnimationFrame(this.tick);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
  }

  handleResize = throttle(100, () => {
    if (this.resizeHandler) {
      this.resizeHandler();
    }
    this.setupGrid();
    this.setupField();
    this.setState({
      windowSizeKey: getWindowSizeKey(),
    });
    if (this.ctx) {
      this.renderField(this.ctx);
    }
  });

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
        ctx.strokeStyle = '#ff6f6f';
        ctx.lineWidth = 4;
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

  getLetterStyle = (index: number, count: number) => {
    if (this.state.hasRendered === false) {
      return { transform: 'rotate(0deg) scale(0)' };
    }

    const padding = 5;
    const size = (100 - padding * 2) / count;
    const gutter = 1;

    const scale = this.state.windowSizeKey === 'm' ? random(1.9, 2.1) : random(1.3, 1.5);

    return {
      top: `${random(30, 50)}%`,
      left: `${random((size + gutter) * index + padding, (size - gutter) * (index + 1))}%`,
      transform: `rotate(${random(-30, 30)}deg) scale(${scale})`,
      transitionDelay: `${index * random(40, 70)}ms`,
    };
  };

  render() {
    return (
      <div className="p-relative x xd-column xj-center of-hidden ta-center c-white bgc-fadedCoral mh-40vh">
        <svg viewBox="0 0 1200 53" className="p-absolute b-0 c-offwhite z-4" width="100%">
          <path
            fill="currentColor"
            d="M1196.008 53H1200V0H0v44.816-8.184C159.341 14.63 311.343 2.484 456.007.196 600.122-2.084 846.789 15.518 1196.008 53z"
            transform="scale(1,-1) translate(0, -53)"
          />
        </svg>
        <canvas className="p-relative o-50p z-1" ref={el => (this.canvas = el)} />
        <div
          className="p-absolute p-fill z-2"
          style={{
            backgroundImage: `url('data:image/svg+xml;utf8,<svg height="363" viewBox="0 0 404 363" width="404" xmlns="http://www.w3.org/2000/svg"><path d="m201.882848 360.5c40.112875 0 78.342555 7.538534 111.617152-10.5 49.64757-26.914506 86.707013-91.258107 90-165.5 1.554254-35.041364.16575-74.203903-15-100-38.500912-65.4879092-128.98711-90.75019611-214-82.5-24.327749 2.36092074-45.172494 14.5009178-65 23.5-39.0979202 17.7453183-69.2482938 45.5348782-87.8980493 79.981159-17.96099248 33.174129-25.25515049 72.522374-19.6019507 115.018841 4.37440335 32.883446 19.26438 66.524047 35 86.5 36.4238339 46.239094 95.076607 53.5 164.882848 53.5z" fill-rule="evenodd"/></svg>')`,
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '80% 140%',
          }}
        />
        <div className="p-relative z-3 mw-600 w-100p mh-auto">
          {POKETO.map((item, index) => (
            <div
              key={item.key}
              className="HomeIntro-letter"
              style={this.getLetterStyle(index, POKETO.length)}>
              <div className="HomeIntro-letterInner">
                <HomePoketoLetter letter={item.letter} />
              </div>
            </div>
          ))}
        </div>
        <div className="p-absolute b-0 l-0 r-0 mb-4 z-4">
          <Badge />
        </div>
      </div>
    );
  }
}

export default HomeIntro;
