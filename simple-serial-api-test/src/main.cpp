#include <Arduino.h>

void setup()
{
  Serial.begin(115200);
  Serial.println("during setup...");
}

void loop()
{
  Serial.println("hello world!");
  delay(1000);
}