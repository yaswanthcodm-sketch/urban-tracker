# Urban Tracker / RoadGuard AI Backend — Google Cloud Run Production Dockerfile
FROM python:3.11-slim

# Prevent Python from writing .pyc and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV APP_ENV=production

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy backend application source
COPY . /app

# Ensure uploads directories exist
RUN mkdir -p /app/uploads/evidence /app/uploads/repairs /app/uploads/cctv_frames

# Cloud Run injects PORT (default 8080)
ENV PORT=8080
EXPOSE 8080

# Run FastAPI via Uvicorn
CMD exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT}
