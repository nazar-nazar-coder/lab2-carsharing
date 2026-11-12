output "environment" {
  description = "Active environment (workspace)"
  value       = local.env
}

output "vpc_id" {
  value = module.network.vpc_id
}

output "cluster_name" {
  value = module.kubernetes.cluster_name
}

output "db_endpoint" {
  value = module.database.db_endpoint
}

output "redis_endpoint" {
  value = module.database.redis_endpoint
}

output "documents_bucket" {
  value = module.storage.bucket_name
}

output "alb_dns_name" {
  value = module.loadbalancer.alb_dns_name
}
