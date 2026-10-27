---
title: LLM Distillation
type: note
description:
tags:
  - inference
publish: true
---
So, this is an interesting way to create or train a completely new smaller model by replicating the behaviour of a larger model. The smaller model acts like a student and the bigger model acts like a teacher. Think of it like this, given a problem the teacher knows how to solve it but the student just replicates the output. This is great because we can now create smaller model, that'll be fast and have smaller memory footprint and cheaper to run at the time of inference.

This is a completely different technique to [[LLM Quantisation]]. We can still quantise this distilled model

## How Distillation Works

Distillation instead trains the student on the teacher's soft labels, which are the full probability distribution over possible next tokens [in](https://handbook.modular.com/model-preparation/llm-distillation/#:~:text=Distillation%20instead%20trains%20the%20student%20on%20the%20teacher%27s%20soft%20labels%2C%20which%20are%20the%20full%20probability%20distribution%20over%20possible%20next%20tokens) [[LLM Inference Handbook|source]]

For example, lets say for a given problem the bigger or teacher model assigns 40% probability to "car" and 30% probability for "vehicle", this actually helps the student or smaller model to not only learn about the answer but what are other possible answers and confidence of the teacher model per possible answer as well. This helps the student model to generalise better. 

> I still need to look at it in-depth because all the distillation concepts are still too vague at this point

The student is typically trained using a combination of:

- **Distillation loss**: Measures how closely the student matches the output distribution of the teacher.
- **Cross-entropy loss**: Standard next-token prediction on labeled data.

## Types of Distillation
There are multiple types of distillation:
- Response distillation: Here, the student is trained to match the output of teacher model and as I guessed, this is the most common way for distillation
- Feature Distillation: Here, the student is trained to mimic the internal state of the the teacher model. Clearly this seems more expensive and complicated but can generate better output
- Chain-of-thought Distillation: The teacher generates full reasoning traces, namely step-by-step solutions to problems, and the student is fine-tuned on those traces. This is how DeepSeek-R1 distilled variants were created. It has significantly improved the reasoning ability of smaller models, especially for tasks like math, coding, and logical problem solving.


