const connectButton = document.getElementById("connect-action");
const disconnectButton = document.getElementById("disconnect-action");
const portLogsElement = document.getElementById("port-logs");

const init = async () => {
  let port, reader, readableStreamClosed;

  connectButton.addEventListener("click", async () => {
    port = await connect();

    const readerStream = getReaderStream(port);
    reader = readerStream.reader;
    readableStreamClosed = readerStream.readableStreamClosed;

    monitor(reader).subscribe({
      next: (message) => {
        const messageElement = document.createElement("p");
        messageElement.textContent = message;
        portLogsElement.appendChild(messageElement);
      },
      complete: () => {
        console.log("[readLoop] DONE");
      },
    });
  });

  disconnectButton.addEventListener("click", async () => {
    await disconnect(port, reader, readableStreamClosed);
    portLogsElement.innerHTML = "";
  });
};

init();
