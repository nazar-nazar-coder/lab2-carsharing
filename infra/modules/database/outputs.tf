output "db_endpoint" {
  description = "PostgreSQL address"
  value       = aws_db_instance.postgres.address
}

output "db_master_secret_arn" {
  description = "ARN of the Secrets Manager secret with the master password"
  value       = aws_db_instance.postgres.master_user_secret[0].secret_arn
}

output "redis_endpoint" {
  description = "Redis address"
  value       = aws_elasticache_cluster.redis.cache_nodes[0].address
}
