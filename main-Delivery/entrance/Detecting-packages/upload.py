import requests
import argparse
from dotenv import load_dotenv
import os

def upload(vid):
    load_dotenv()
    url = "http://" + os.environ.get("fileServer") + "/package/"
    # url = "http://localhost:8000/package/"
    data = {'title':'metadata','timeDuration':120}
    file = open("vids/"+vid, 'rb')
    files = {'file': file}

    res = requests.post(url, files=files, json=data)
    print (res.status_code)
    print (res.content)
    # print (res)

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