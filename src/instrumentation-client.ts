import { initBotId } from 'botid/client/core';

initBotId({
  protect: [
    {
      path: '/api/status',
      method: 'GET',
    },
    {
      path: '/api/deployment-info',
      method: 'GET',
    },
  ],
});
