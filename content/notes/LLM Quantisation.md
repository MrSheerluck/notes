---
title: LLM Quantisation
type: note
description:
tags:
  - inference
publish: true
---
Quantisation is a technique used to reduce the memory and compute requirements of models by converting their weights and activations from high-precision formats (like FP32) to lower-precision formats such as INT8, INT4, or even INT2 [in](https://handbook.modular.com/model-preparation/llm-quantization/#:~:text=Quantization%20is,INT2) [[sources/LLM Inference Handbook|source]]

## Why use Quantisation?
Clearly, quantisation can help reduces how much memory the model weights need. It'll also lower the data movement as we have fewer bytes to read as we removed some precision and we will have faster computation as again we eliminated precision

A smaller weight footprint also leaves more GPU memory available for the [KV cache](https://handbook.modular.com/llm-inference-basics/how-does-llm-inference-work/#the-two-phases-of-llm-inference), larger batches, and more concurrent requests. Weight quantisation does not reduce the KV cache size per token by itself. It requires quantising the KV cache separately [in](https://handbook.modular.com/model-preparation/llm-quantization/#:~:text=A%20smaller,separately) [[sources/LLM Inference Handbook|source]]

## What to Quantise?
We can quantise model weights, activations, KV Cache. Basically, quantise what consumes the most memory without hurting performance too much


## Quantisation vs Pruning
Quantisation is not the only way to reduce model size. Another related technique is model pruning.

Pruning removes parameters that contribute little to the output of a model. They can be individual weights, neurons, attention heads, or even entire layers. By eliminating redundant components, pruning produces a smaller and sparser model, which can reduce compute requirements and accelerate inference speed [in](https://handbook.modular.com/model-preparation/llm-quantization/#:~:text=Pruning%20removes,speed) [[sources/LLM Inference Handbook]]

Both techniques aim to reduce memory usage and computational cost during inference. However, quantisation is generally easier to apply in production systems because modern hardware provides strong support for low-precision arithmetic.


There are multiple quantisation methods. I'll learn and explain about those later in a hands on way