output "documents_policy_arn" {
  description = "ARN of the S3 access policy"
  value       = aws_iam_policy.documents_access.arn
}
