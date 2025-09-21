// Handle promises with no catch statements
// This should produce errors to prevent potential memory leaks
// https://github.com/mcollina/make-promises-safe
import "make-promises-safe";
// Support Source Maps
// import 'source-map-support/register'
// import './tracer' // data-dog tracer injection
// import './arborsculpt' // pino log level hot-reloading
import startServer from "./startServer";
import { connectToDatabase } from "./models/v1/connection";

import BandAServer from "./BandAServer";

// import checkDbConnection from './checkDbConnection'
import registerProcessListeners from "./registerProcessListeners";

connectToDatabase().catch(() => {
  process.exit(1);
});

const { app } = new BandAServer();

// Kick off server!
startServer(app)
  .then((server) => {
    registerProcessListeners(server);
  })
  .catch((error) => {
    // Exit program if error occurred
    console.log(error.message);
    process.exit(1);
  });
