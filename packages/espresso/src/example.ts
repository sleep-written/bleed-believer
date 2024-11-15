import {
    Controller, ControllerPath, ControllerRouting,
    EndpointError, Espresso, Get
} from './index.js';

class MenuController extends Controller {
    @Get()
    start(): void {
        this.response.json([
            { id: 1, name: 'foo' },
            { id: 2, name: 'bar' },
        ]);
    }
}

@ControllerPath('*')
class AllController extends Controller {
    @Get()
    start(): void {
        throw new EndpointError(404, 'not-found');
    }
}

@ControllerRouting({
    controllers: [
        MenuController,
        AllController
    ]
})
class APIRouting {}

const server = await new Espresso({ lowercase: true })
    .use(APIRouting)
    .listen(8080);

console.log('Server is ready!');
await new Promise<void>(resolve => {
    server .on('close',  () => resolve());
    process.on('SIGINT', () => server.close());
});
console.log('Server is closed.');