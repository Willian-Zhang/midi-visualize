
#include <Servo.h>
#include <math.h>

Servo myservo1;  // create servo object to control a servo
Servo myservo2;  // create servo object to control a servo

int pos = 0;    
float val = 0.001;
String inString = "";
bool flag = true;

void setup() {
  Serial.begin(9600);
  myservo1.attach(9);  // attaches the servo on pin 9 to the servo object
  myservo2.attach(10);  // attaches the servo on pin 10 to the servo object
  Serial.setTimeout(50);
}

void loop() {
  
  if(Serial.available() != 0){
        inString = Serial.readString();
        char flag = inString.charAt(0);
        if(flag == 'a'){ 
          int angle = inString.substring(1).toInt();
          if(angle >= 0 && angle <= 180){
            myservo2.write(angle);
          }
          
        }else if(flag == 's'){
          int speed = inString.substring(1).toInt();
          if(speed >= 0 && speed <= 100){
            val = 0.0001 * speed;
          }
        }    
    }


    if(flag){
      pos += val;
      if(pos >= 180){
        flag = !flag; 
      }
    }else{
      pos -= val;
      if(pos <= 0){
        flag = !flag; 
      }
    }
    myservo1.write(pos);

    
}
    


