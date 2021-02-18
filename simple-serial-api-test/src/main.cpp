#include <Arduino.h>

String incoming;

TaskHandle_t ReadingTask;

void readingLoop(void *parameter);

void setup()
{
  Serial.begin(115200);
  Serial.println("During setup...");
  xTaskCreatePinnedToCore(readingLoop, "ReadingTask", 102420, NULL, 1, &ReadingTask, 0);
}

void loop()
{
  Serial.println("hello world!");
  delay(2500);
}

void readingLoop(void *parameter)
{
  for (;;)
  {
    if (Serial.available() > 0)
    {
      // read the incoming byte:
      incoming = Serial.readString();

      // say what you got:
      Serial.print("Hello: ");
      Serial.println(incoming);
    }
    delay(1);
  }

  vTaskDelay(10);
}