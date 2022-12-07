import os

file_path = "/media/videos"
vids = []
for file in sorted(os.listdir(file_path)):
    vids.append(file)
file_name = file_path + "/" + vids[0]
print(file_name)
final = file_path + "/input.mp4"
print(final)
os.system(f"mv {file_name} {final}")
os.system(f"python3 upload.py --vid {final}")
os.system(f"rm -f {final}")
