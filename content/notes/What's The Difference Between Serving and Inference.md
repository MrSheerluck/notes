---
title: What's The Difference Between Serving and Inference
type: note
description:
tags:
  - inference
publish: true
---
People often use these terms interchangeably because the inference frameworks can do both the things: inference and serve

Inference is the process of forward pass. It takes the tokens as input, next-token distribution out, repeated through prefill and the decode loop. This is a completely computational operation

Serving is all about the engineering around the inference so that we can turn that inference into a reliable production service. For example: an API request surface (HTTP/gRPC), request queuing and scheduling, batching across concurrent requests, load balancing across replicas, autoscaling, model loading and version management, health checks, observability and resource allocation [in](https://handbook.modular.com/llm-inference-basics/what-is-llm-inference/#whats-the-difference-between-serving-and-inference) [[LLM Inference Handbook|source]]
