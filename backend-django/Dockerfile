FROM ubuntu:latest
LABEL maintainer="nyanmawhtun@gmail.com"

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED 1

COPY ./requirements.txt /tmp/requirements.txt
COPY ./requirements.dev.txt /tmp/requirements.dev.txt
COPY ./app /app
WORKDIR /app
EXPOSE 8000

ARG DEV=false
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv libsm6 libxext6 libxrender-dev libpq-dev libglib2.0-0 && \
    python3 -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    /py/bin/pip install opencv-python-headless && \
    apt-get install -y libgl1-mesa-glx && \
    /py/bin/pip install -r /tmp/requirements.txt && \
    if [ $DEV = "true" ]; then /py/bin/pip install -r /tmp/requirements.dev.txt; fi && \
    rm -rf /tmp && \
    adduser --disabled-password --no-create-home django-user

ENV PATH="/py/bin:$PATH"

USER django-user