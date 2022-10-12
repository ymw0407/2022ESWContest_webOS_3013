## 실행

```bash
systemctl start docker
```

```bash
docker run -d --name tesseract -v /home/root/videos:/root/videos ubuntu sleep infinity
```

## 접속

```bash
docker exec -it tesseract /bin/bash
```
