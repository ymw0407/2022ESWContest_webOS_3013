#include <ESP8266WiFi.h> // Wifi 라이브러리 추가
#include <PubSubClient.h> // MQTT client 라이브러리 
#include <Servo.h>
#define DET 1000
#define REC 2000
#define CORRECT 3000
#define INCORRECT 4000
#define ESC 9999

//----------------------------------------------------------------

const char* ssid = "koss"; //사용하는 Wifi 이름
const char* password = "a123456789!"; // 비밀번호
const char* mqtt_server = "3.34.50.139"; // MQTT broker ip
const char* clientName = "ledController"; // client 이름

WiFiClient espClient; // 인터넷과 연결할 수 있는 client 생성
PubSubClient client(espClient); // 해당 client를 mqtt client로 사용할 수 있도록 설정
Servo servo;

//-----------------------------------------------------------------

int trigPin = 16;
int echoPin = 5;
float distance = 0;
int stat = DET;
int cnt = 0;
int threshold = 15;
int servoPin = 4;

//----------------------------------------------------------------

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

//--------------------------------------------------------------------

void reset_servo() {
    Serial.println("Servo reset...");
    servo.write(0);
    delay(2000);
    Serial.println("Servo ready!");
}

//--------------------------------------------------------------------

void reconnect() {
  //연결될 때까지 시도
  while (!client.connected())
  {
    Serial.print("Attempting MQTT connection...");
    if (client.connect(clientName))
    {
      Serial.println("connected");
      client.subscribe("car/compare");
    } 
    else 
    {
      //연결실패하면 현재 상태 출력하고 5초 후 다시 시도
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println("try again in 5 seconds");
      delay(5000);
    }
  }
}

//-------------------------------------------------------------------

void callback(char* topic, byte* payload, unsigned int uLen) {
  char pBuffer[uLen+1];
  int i;
  
  for(i = 0; i < uLen; i++) {
    pBuffer[i]=(char)payload[i];
  }
  
  Serial.println(pBuffer); // 1 or 0
  
  if((String)pBuffer == "1") {
    stat = CORRECT;
  }
  else if((String)pBuffer == "0") {
    stat = INCORRECT;
  }
}

//------------------------------------------------------------------

int getDistance(int count) { // Average Filter를 적용한 초음파 센서 
  float sum = 0;
  
  digitalWrite(trigPin, LOW);
  
  for (int i = 0; i < count; i++){
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);
    float duration = pulseIn(echoPin, HIGH);
    float range = duration * 0.017;
    if (range >= 300) {
      continue;
    }
    sum += range;
  }

  int distance = sum / count;
  Serial.print("Distance : ");
  Serial.println(distance);
  
  return (distance);
}

//------------------------------------------------------------------

void mqttPublish(char* topic, char* message) {
  Serial.print(topic);
  Serial.print(" : ");
  Serial.println(message);
  client.publish(topic, message);
}

//------------------------------------------------------------------

void setup() {
  Serial.begin(115200);
  
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  
  setup_wifi();

  servo.attach(servoPin);
  reset_servo();
  
  client.setServer(mqtt_server, 1883); //mqtt 서버와 연결(ip, 1883)
  client.setCallback(callback); //callback 함수 세팅
}

//------------------------------------------------------------------

void loop() {
  if (!client.connected()){reconnect();} //mqtt 연결이 안되어있다면 다시 연결
  
  switch (stat) {
//------------------------------------------------------------------------
    case DET: // 차량이 오기를 대기하는 상태(2초간 threshold 보다 가깝게 있어야 측정됨)
      if (getDistance(20) <= threshold) { // threshold와 거리를 비교
        Serial.println(cnt);
        if (cnt >= 5) { // 2초 동안 측정되면 REC stat으로 넘어감 & car/detect 토픽에 인식되었음을 알림
          cnt = 0;
          mqttPublish("car/detect", "recognized");
          stat = REC;
          break;
        } 
        cnt++;
      }
      else { // threshold보다 멀어지면 초기화
        cnt = 0;
      }
      delay(500);
      break;
//------------------------------------------------------------------------
    case REC: // 차가 인식된 상태(MQTT car_check 토픽의 통신을 대기하는 상태)
      client.loop(); //연결을 계속해서 유지하고 들어오는 메시지를 확인할 수 있도록 함
      break;
//------------------------------------------------------------------------
    case CORRECT: // 인식된 차가 등록되어 있는 경우 --> 차량 차단기를 열어준다
      Serial.println("Registered car");
      servo.write(90);
      stat = ESC;
      break;
//------------------------------------------------------------------------
    case INCORRECT: // 인식된 차가 등록되어있지 않는 경우 --> 차량 차단기를 열어주지 않는다.
      Serial.println("not registered car");
      servo.write(0);
      stat = ESC;
      break;
//------------------------------------------------------------------------
    case ESC:
      if (getDistance(20) >= threshold) {
        Serial.println(cnt);
        if (cnt >= 10) { // 5초 동안 측정되면 차량 차단기 초기화와 함께, DET stat으로 넘어간다.
          cnt = 0;
          stat = DET;
          reset_servo();
          break;
        } 
        cnt++;
      }
      else { // threshold보다 가까워지면 초기화
        cnt = 0;
      }
      delay(500);
      break;
//------------------------------------------------------------------------
  }
  
}
