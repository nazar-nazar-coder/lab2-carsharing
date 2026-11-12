# Віддалений стан: S3 (версіонування, шифрування) + DynamoDB для блокування.
# Для кожного робочого простору (staging, production) стан зберігається окремо.
# Без облікового запису AWS: terraform init -backend=false
terraform {
  backend "s3" {
    bucket         = "carsharing-tfstate-REPLACE-ME"
    key            = "platform/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
