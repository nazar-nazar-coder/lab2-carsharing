variable "name" {
  description = "Name prefix"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "public_subnet_ids" {
  description = "Public subnets for the load balancer"
  type        = list(string)
}

variable "certificate_arn" {
  description = "ACM certificate ARN; HTTPS listener is created only when it is set"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Common tags"
  type        = map(string)
  default     = {}
}
