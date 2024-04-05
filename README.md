# coupang eats backend 시작하기

## Backend Setup
```
nest g application
```
1. 위의 명령어를 입력하면 project명을 입력하라고 나온다. 나는 여기에서 coupang_eats_backend로 만들 것이다. 그 다음 해당 위치로 가서 `npm i`를 하여 pacage.json의 내용을 install해준다.
```
npm i
```
2. git에 레퍼지토리를 만들고 git에서 제공하는 방식대로 git init과 git branch -M main 그리고 git remote add origin을 해준다.
3. 그리고 git에 무엇을 업로드 하지 말아야 할지 정해주는 `.gitignore`를 설정해준다. 이는 extends에서 gitignore를 설치해주고 명령 팔레트에서 `add gitignore`를 누르고 node를 입력하여 클린한다. 그러면 자동으로 node에 필요한 gitignore가 설치되었을 것이다.
4.  다음으로는 git add .로 모두 git에 추가하고 git commit -M "First commit"를 해준다. 그리고 git push origin main을 해주면 github에 해당 코드가 올라가 있는 것을 확인할 수 있다.

