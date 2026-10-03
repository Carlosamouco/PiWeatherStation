# PiWeatherStation
Weather Station server running on Raspberry Pi with BME280 sensor.

## Dependencies

Use Node.js 24 LTS for development and Docker builds (Node.js 22.22 or newer is required). Install the locked dependencies with `npm ci` in `client` and `server`.

TypeScript stays on the latest 6.0 release because `typescript-eslint` requires TypeScript below 6.1. The client stays on ESLint 9 because `eslint-plugin-react` does not support ESLint 10 yet; the server uses ESLint 10. Node.js types match the Node.js 24 Docker runtime.

Validate updates with `npm run typecheck` and `npm run build` in `client`, and `npm run build` in `server`.
