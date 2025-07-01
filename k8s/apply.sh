#!/bin/bash

# Create namespace
kubectl apply -f namespace.yaml

# Deploy MongoDB
kubectl apply -f mongodb/mongodb-secret.yaml
kubectl apply -f mongodb/mongodb-service.yaml
kubectl apply -f mongodb/mongodb-statefulset.yaml

# Wait for MongoDB
echo "Waiting for MongoDB to start..."
kubectl -n devblog wait --for=condition=ready pod -l app=mongodb --timeout=120s

# Deploy backend
kubectl apply -f backend/backend-deployment.yaml
kubectl apply -f backend/backend-service.yaml

# Deploy frontend
kubectl apply -f frontend/frontend-deployment.yaml
kubectl apply -f frontend/frontend-service.yaml
kubectl apply -f frontend/frontend-ingress.yaml

# Get ingress IP
echo "Ingress details:"
kubectl -n devblog get ingress