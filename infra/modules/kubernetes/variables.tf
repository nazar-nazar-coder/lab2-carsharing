variable "name" {
  description = "Name prefix"
  type        = string
}

variable "cluster_version" {
  description = "Kubernetes version of the EKS cluster"
  type        = string
  default     = "1.33"
}

variable "subnet_ids" {
  description = "Subnets for the control plane and worker nodes"
  type        = list(string)
}

variable "node_instance_type" {
  description = "EC2 instance type of worker nodes"
  type        = string
}

variable "node_min" {
  description = "Minimum number of worker nodes"
  type        = number
}

variable "node_desired" {
  description = "Desired number of worker nodes"
  type        = number
}

variable "node_max" {
  description = "Maximum number of worker nodes"
  type        = number
}

variable "tags" {
  description = "Common tags"
  type        = map(string)
  default     = {}
}
