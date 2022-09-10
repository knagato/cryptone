declare module 'replicate-js' {
  export default class Replicate {
    constructor(options?: { token?: string, proxyUrl?: string, httpClient?: any, pollingInterval?: integer });
    async callHttpClient({ url, method, event, body });
    async getModel(path);
    async getPrediction(id);
    async startPrediction(modelVersion, input);
    models: Model;
  }
  export interface ModelOptions {
    path: string, version?: string, replicate?: Replicate
  }
  export class Model {
    static async fetch(options: ModelOptions): Promise<Model>;
    constructor(options: ModelOptions);
    async getModelDetails();
    async predict(input);
    async get(path: string, version?: string): Promise<Model>;
  }
  export class DefaultFetchHTTPClient {
    constructor(token);
    async importFetch();
    async get({ url });
    async post({ url, body });
  }
};