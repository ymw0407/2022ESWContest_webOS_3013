#include <Stepper.h>
#include <WiFi.h> // Wifi 라이브러리 추가
#include <PubSubClient.h> // MQTT client 라이브러리 

// ULN2003 Motor Driver Pins
#define IN1 0
#define IN2 18
#define IN3 23
#define IN4 19
#define IN5 21
#define IN6 22
#define IN7 14
#define IN8 12
#define W_STEP 510
#define B_STEP 3125

const int stepsPerRevolution = 64;  // change this to fit the number of steps per revolution

// initialize the stepper library
Stepper window(stepsPerRevolution, IN1, IN3, IN2, IN4);
//Stepper blind(stepsPerRevolution, IN5, IN7, IN6, IN8);

const char* ssid = "koss"; //사용하는 Wifi 이름
const char* password = "a123456789!"; // 비밀번호
const char* mqtt_server = "3.34.1.95"; // MQTT broker ip
const char* clientName = "wbController"; // client 이름

WiFiClient espClient; // 인터넷과 연결할 수 있는 client 생성
PubSubClient client(espClient); // 해당 client를 mqtt client로 사용할 수 있도록 설정

int step1 = 0, step2 = 0;
//int prev1 = 0, prev2 = 0;

void setup_wifi() {
   delay(10);
   Serial.println();
   Serial.print("Connecting to ");
   Serial.println(ssid);
   WiFi.mode(WIFI_STA);
   WiFi.begin(ssid, password);
   while(WiFi.status() != WL_CONNECTED)
   {
     delay(500);
     Serial.print(".");
   }
   Serial.println("");
   Serial.println("WiFi connected");
   Serial.println("IP address: ");
   Serial.println(WiFi.localIP()); 
}

void reconnect() {
  //연결될 때까지 시도
  while (!client.connected())
  {
    Serial.print("Attempting MQTT connection...");
    if (client.connect(clientName))
    {
      //연결 성공e default branch is considered the “base” branch in your repository, against which all pull requests and code commits are automatically made, unless you specify a different branch
      Serial.println("connected");
      client.subscribe("control/blind"); // blind 토픽 구독
      client.subscribe("control/window"); // window 토픽 구독
    } 
    else 
    {
      //연결실패하면 현재 상태 출력하고 5초 후 다시 시도
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void callback(char* topic, byte* payload, unsigned int uLen) {
  char message[uLen];
  int i;
  for(i = 0; i < uLen; i++){message[i]=(char)payload[i];}

  Serial.print("Subscribe ");
  Serial.print(topic);
  Serial.print(": ");
  Serial.println(message[0]); // 1 or 0

  if((String)topic == "control/window"){
    int move_step = (W_STEP * (String(message[0]).toInt()-1)) - step1;
    Serial.print("move_step: "); Serial.println(move_step);
    window.step(move_step);
    step1 += move_step;
  }
//  else if((String)topic == "control/blind"){
//    int move_step = (B_STEP * (String(message[0]).toInt()-1)) - step2;
//    Serial.print("move_step: "); Serial.println(move_step);
//    blind.step(move_step);
//    step2 += move_step;
//  }
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  setup_wifi();

  window.setSpeed(300);
  //blind.setSpeed(300);
  
  client.setServer(mqtt_server, 1883); //mqtt 서버와 연결(ip, 1883)
  client.setCallback(callback); //callback 함수 세팅
}

void loop() {
  if (!client.connected()){reconnect();} //mqtt 연결이 안되어있다면 다시 연결
  client.loop(); //연결을 계속해서 유지하고 들어오는 메시지를 확인할 수 있도록 함
  int x = analogRead(36);
  int y = analogRead(39);
  
  if(x > 3000 && step1 >= 0){
    window.step(-1);
    step1--;
    Serial.println("X-- ");
  }
  else if(x < 1000 && step1 <= W_STEP * 4){
    window.step(1);
    step1++;
    Serial.println("X++ ");
  }
//  else if(y > 3000 && step2 >= 0){
//    blind.step(-1);
//    step2--;
//    Serial.println("y-- ");
//  }
//  else if(y < 1000 && step2 <= B_STEP * 4){
//    blind.step(1);
//    step2++;
//    Serial.println("y++ ");
//  Serial.print("X: ");
//  Serial.print(x);
//  Serial.print(" Y: ");
//  Serial.println(y);
}
