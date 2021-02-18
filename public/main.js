const connectButton = document.getElementById("connect-action");
const disconnectButton = document.getElementById("disconnect-action");
const portLogsElement = document.getElementById("port-logs");

const init = async () => {
  let port, reader;

  connectButton.addEventListener("click", async () => {
    port = await connect();

    reader = getReader(port);

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
    await disconnect(port, reader);
    portLogsElement.innerHTML = "";
  });
};

init();
