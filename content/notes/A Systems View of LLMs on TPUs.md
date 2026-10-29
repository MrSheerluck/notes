---
title: A Systems View of LLMs on TPUs
type: note
description:
tags:
  - inference
  - ai
  - gpu
  - tpu
publish: true
---
## Prerequisites
This book or ebook expects us to have a basic understanding of how LLMs work, basic knowledge of transformer architecture and some basic knowledge on JAX

Ok so, they have an interesting claim, that I'll just directly quote here:

> By the end, you should feel comfortable estimating the best parallelism scheme for a Transformer model on a given hardware platform, and roughly how long training and inference should take. If you don’t, email us or leave a comment! We’d love to know how we could make this clearer [in](https://jax-ml.github.io/scaling-book/index#:~:text=By%20the,clearer) [[How to Scale Your Model|source]]

## Why Should We Care?
The way models are developing these days where small models are running closely with the hardware, we gotta think about how to make our models run efficiently at scale

> A 20% win on benchmarks is irrelevant if it comes at a 20% cost to roofline efficiency [in](https://jax-ml.github.io/scaling-book/index#:~:text=A%2020%25%20win%20on%20benchmarks%20is%20irrelevant%20if%20it%20comes%20at%20a%2020%25%20cost%20to%20roofline%20efficiency) [[How to Scale Your Model|source]]


> **The goal of “model scaling” is to be able to increase the number of chips used for training or inference while achieving a proportional, linear increase in throughput.** This is known as “_strong scaling_” [in](https://jax-ml.github.io/scaling-book/index#:~:text=so%2E-,The,scaling%E2%80%9D%2E) [[How to Scale Your Model|source]]


So, the goal of this book is to explain how TPU and GPU hardware works and how the transformer architecture evolved to perform well on current hardware.

Imo, this is going to be filled with ton of learning, I'm very much excited about this as this will immensely help me in my inference journey and I don't believe anyone's going to cover these detailing in any course