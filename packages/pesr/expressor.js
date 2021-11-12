const express = require('express');
const compress = require('compression');

const { readFileSync } = require('fs');
const { unlink, writeFile } = require('fs').promises;
const { pipeToNodeWritable } = require('react-server-dom-webpack/writer');
const path = require('path');


exports = module.exports = {
	initExpressApp: _initExpressApp
};

function _initExpressApp() {
	// Options which are passed from PESR app.
	const options = {
		build: this.build
	};

	const app = express();

	app.use(compress());
	app.use(express.json());

	app.get('/', _handleErrors(
		async function(_req, res) {

	    await _waitForWebpack(options.build.path);

	    const html = readFileSync(
	      path.resolve(options.build.path, 'index.html'),
	      'utf8'
	    );

	    // Note: this is sending an empty HTML shell, like a client-side-only app.
	    // However, the intended solution (which isn't built out yet) is to read
	    // from the Server endpoint and turn its response into an HTML stream.
	    res.send(html);
	  })
	);

	app.get('/react', function(req, res) {
	  _sendResponse(req, res, null);
	});

	app.on('error', (error) => {
		this.eventBinders.error?.call(error);
	});

	this.expressApp = app;
}

async function _waitForWebpack(buildPath) {
  while (true) {
    try {
      readFileSync(buildPath);
      return;
    } catch (err) {
      console.log(
        'Could not find webpack build output. Will retry in a second...'
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}


function _handleErrors(fn) {
  return async function(req, res, next) {
    try {
      return await fn(req, res);
    } catch (x) {
      next(x);
    }
  };
}

async function _renderReactTree(
	res,
	props
) {
  
  await _waitForWebpack(options.build.path);
  
  const manifest = readFileSync(
    path.resolve(__dirname, '../build/react-client-manifest.json'),
    'utf8'
  );

  const moduleMap = JSON.parse(manifest);
  pipeToNodeWritable(React.createElement(ReactApp, props), res, moduleMap);
}

function _sendResponse(
	req,
	res,
	redirectToId
) {
  const location = JSON.parse(req.query.location);
  
  if (redirectToId) {
    location.selectedId = redirectToId;
  }
  
  res.set('X-Location', JSON.stringify(location));
  
  _renderReactTree(res, {
    selectedId: location.selectedId,
    isEditing: location.isEditing,
    searchText: location.searchText,
  });
}
