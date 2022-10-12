#include <ESP8266WiFi.h> // Wifi 라이브러리 추가
#include <PubSubClient.h> // MQTT client 라이브러리 

#define ledPin1 4
#define ledPin2 16
#define ledPin3 14

//----------------------------------------------------------------

const char* ssid = "koss"; //사용하는 Wifi 이름
const char* password = "a123456789!"; // 비밀번호
const char* mqtt_server = "43.200.4.58"; // MQTT broker ip
const char* clientName = "ledController"; // client 이름

WiFiClient espClient; // 인터넷과 연결할 수 있는 client 생성
PubSubClient client(espClient); // 해당 client를 mqtt client로 사용할 수 있도록 설정

//-----------------------------------------------------------------

int ledState1 = LOW;
int previous1 = LOW;
//int ledPin1 = 4;
int swPin1 = 0;

int ledState2 = LOW;
int previous2 = LOW;
//int ledPin2 = 16;
int swPin2 = 5;

int ledState3 = LOW;
int previous3 = LOW;
//int ledPin3 = 14;
int swPin3 = 12;

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

//------------------------------------------------------------------

void ledSet(int ledPin, int swPin){
  pinMode(ledPin, OUTPUT); // LED 핀 번호 설정
  pinMode(swPin, INPUT_PULLUP); // Tact 스위치 핀 번호 설정
}

//--------------------------------------------------------------------

void reconnect() {
  //연결될 때까지 시도
  while (!client.connected())
  {
    Serial.print("Attempting MQTT connection...");
    if (client.connect(clientName))
    {
      //연결 성공e default branch is considered the “base” branch in your repository, against which all pull requests and code commits are automatically made, unless you specify a different branch
      Serial.println("connected");
      client.subscribe("control/led"); // led 토픽 구독
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

//-------------------------------------------------------------------

void callback(char* topic, byte* payload, unsigned int uLen) {
  char message[uLen];
  int i;
  for(i = 0; i < uLen; i++){message[i]=(char)payload[i];}

  Serial.print("Subscribe ");
  Serial.print(topic);
  Serial.print(": ");
  Serial.println(message); // 1 or 0

  sscanf(message, "{ledState1: %d, ledState2: %d, ledState3: %d}", &ledState1, &ledState2, &ledState3);
  Serial.println(message);
  Serial.println(ledState1);
  Serial.println(ledState2);
  Serial.println(ledState3);
}

//------------------------------------------------------------------

int ledControl(int ledPin, int swPin, int previous){
  int reading = digitalRead(swPin);
  if(reading == HIGH && previous == LOW){//버튼 인식
    
    switch (ledPin) {
      case ledPin1:
        ledState1 = 1-ledState1;
        break;
      case ledPin2:
        ledState2 = 1-ledState3;
        break;
      case ledPin3:
        ledState3 = 1-ledState3;
        break;
    }
      
    char ledMessage[100] = "";
    sprintf(ledMessage, "{'control': 'led', 'led': {'ledState1':%d, 'ledState2':%d, 'ledState3\":%d}}", ledState1, ledState2, ledState3);
    Serial.print("Publish message: ");
    Serial.println(ledMessage);
    client.publish("status/led", ledMessage); // 만든 문자열을 mqtt 서버에 publish *토픽에 숫자 XXX
  }
  return reading;
}

//--------------------------------------------------------------------

void setup(){
  Serial.begin(115200);
  setup_wifi(); //wifi 연결
  
  ledSet(ledPin1, swPin1);
  ledSet(ledPin2, swPin2);
  ledSet(ledPin3, swPin3);
  
  client.setServer(mqtt_server, 1883); //mqtt 서버와 연결(ip, 1883)
  client.setCallback(callback); //callback 함수 세팅
}

//--------------------------------------------------------------------

void loop(){
  if (!client.connected()){reconnect();} //mqtt 연결이 안되어있다면 다시 연결
  client.loop(); //연결을 계속해서 유지하고 들어오는 메시지를 확인할 수 있도록 함
  previous1 = ledControl(ledPin1, swPin1, previous1);
  previous2 = ledControl(ledPin2, swPin2, previous2);
  previous3 = ledControl(ledPin3, swPin3, previous3);
  digitalWrite(ledPin1, ledState1);
  digitalWrite(ledPin2, ledState2);
  digitalWrite(ledPin3, ledState3);
  delay(10);
}
