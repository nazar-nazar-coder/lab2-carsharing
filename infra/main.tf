terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  access_key                  = var.offline ? "mock_access_key" : null
  secret_key                  = var.offline ? "mock_secret_key" : null
  skip_credentials_validation = var.offline
  skip_requesting_account_id  = var.offline
  skip_metadata_api_check     = var.offline
  skip_region_validation      = var.offline
}

locals {
  # Робочий простір default трактуємо як staging
  env = terraform.workspace == "default" ? "staging" : terraform.workspace

  settings = {
    staging = {
      node_instance_type = "t3.medium"
      node_min           = 1
      node_desired       = 2
      node_max           = 3
      db_instance_class  = "db.t3.micro"
      db_multi_az        = false
      db_backup_days     = 1
      redis_node_type    = "cache.t3.micro"
    }
    production = {
      node_instance_type = "t3.large"
      node_min           = 2
      node_desired       = 3
      node_max           = 6
      db_instance_class  = "db.t3.medium"
      db_multi_az        = true
      db_backup_days     = 7
      redis_node_type    = "cache.t3.small"
    }
  }

  cfg  = local.settings[local.env]
  name = "${var.project_name}-${local.env}"

  tags = {
    Project     = var.project_name
    Environment = local.env
    ManagedBy   = "terraform"
  }
}

module "network" {
  source          = "./modules/network"
  name            = local.name
  vpc_cidr        = var.vpc_cidr
  azs             = var.azs
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets = ["10.0.11.0/24", "10.0.12.0/24"]
  tags            = local.tags
}

module "kubernetes" {
  source             = "./modules/kubernetes"
  name               = local.name
  subnet_ids         = module.network.private_subnet_ids
  node_instance_type = local.cfg.node_instance_type
  node_min           = local.cfg.node_min
  node_desired       = local.cfg.node_desired
  node_max           = local.cfg.node_max
  tags               = local.tags
}

module "database" {
  source            = "./modules/database"
  name              = local.name
  vpc_id            = module.network.vpc_id
  vpc_cidr          = module.network.vpc_cidr
  subnet_ids        = module.network.private_subnet_ids
  db_instance_class = local.cfg.db_instance_class
  db_multi_az       = local.cfg.db_multi_az
  db_backup_days    = local.cfg.db_backup_days
  redis_node_type   = local.cfg.redis_node_type
  tags              = local.tags
}

module "storage" {
  source      = "./modules/storage"
  bucket_name = "${local.name}-documents-${var.bucket_suffix}"
  tags        = local.tags
}

module "loadbalancer" {
  source            = "./modules/loadbalancer"
  name              = local.name
  vpc_id            = module.network.vpc_id
  public_subnet_ids = module.network.public_subnet_ids
  certificate_arn   = var.certificate_arn
  tags              = local.tags
}

module "iam" {
  source               = "./modules/iam"
  name                 = local.name
  documents_bucket_arn = module.storage.bucket_arn
  node_role_name       = module.kubernetes.node_role_name
}
