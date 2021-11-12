// Configs:
const PESR_PORT = 8080;
// App:
const pesr = require('../../packages/pesr');
const ReactApp = require('../src/App.server');
// Utils:
const path = require('path');


const app = pesr({
	build: {
		path: path.join(__dirname, '../build'),
	}
});

app.setReactApp(ReactApp);

app.init();

app.listen(PESR_PORT, () => {
})

app.on('error', function(error) {
});
