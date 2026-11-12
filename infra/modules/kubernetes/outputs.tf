output "cluster_name" {
  description = "EKS cluster name"
  value       = aws_eks_cluster.this.name
}

output "cluster_endpoint" {
  description = "EKS API server endpoint"
  value       = aws_eks_cluster.this.endpoint
}

output "node_role_name" {
  description = "IAM role name of worker nodes"
  value       = aws_iam_role.node.name
}
