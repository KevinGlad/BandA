import { closeDbConnection } from "./models/v1/connection";
export default function registerProcessListeners(server) {
  const stopServer = () => {
    console.log("Initiating graceful shutdown...");

    // Step 1: Close the HTTP server, allowing existing requests to finish
    server.close(async () => {
      console.log("HTTP server closed.");

      // Step 2: Disconnect from the database
      try {
        await closeDbConnection();
        console.log("MongoDB connection closed.");
        process.exit(0); // Exit with a success code
      } catch (err) {
        console.error("Error closing MongoDB connection:", err);
        process.exit(1); // Exit with an error code
      }
    });
  };

  process.on("SIGINT", stopServer);

  // SIGTERM is for process manager termination
  process.on("SIGTERM", stopServer);

  // Optional: Listen for uncaught exceptions
  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    stopServer();
  });
}
