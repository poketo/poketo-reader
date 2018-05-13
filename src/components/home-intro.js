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
  <span className="Badge br-4 bgc-white c-coral fw-semibold ls-loose tt-uppercase ta-center">
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
  size: number = 50;
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
      this.resizeHandler = fit(
        canvas,
        canvas.parentNode,
        window.devicePixelRatio,
      );
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

  getLetterStyle = (index: number, count: number) => {
    if (this.state.hasRendered === false) {
      return { transform: 'rotate(0deg) scale(0)' };
    }

    const padding = 5;
    const size = (100 - padding * 2) / count;
    const gutter = 1;

    const scale =
      this.state.windowSizeKey === 'm' ? random(1.9, 2.1) : random(1.3, 1.5);

    return {
      top: `${random(40, 60)}%`,
      left: `${random(
        (size + gutter) * index + padding,
        (size - gutter) * (index + 1),
      )}%`,
      transform: `rotate(${random(-30, 30)}deg) scale(${scale})`,
      transitionDelay: `${index * random(40, 70)}ms`,
    };
  };

  render() {
    return (
      <div className="p-relative x xd-column xj-center xa-center ta-center c-white bgc-fadedLightCoral mh-50vh">
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
        <canvas
          className="p-relative o-50p z-2"
          ref={el => (this.canvas = el)}
        />
        <img className="p-absolute w-90p mw-500 z-1" alt="" src={background} />
        <div
          className="p-relative z-3 mw-600 w-90p mh-auto"
          style={{ height: '25vh' }}>
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
        <div className="p-absolute b-0 l-0 r-0 mb-3 z-4">
          <Badge />
        </div>
      </div>
    );
  }
}

export default HomeIntro;
