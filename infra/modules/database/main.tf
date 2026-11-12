resource "aws_security_group" "db" {
  name   = "${var.name}-db-sg"
  vpc_id = var.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = var.tags
}

resource "aws_security_group" "redis" {
  name   = "${var.name}-redis-sg"
  vpc_id = var.vpc_id

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = var.tags
}

resource "aws_db_subnet_group" "this" {
  name       = "${var.name}-db-subnets"
  subnet_ids = var.subnet_ids

  tags = var.tags
}

# PostgreSQL; розширення PostGIS вмикається командою CREATE EXTENSION (db/init.sql).
# Пароль адміністратора генерує та зберігає сам RDS у AWS Secrets Manager,
# тому в коді та стані Terraform його немає.
resource "aws_db_instance" "postgres" {
  identifier                  = "${var.name}-postgres"
  engine                      = "postgres"
  engine_version              = "15"
  instance_class              = var.db_instance_class
  allocated_storage           = var.db_allocated_storage
  db_name                     = "carsharing"
  username                    = "carsharing_admin"
  manage_master_user_password = true

  db_subnet_group_name   = aws_db_subnet_group.this.name
  vpc_security_group_ids = [aws_security_group.db.id]
  publicly_accessible    = false
  multi_az               = var.db_multi_az
  storage_encrypted      = true

  backup_retention_period = var.db_backup_days
  skip_final_snapshot     = true

  tags = var.tags
}

resource "aws_elasticache_subnet_group" "redis" {
  name       = "${var.name}-redis-subnets"
  subnet_ids = var.subnet_ids
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id         = "${var.name}-redis"
  engine             = "redis"
  node_type          = var.redis_node_type
  num_cache_nodes    = 1
  port               = 6379
  subnet_group_name  = aws_elasticache_subnet_group.redis.name
  security_group_ids = [aws_security_group.redis.id]

  tags = var.tags
}
