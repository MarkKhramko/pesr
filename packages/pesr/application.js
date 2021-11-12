const { initExpressApp } = require('./expressor');


exports = module.exports = PesrApp;

function PesrApp(options={}) {
	if (!options?.build?.path) {
		throw new Error('Argument "build" with value "path" is required.');
	}

	this.build = { ...options.build };

	this.expressApp = null;
	this.reactApp = null;

	this.eventBinders = {
		error: () => {}
	}

	this.init = initExpressApp.bind(this);
	this.setReactApp = _setReactApp.bind(this);
	this.listen = _listen.bind(this);
}

function _setReactApp(
	ReactApp,
) {
	this.reactApp = ReactApp;
}

function _listen(
	port,
	callback
) {
	if (isNaN(port)) {
		throw new Error('port is a required argument');
	}

	if (!!this.express) {
		this.expressApp.listen(port, () => {
			callback();
		});
	}
}

function _on(
	eventKey,
	callback
) {
	this.eventBinders[eventKey] = callback;
}
