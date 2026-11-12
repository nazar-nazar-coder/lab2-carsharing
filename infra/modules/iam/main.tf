# Політика найменших привілеїв: лише читання/запис об'єктів одного бакета
resource "aws_iam_policy" "documents_access" {
  name = "${var.name}-documents-access"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["s3:GetObject", "s3:PutObject"]
        Resource = "${var.documents_bucket_arn}/*"
      },
      {
        Effect   = "Allow"
        Action   = ["s3:ListBucket"]
        Resource = var.documents_bucket_arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "documents" {
  role       = var.node_role_name
  policy_arn = aws_iam_policy.documents_access.arn
}
