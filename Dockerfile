# Client build
FROM node:lts AS client-builder
COPY . .
RUN npm install
RUN npm run-script build

# Server build
FROM python:3.7
COPY . .
COPY --from=client-builder ./build ./build
RUN cd backend && pip install -r requirements.txt
WORKDIR ./backend
expose 3001
CMD [ "python", "app.py"]