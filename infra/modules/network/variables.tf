variable "name" {
  description = "Name prefix for network resources"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block of the VPC"
  type        = string
}

variable "azs" {
  description = "Availability zones (one per subnet)"
  type        = list(string)
}

variable "public_subnets" {
  description = "CIDR blocks of public subnets"
  type        = list(string)
}

variable "private_subnets" {
  description = "CIDR blocks of private subnets"
  type        = list(string)
}

variable "tags" {
  description = "Common tags"
  type        = map(string)
  default     = {}
}
