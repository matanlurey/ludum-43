declare const FLAGS_DIMENSIONS: {
  width: number;
  height: number;
};
declare const FLAGS_PRODUCTION: boolean;
declare const FLAGS_VERSION: string;

const div = document.querySelector('div')!;
div.style.width = `${FLAGS_DIMENSIONS.width}px`;
div.style.height = `${FLAGS_DIMENSIONS.height}px`;
div.textContent = 'Hello World';
