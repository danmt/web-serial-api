const { interval, Subject, from } = rxjs;
const { map, takeUntil, concatMap } = rxjs.operators;

class LineBreakTransformer {
  constructor() {
    // A container for holding stream data until a new line.
    this.chunks = "";
  }

  transform(chunk, controller) {
    // Append new chunks to existing chunks.
    this.chunks += chunk;
    // For each line breaks in chunks, send the parsed lines out.
    const lines = this.chunks.split("\r\n");
    this.chunks = lines.pop();
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller) {
    // When the stream is closed, flush any remaining chunks out.
    controller.enqueue(this.chunks);
  }
}

const connect = async () => {
  // ESP32 vendorId and productId
  const filter = { usbVendorId: 0x10c4, usbProductId: 0xea60 };
  const port = await navigator.serial.requestPort({
    filters: [filter],
  });

  const baudRate = 115200; // ESP32 Baud Rate
  await port.open({ baudRate });
  return port;
};

const getReaderStream = (port) => {
  const textDecoder = new TextDecoderStream();
  const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
  const reader = textDecoder.readable
    .pipeThrough(new TransformStream(new LineBreakTransformer()))
    .getReader();

  return {
    reader,
    readableStreamClosed,
  };
};

const getWriterStream = (port) => {
  const textEncoder = new TextEncoderStream();
  const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
  const writer = textEncoder.writable.getWriter();

  return {
    writer,
    writableStreamClosed,
  };
};

const monitor = (reader) => {
  const destroy = new Subject();
  return interval(1).pipe(
    concatMap(() =>
      from(reader.read()).pipe(
        map(({ value, done }) => {
          if (done) {
            destroy.next();
            destroy.complete();
            reader.releaseLock();
            return null;
          }

          return value;
        })
      )
    ),
    takeUntil(destroy.asObservable())
  );
};

const disconnect = async (
  port,
  reader,
  readableStreamClosed,
  writer,
  writableStreamClosed
) => {
  reader.cancel();
  await readableStreamClosed.catch(() => {
    /* Ignore the error */
  });
  writer.close();
  await writableStreamClosed;
  await port.close();
};
