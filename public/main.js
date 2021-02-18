const connectButton = document.getElementById("connect-action");
const disconnectButton = document.getElementById("disconnect-action");
const portLogsElement = document.getElementById("port-logs");

const init = async () => {
  let port, reader, readStreamClosed;

  connectButton.addEventListener("click", async () => {
    port = await connect();
    const streamReader = getPortStreamReader(port);
    reader = streamReader.reader;
    readStreamClosed = streamReader.readStreamClosed;

    monitor(reader).subscribe({
      next: (message) => {
        const messageElement = document.createElement("p");
        messageElement.textContent = message;
        portLogsElement.appendChild(messageElement);
      },
      complete: () => {
        console.log("[readLoop] DONE");
        reader.releaseLock();
      },
    });
  });

  disconnectButton.addEventListener("click", async () => {
    await disconnect(port, reader, readStreamClosed);
    portLogsElement.innerHTML = "";
  });
};

init();
