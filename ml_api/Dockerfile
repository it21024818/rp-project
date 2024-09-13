# FROM python:3.10-slim

# WORKDIR /app

# COPY requirements.txt .

# RUN pip install --progress-bar on -r requirements.txt

# COPY . .

# EXPOSE 5000

# CMD ["flask", "run", "--host=0.0.0.0"]
# Stage 1: Build
FROM python:3.10-slim AS build
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-deps -r requirements.txt

# Stage 2: Runtime
FROM python:3.10-slim
WORKDIR /app
COPY --from=build /app .
COPY . .
# CMD ["python", "-m", "flask", "run", "--host=0.0.0.0"]
CMD ["python", "app.py", "--host=0.0.0.0"]