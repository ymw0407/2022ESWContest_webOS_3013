# App Store
![AppStore](AppStore.png)
<br>

## 소개

Open Source OS인 webOS를 활용하여 "_LG의 Smart TV_" 와 같이 아파트에 사는 모든 세대가 하나씩은 갖고 있는 월패드를 플랫폼으로 만들어 개발자가 자유롭게 만들고 배포할 수 있는 환경을 App Store 기능을 통해 구현하고자 하였다.<br>

Home ++ 월패드의 App Store 앱 / 기능은 "_배달 도난 방지 기능_", "_CCTV 기능_", "_홈 트레이닝 도우미 기능_", "_가전 제어 기능_", "_차량 출입 스케쥴링 기능_"을 어느 Home ++ 월패드에서든 설치할 수 있게 해주는 역할을 한다. <br><br>


## System Architecture

![SystemArchitecture](SystemArchitecture.jpg)
<br><br>

## 기술 소개

AWS EC2(클라우드 서버):
- 보안 그룹의 인바운드 규칙에서 8000포트를 개방하여 포트 포워딩을 하였다. <br><br>
- Express.js(영상 스트리밍 / 파일 서버)
    - 원하는 앱을 apps/로 GET 요청을 통해 다운로드 받을 수 있다.
    - wget을 통해 Express 서버에 get 요청을 하는 구조이기 때문에, get method에 respose의 download method를 사용하여 구현할 수 있었다. 
<br>

webOS(월패드):
- ENACT(com.appstore.app)
    - enact의 Repeater를 사용하여 앱별 로고, 이름, 설명이 포함된 타일을 생성할 수 있게 만들었다. <br><br>
- Node.JS(com.appstore.app.service)
    - Node.js의 내장 모듈 중 하나인 child process의 execSync method를 사용하여 GNU의 wget 명령을 실행시켜, 앱들의 IPK를 AWS EC2의 영상 스트리밍 / 파일 서버로부터 가져왔다.
    - __com.webos.appInstallService__ 의 install method와 remove method를 통해서 설치, 삭제 기능을 구현할 수 있었다.
    - 추후, 복잡한 앱들의 초기 설정을 IPK 설치와 함께하게 개선하고자 한다.(ex. docker 설정, 파일 권한 설정 등)
<br><br>

## 개발환경 및 개발언어
- 운영체제 : Windows 11, Ubuntu 20.04.5 LTS, webOS 2.18.0
- 디바이스 구성 : Raspberry Pi 4B
- IDE : Visual Studio Code
- 개발 언어 : ENACT, Node.JS
- package manager : npm
<br><br>

## Customize
AWS EC2를 자신이 새로 만들어 쓰게 된다면, 해당 부분만을 바꿔주면 됩니다. <a href="https://github.com/ymw0407/2022ESWContest_webOS_3013/blob/master/main-AppStore/wallpad/appstore/appstore_service/luna_service.js">링크</a>
```javascript
const EC2_IP = "3.34.50.139:8000";
```
<br>

## Quick Start
ares-setup-device에서 default를 자신이 설치할 webOS의 IP로 설정하세요.
```bash
source wallpad.setup.sh
```
<br>

## 장애 요인

1. 기존에는 IPK 파일을 앱, 서비스와 함께 패키징하여 올리고자 하였으나, IPK파일은 함께 패키징 되지 않는다.<br> 
--> 외부 서버인 EC2의 Express 서버에 파일 서버를 함께 두어 wget을 통해 IPK 파일을 가져올 수 있게 하였다.
