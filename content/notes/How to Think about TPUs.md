---
title: How to Think about TPUs
type: note
description:
tags:
  - tpu
  - inference
publish: true
---
Here, we are going to learn about how TPUs work, how they are networked together to enable multi-chip training and inference and how this affects the performance of our algorithms


>[!definition] What is a TPU?
>**A TPU is basically a compute core that specializes in matrix multiplication (called a TensorCore) attached to a stack of fast memory (called high-bandwidth memory or HBM)** [in](https://jax-ml.github.io/scaling-book/tpus/#:~:text=A%20TPU%20is%20basically%20a%20compute%20core%20that%20specializes%20in%20matrix%20multiplication%20%28called%20a%20TensorCore%29%20attached%20to%20a%20stack%20of%20fast%20memory%20%28called%20high%2Dbandwidth%20memory%20or%20HBM) [[How to Scale Your Model|source]]

![[tpu-chip.png]]

We can think of this TensorCore as a essentially just a really good matrix multiplication machine but it has some other functions too. The TensorCore has three key units:
- The **MXU**(Matrix Multiply Unit) is the core of the TensorCore. On TPU7x, it performs one `bf16[8,256] @ bf16[256,256] -> f32[8,256]` matrix multiply every `4` cycles using a systolic array (see [Appendix B](https://jax-ml.github.io/scaling-book/tpus/#appendix-b-how-does-a-systolic-array-work) for details)
	- This is about `5.8e14` bf16 FLOPs/s per MXU at 2.2GHz on TPU7x. Each TPU7x chip has 2 TensorCores, and each TensorCore has 2 MXUs, so the total bf16 FLOPs/s for TPU7x is around `2.3e15`.
	- TPUs also support lower precision matmuls with higher throughput (e.g. each TPU7x chip can do `4.6e15` fp8 OPs/s).
- The **VPU**(Vector Processing Unit) performs general mathematical operations like ReLU activations or pointwise addition or multiplication between vectors. Reductions (sums) are also performed here. [Appendix A](https://jax-ml.github.io/scaling-book/tpus/#appendix-a-more-on-tpu-internals) provides more details.
- **VMEM** (Vector Memory) is an on-chip scratchpad located in the TensorCore, close to the compute units. It is much smaller than HBM (for example, 128 MiB per chip on TPU7x vs 192 GiB of HBM) but has a much higher bandwidth to the MXU. VMEM operates somewhat like an L1/L2 cache on CPUs but is much larger and programmer-controlled. Data in HBM needs to be copied into VMEM before the TensorCore can do any computation with it.
- **HBM** (High Bandwidth Memory) is a big chunk of fast memory that stores tensors for use by the TensorCore. HBM usually has capacity on the order of tens to hundreds of gigabytes (for example, the HBM capacity of TPU7x is [192GiB](https://cloud.google.com/tpu/docs/tpu7x#system_architecture)).

	- When needed for a computation, tensors are streamed out of HBM through VMEM (see below) into the MXU and the result is written from VMEM back to HBM.
	- The bandwidth between HBM and the TensorCore (through VMEM) is known as “HBM bandwidth” (around 7TB/sec for TPU7x) and limits how fast computation can be done in memory-bound workloads.


Here’s an example of how you might perform an elementwise product from HBM:
![[pointwise-product.gif]]

A matmul would look almost the same except it would load into MXU instead of VPU or Vector unit.

You can see chunks of data streaming into VMEM, then into the VREGs (vector registers), then into the Vector Unit, then back into VMEM and HBM. As we’re about to see, if the load from HBM to VMEM is slower than the FLOPs in the Vector Unit (or MXU), we become “bandwidth bound” since we’re starving the VPU or MXU of work [in](https://jax-ml.github.io/scaling-book/tpus/#:~:text=You%20can%20see,work) [[How to Scale Your Model|source]]

### VMEM and Arithmetic Intensity
VMEM is much smaller than HBM but it has a much higher bandwidth to the MXU [in](https://jax-ml.github.io/scaling-book/tpus/#:~:text=VMEM%20is%20much%20smaller%20than%20HBM%20but%20it%20has%20a%20much%20higher%20bandwidth%20to%20the%20MXU) [[How to Scale Your Model|source]]


As we know VMEM is much faster as compared to HBM, that means if we can fit our weights into VMEM instead of HBM, we can get the highest FLOPs possible. This means we can get this FLOPs at a much smaller batch sizes. This means we can make lower arithmetic intensity algorithms to perform efficiently but the challenge is that VMEM memory is so small


![[vmem-and-arithmetic-intensity.png]]

**A TPU chip typically (but not always) consists of two TPU cores which share memory and can be thought of as one large accelerator** with twice the FLOPs (known as a “megacore” configuration) [in](https://jax-ml.github.io/scaling-book/tpus/#:~:text=A%20TPU%20chip%20typically%20%28but%20not%20always%29%20consists%20of%20two%20TPU%20cores%20which%20share%20memory%20and%20can%20be%20thought%20of%20as%20one%20large%20accelerator%20with%20twice%20the%20FLOPs%20%28known%20as%20a%20%E2%80%9Cmegacore%E2%80%9D%20configuration%29%2E) [[How to Scale Your Model|source]]
![[tpu-cores.png]]

**Chips** are arranged in **sets of 4 on a ‘tray’** connected to a **CPU host via PCIe network.** [in](https://jax-ml.github.io/scaling-book/tpus/#:~:text=Chips%20are%20arranged%20in%20sets%20of%204%20on%20a%20%E2%80%98tray%E2%80%99%20connected%20to%20a%20CPU%20host%20via%20PCIe%20network) [[How to Scale Your Model|source]]


For inference chips like the TPU v6e, we have 2 trays per host, instead of 1, but also only 1 core per chip, giving us 8 chips = 8 cores [in](https://jax-ml.github.io/scaling-book/tpus/#:~:text=For%20inference%20chips%20like%20the%20TPU%20v6e%2C%20we%20have%202%20trays%20per%20host%2C%20instead%20of%201%2C%20but%20also%20only%201%20core%20per%20chip%2C%20giving%20us%208%20chips%20%3D%208%20cores) [[How to Scale Your Model|source]]
![[tpu-chip-tray.png]]

**PCIe bandwidth is limited:** Like the HBM ↔↔ VMEM link, the CPU ↔↔ HBM PCIe connection has a specific bandwidth that limits how quickly you can load from host memory to HBM or vice-versa. PCIe bandwidth for TPU v4 is 16GB / second each way, for example, so close to 100x slower than HBM. We _can_ load/offload data into the host (CPU) RAM, but not very quickly. [in](https://jax-ml.github.io/scaling-book/tpus/#:~:text=is%20limited,quickly,-%2E) [[How to Scale Your Model|source]]


## TPU Networking
**Chips are connected to each other through the ICI(Inter-Chip Interconnects) network in a Pod** [in](https://jax-ml.github.io/scaling-book/tpus/#:~:text=Chips%20are%20connected%20to%20each%20other%20through%20the%20ICI%20network%20in%20a%20Pod) [[How to Scale Your Model|source]]
