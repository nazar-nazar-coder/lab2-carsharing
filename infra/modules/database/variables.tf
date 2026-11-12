variable "name" {
  description = "Name prefix"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "vpc_cidr" {
  description = "VPC CIDR: only addresses from it can reach the database and cache"
  type        = string
}

variable "subnet_ids" {
  description = "Private subnets for the database and cache"
  type        = list(string)
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
}

variable "db_allocated_storage" {
  description = "RDS storage size, GiB"
  type        = number
  default     = 20
}

variable "db_multi_az" {
  description = "Enable Multi-AZ deployment"
  type        = bool
  default     = false
}

variable "db_backup_days" {
  description = "Backup retention period in days"
  type        = number
  default     = 7
}

variable "redis_node_type" {
  description = "ElastiCache node type"
  type        = string
}

variable "tags" {
  description = "Common tags"
  type        = map(string)
  default     = {}
}
