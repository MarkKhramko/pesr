const application = require('./application');


exports = module.exports = createApplication;

function createApplication(options={}) {
	const app = new application(options);
	return app;
}
