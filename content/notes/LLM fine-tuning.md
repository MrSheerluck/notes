---
title: LLM Fine-tuning
type: note
description:
tags:
  - inference
publish: true
---
Fine-tuning is a concept where instead of training an entire model from scratch, we take a pretrained model or base model and then train the model with more specific data or I should say task specific data. This training can happen for the entire model or some layers of it [in](https://handbook.modular.com/model-preparation/llm-fine-tuning/) [[sources/LLM Inference Handbook|source]]

For example, fine-tuning can significantly improve a model's domain expertise, instruction following, safety and alignment



Fine-tuning is justified to do when the behavior you want is stable, appears across many requests, and cannot be handled cleanly by prompts or retrieved context alone [in](https://handbook.modular.com/model-preparation/llm-fine-tuning/#:~:text=the%20behavior%20you%20want%20is%20stable%2C%20appears%20across%20many%20requests%2C%20and%20cannot%20be%20handled%20cleanly%20by%20prompts%20or%20retrieved%20context%20alone) [[sources/LLM Inference Handbook|source]]

We don't need to do finetuning from scratch, there are multiple fine-tuning frameworks that can help to ease this process. I'll mention some of them but we will learn more about them, when we will dive deep into finetuning. Here are some finetuning frameworks: Axolotl, Unsloth, Torchtune, etc

