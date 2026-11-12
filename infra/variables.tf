variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used in resource names"
  type        = string
  default     = "carsharing"
}

variable "azs" {
  description = "Availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "bucket_suffix" {
  description = "Suffix that makes the S3 bucket name globally unique"
  type        = string
  default     = "lab5"
}

variable "certificate_arn" {
  description = "ACM certificate ARN for the HTTPS listener (optional)"
  type        = string
  default     = ""
}

variable "offline" {
  description = "Run without AWS account: fake credentials and no API checks (plan only)"
  type        = bool
  default     = false
}
