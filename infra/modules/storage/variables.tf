variable "bucket_name" {
  description = "Globally unique name of the S3 bucket"
  type        = string
}

variable "tags" {
  description = "Common tags"
  type        = map(string)
  default     = {}
}
