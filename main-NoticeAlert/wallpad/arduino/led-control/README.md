# 가전제어 - LED

## 기능

- LED를 Tact Switch로 제어한다. Tact Switch가 눌리는 것만을 작동으로 인지하고, On -> Off / Off -> On으로 바꾸어준다.
- Tact Switch로 제어한 결과를(on - 1, off - 0) 각각 led1, led2, led3 라는 MQTT의 topic으로 Publish한다.
- MQTT의 subLed1, subLed2, subLed3 라는 topic을 Subscribe하여(on - 1, off - 0) LED를 각각 원격 제어할 수 있다.

## 필요한 설정
### IDE 및 라이브러리 설정
1. Arduino IDE -> 파일 -> 환경설정 -> 추가적인 보드 매니저 URLs에 http://arduino.esp8266.com/stable/package_esp8266com_index.json 추가
2. Arduino IDE -> 툴 -> 보드 -> 보드 매니저 -> esp8266 by ESP8266 Community의 2.7.4 버전을 설치
3. Arduino IDE -> 툴 -> 보드 -> ESP8266 Boards(2.7.4) -> Generic ESP8266 Module 사용
4. Arduino IDE -> 스케치 -> 라이브러리 포함하기 -> 라이브러리 관리... -> PubSubClient by Nick O'Leary의 2.8.0 버전을 설치

### 하드웨어 설정

