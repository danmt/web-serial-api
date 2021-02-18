const connectButton = document.getElementById("connect-action");
const disconnectButton = document.getElementById("disconnect-action");
const portLogsElement = document.getElementById("port-logs");

const init = async () => {
  let port, reader, readableStreamClosed, writer, writableStreamClosed;
  let isConnected = false;

  connectButton.addEventListener("click", async () => {
    port = await connect();
    isConnected = true;

    const readerStream = getReaderStream(port);
    reader = readerStream.reader;
    readableStreamClosed = readerStream.readableStreamClosed;

    const writerStream = getWriterStream(port);
    writer = writerStream.writer;
    writableStreamClosed = writerStream.writableStreamClosed;

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
    if (!isConnected) {
      return;
    }

    await disconnect(
      port,
      reader,
      readableStreamClosed,
      writer,
      writableStreamClosed
    );
    isConnected = false;
    portLogsElement.innerHTML = "";
  });
};

init();
