# Detecting-packages

## 실행 준비

$ pip install -r requirements.txt

필요한 패키지 다운로드
(좀 많이 설치해야 함)

## 실행 방법

```bash

python detect.py --source <image or video or stream or camera> --weights best.pt

```

## 실행 결과

실행하면 객체를 인식할 이미지나 동영상을 택배 물품으로 인식한 사물에 테두리를 쳐서 함께 보여준다.

콘솔창에는 한 프레임당 인식한 객체의 라벨과 갯수, 실행 시간이 로그로 뜬다.

배달 물품이 인식되면 녹화를 시작하고 물품이 사라지면 녹화를 종료하고 영상을 저장한다. 

vids 디렉토리을 자동으로 생성하고 그 안에 녹화를 시작한 시간을 제목으로 한 mp4영상이 저장됨.
