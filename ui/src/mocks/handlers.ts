import { rest } from 'msw';

const data = {
  systemConfiguration: 'AQEeAB4AAAgK',
  ledConfiguration:
    'DQIAADIKADIAHgAAAAAAAAAAAAAAAAAAADIMDAwRAgAAMgoAMgAeAAAAAAAAAAAAAAAAAAAAMgwMDA4CAAAyCgAyAB4AAAAAAAAAAAAAAAAAAAAyDAwMFQIAADIKADIAHgAAAAAAAAAAAAAAAAAAADIMDAwPAgAAMgoAMgAeAAAAAAAAAAAAAAAAAAAAMgwMDBYCAAAyCgAyAB4AAAAAAAAAAAAAAAAAAAAyDAwMEAIAADIKADIAHgAAAAAAAAAAAAAAAAAAADIMDAwZAgAAMgoAMgAeAAAAAAAAAAAAAAAAAAAAMgwMDA==',
  wifiConfiguration: 'CABUZXNMaWdodAoAVGVzTGlnaHRQVwEAAQAAAAA=',
  logData: '00:00:00:000 [INFO] (src/mock) Some fake log data.\n',
  fseqList: 'test.fseq;1234;5678\nsome_mock.fseq;12;34',
};

export const handlers = [
  rest.get('/api/config/system', (_req, res, ctx) => {
    console.debug(`Get system configuration: ${data.systemConfiguration}`);
    return res(ctx.status(200), ctx.text(data.systemConfiguration));
  }),

  rest.post('/api/config/system', async (req, res, ctx) => {
    data.systemConfiguration = await req.text();
    console.debug(`Set new system configuration: ${data.systemConfiguration}`);
    return res(ctx.status(200));
  }),

  rest.get('/api/config/led', (_req, res, ctx) => {
    console.debug(`Get LED configuration: ${data.ledConfiguration}`);
    return res(ctx.status(200), ctx.text(data.ledConfiguration));
  }),

  rest.post('/api/config/led', async (req, res, ctx) => {
    data.ledConfiguration = await req.text();
    console.debug(`Set new LED configuration: ${data.ledConfiguration}`);
    return res(ctx.status(200));
  }),

  rest.get('/api/config/wifi', (_req, res, ctx) => {
    console.debug(`Get wifi configuration: ${data.wifiConfiguration}`);
    return res(ctx.status(200), ctx.text(data.wifiConfiguration));
  }),

  rest.post('/api/config/wifi', async (req, res, ctx) => {
    data.wifiConfiguration = await req.text();
    console.debug(`Set new wifi configuration: ${data.wifiConfiguration}`);
    return res(ctx.status(200));
  }),

  rest.get('/api/log/size', (_req, res, ctx) => {
    const logSize = data.logData.length * 5000;
    console.debug(`Get log size: ${logSize}`);
    return res(ctx.status(200), ctx.text(logSize.toString()));
  }),

  rest.get('/api/log', (req, res, ctx) => {
    let expandedLogData = '';
    for (let i = 0; i < 5000; i++) {
      expandedLogData = expandedLogData.concat(data.logData);
    }

    const start = parseInt(req.url.searchParams.get('start') ?? '-1');
    const count = parseInt(req.url.searchParams.get('count') ?? '-1');

    if (start < 0 || count < 0 || start + count > expandedLogData.length) {
      console.error('Invalid request to read the log, returning 400.');
      return res(ctx.status(400));
    }

    let reply = '';
    for (let i = start; i < start + count; i++) {
      reply = reply.concat(expandedLogData.charAt(i));
    }

    console.debug(`Get log with a length of ${count} bytes.`);
    return res(ctx.status(200), ctx.text(reply));
  }),

  rest.delete('/api/log', (_req, res, ctx) => res(ctx.status(200))),

  rest.post('/api/update', (_req, res, ctx) => res(ctx.status(200))),

  rest.get('/api/fseq', (_req, res, ctx) =>
    res(ctx.status(200), ctx.text(data.fseqList)),
  ),

  rest.post('/api/fseq', (_req, res, ctx) => res(ctx.status(200))),

  rest.delete('/api/fseq', (_req, res, ctx) => res(ctx.status(200))),
];
