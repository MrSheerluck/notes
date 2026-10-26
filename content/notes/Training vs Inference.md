---
title: Training vs Inference
type: note
description:
tags:
  - inference
publish: true
---
Now, lets understand how training a model and inferencing a model are completely different things

If you know ML or DL, we build any model not just LLM  by training a model with tons and tons of data and in that training process, the parameters of the model gets updated to make better accurate predictions. It's mostly a one time thing but there are cases where you would want to do a continuosly learning or training as more and more real world data comes in

But inference is not that. Inference is all about making predictions in real time. We also need high compute for inference because even though inference for one single turn wont need as much compute resource as training but when we are doing inference, we are serving multiple users and handling multiple reuqests and we need to respond as quickly as we can. That's why inference becomes compute expensive as well

