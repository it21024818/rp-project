FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --progress-bar on -r requirements.txt

COPY . .

CMD ["flask", "run", "--host=0.0.0.0"]