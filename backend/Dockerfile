# Backend Dockerfile
FROM ubuntu

# Installing dependencies for running a python application
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv libpq-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements file and install dependencies
COPY ../../requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

#Copying application files
COPY csv_pattern_tool/ .

# Environment variables for Django
ENV DJANGO_SETTINGS_MODULE=csv_pattern_tool.settings
ENV PYTHONUNBUFFERED=1

# Running the Django application
RUN python3 manage.py migrate
#CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
CMD ["gunicorn", "csv_pattern_tool.wsgi:application", "--bind", "0.0.0.0:8000"]
