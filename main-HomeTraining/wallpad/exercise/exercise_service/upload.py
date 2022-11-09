import requests
import argparse

def upload(vid):
    url = "http://3.34.50.139:8000/exercise/"
    data = {'title':'metadata','timeDuration':120}
    file = open(vid, 'rb')
    files = {'file': file}

    req = requests.post(url, files=files, json=data)
    # print (req.status_code)
    # print (req.content)
    print (req)

def parse_opt():
    parser = argparse.ArgumentParser()
    parser.add_argument("--vid", type=str, help="video name")
    flags = parser.parse_args()
    opt = vars(flags)
    vid = opt["vid"]
    return vid

if __name__ == "__main__":
    vid = parse_opt()
    upload(vid)