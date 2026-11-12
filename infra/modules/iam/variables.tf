variable "name" {
  description = "Name prefix"
  type        = string
}

variable "documents_bucket_arn" {
  description = "ARN of the S3 bucket with documents and photos"
  type        = string
}

variable "node_role_name" {
  description = "IAM role of the Kubernetes worker nodes"
  type        = string
}
