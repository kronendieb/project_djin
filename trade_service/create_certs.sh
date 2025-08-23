#!/bin/bash

cd nginx/ssl

rm self.crt
rm self.key

openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
  -keyout self.key -out self.crt \
  -subj "/CN=localhost"
