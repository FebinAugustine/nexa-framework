import { serve } from 'bun';
import { createNexaServer } from 'nexa-framework';

const server = createNexaServer({
    port: 3000,
    root: import.meta.dir,
    dev: true
});

console.log('🚀 NexaBlog server running on http://localhost:3000');

serve(server);
