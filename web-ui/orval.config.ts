import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: 'http://localhost:3000/api-docs-json',
    output: {
      target: 'src/generated/api',
      httpClient: 'axios',
      client: 'react-query',
      baseUrl: 'http://localhost:3000',
      mode: 'tags-split',
      mock: false,
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});
