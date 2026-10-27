---
title: What is an Inference Server
type: note
description:
tags:
  - inference
publish: true
---
As I said, all the things that are running on LLM like ChatGPT, Codex, Claude Code, etc are running with the help of some inference server that helps in running the models so that the harnesses can make API calls to the LLMs and get things done. 

An **inference server** is the component that manages how LLM inference runs. At first, it loads the model, then connects the required hardware(mostly GPUs) and processes application requests. When a prompt arrives, the server allocates these resources and executes the model and finally send back the response. 

But we need to note that *LLM inference servers do much more than simple request-response*, otherwise this would have been a simple backend subject instead of being a field on its own. *So, what extra stuff do inference servers do?*

To run LLMs at scale, inference servers provides these features:
- Batching: Combining multiple requests to improve GPU efficiency
- Streaming: Sending tokens as they are generated for lower latency
- Scaling: Spinning up or down replicas based on demand
- Monitoring: Exposing metrics for performance and debugging

> In the LLM space, people often use inference server or inference framework interchangeably [in](https://handbook.modular.com/llm-inference-basics/what-is-llm-inference/#what-is-an-inference-server:~:text=In%20the%20LLM%20space%2C%20people%20often%20use%20inference%20server%20or%20inference%20framework%20somewhat%20interchangeably) [[sources/LLM Inference Handbook|source]]

Some of the popular inference frameworks include vLLM, SGLang, MAX and TensorRT LLM