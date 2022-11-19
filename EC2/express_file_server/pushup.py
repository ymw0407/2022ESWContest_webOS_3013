import cv2
from matplotlib import pyplot as plt
import mediapipe as mp
import numpy as np
import time
import base64
import os
import paho.mqtt.client as mqtt


def angle(a, b, c):
    a = np.array(a)  # First
    b = np.array(b)  # Mid
    c = np.array(c)  # End

    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    res = np.abs(radians * 180.0 / np.pi)

    if res > 180.0:
        res = 360 - res

    return res

os.system("rm -f resource/exercise/output/output.mp4") # 기존 영상 삭제

mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_pose = mp.solutions.pose

cap = cv2.VideoCapture('resource/exercise/input/input.mp4')
# Define the codec and create VideoWriter object. The output is stored in 'output.mp4' file.
# 재생할 파일의 넓이와 높이
width = 1280
height = 960

# print("재생할 파일 넓이, 높이 : %d, %d" % (width, height))

fourcc = cv2.VideoWriter_fourcc(*'MP4V')
out = cv2.VideoWriter('resource/exercise/progress/progress.mp4', fourcc, 30.0, (int(width), int(height)))
step = -1
cnt = 0
temp_cnt = 0
temp_time = 0
graph_y = []
start_time = 0
first = 0
with mp_pose.Pose(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5) as pose:
    while cap.isOpened():
        success, image = cap.read()
        vid_time = cap.get(cv2.CAP_PROP_POS_MSEC) / 1000
        # print(vid_time)
        if vid_time != 0:
            end_time = vid_time
            if vid_time - temp_time >= 5 and temp_time != 0:
                print(temp_cnt)
                graph_y.append(temp_cnt)
                temp_cnt = 0
                temp_time = vid_time
        if success == False:
            # If loading a video, use 'break' instead of 'continue'.
            break
        try:
            image = cv2.resize(image, dsize=(1280, 960))
        except:
            break
        # To improve performance, optionally mark the image as not writeable to
        # pass by reference.
        image.flags.writeable = False
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = pose.process(image)

        # Draw the pose annotation on the image.
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        try:
            landmarks = results.pose_landmarks.landmark

            # Get coordinates
            shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                        landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
            elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x,
                     landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
            wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x,
                     landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]
            hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,
                   landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
            knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x,
                    landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
            ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x,
                     landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]

            arm_angle = angle(shoulder, elbow, wrist)
            waist_angle = angle(shoulder, hip, knee)
            cv2.rectangle(image, (800, 15), (1250, 85), (255, 0, 0), -1)
            if step == -1:
                height = ((hip[1] - shoulder[1]) * 100 + (ankle[1] - hip[1]) * 100) / 2
                setup_angle = angle(wrist, shoulder, hip)
                # print("높이 %d 각도: %d" % (height, setup_angle))
                cv2.putText(image, "Step0. Ready", (820, 65), cv2.FONT_HERSHEY_PLAIN, 3,
                            (255, 255, 255), 5)
                if height < 30 and setup_angle > 60:
                    if setup_time == 0:
                        setup_time = time.time()
                    if (time.time() - setup_time) >= 3:
                        step = 0
                        # print("운동을 시작하세요!")
                else:
                    setup_time = 0
            elif step == 0:
                # print("Step1. 허리펴라")
                step = 1
            elif step == 1:
                cv2.putText(image, "Step1. straight", (820, 65), cv2.FONT_HERSHEY_PLAIN, 3,
                            (255, 255, 255), 5)
                if waist_angle >= 150:
                    # print("Step1 OK")
                    # print("Step2. 팔 굽혀라")
                    step = 2
            elif step == 2:
                cv2.putText(image, "Step2. down", (820, 65), cv2.FONT_HERSHEY_PLAIN, 3,
                            (255, 255, 255), 5)
                if arm_angle <= 90:
                    if first == 0:
                        start_time = cap.get(cv2.CAP_PROP_POS_MSEC) / 1000
                        temp_time = start_time
                        # print(start_time)
                        first = 1
                    # print("Step2 OK")
                    # print("Step3. 팔 펴라")
                    step = 3
                elif waist_angle < 150:
                    # print("허리 피라고")
                    step = 0
            else:
                cv2.putText(image, "Step3. up", (820, 65), cv2.FONT_HERSHEY_PLAIN, 3,
                            (255, 255, 255), 5)
                if arm_angle >= 160:
                    cnt += 1
                    temp_cnt += 1
                    # print("완료! 횟수: %d" % cnt)
                    step = 0
                elif waist_angle < 150:
                    # print("허리 피라고")
                    step = 0
        except:
            pass

        mp_drawing.draw_landmarks(
            image,
            results.pose_landmarks,
            mp_pose.POSE_CONNECTIONS,
            landmark_drawing_spec=mp_drawing_styles.get_default_pose_landmarks_style())

        # Flip the image horizontally for a selfie-view display.
        cv2.rectangle(image, (5, 880), (270, 930), (255, 0, 0), -1)
        cv2.putText(image, "count:%d" % cnt, (25, 920), cv2.FONT_HERSHEY_PLAIN, 3,
                    (255, 255, 255), 5)
        # cv2.imshow('Pushup Counter', image)
        out.write(image)
        # if cv2.waitKey(5) & 0xFF == 27:
        #     break
total_time = int(end_time - start_time)
while graph_y[-1] == 0:
    graph_y.pop(-1)
graph_x = [i for i in range(5, len(graph_y) * 5, 5)]
graph_x.append(total_time)
if len(graph_x) > len(graph_y):
    graph_y.append(cnt-sum(graph_y))
# print(graph_x)
# print(graph_y)
cap.release()
out.release()
# cv2.destroyAllWindows()
plt.plot(graph_x, graph_y)
# plt.show()
plt.savefig("result.png")
with open('./result.png', 'rb') as img:
    base64_string = base64.b64encode(img.read())

ip = "3.34.50.139"
client = mqtt.Client()
client.connect(ip, 1883)
client.loop_start()
# common topic 으로 메세지 발행
client.publish('exercise/result', "{\"count\": %d, \"time\": %d, \"max\": %d, \"min\": %d, \"img\": %s}" % (cnt, total_time, max(graph_y), min(graph_y), base64_string), 1)
client.loop_stop()
# 연결 종료
client.disconnect()
os.system("rm -f resource/exercise/input/input.mp4") # 기존 영상 삭제
