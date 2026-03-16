resource "aws_dynamodb_table" "subjects" {
  name         = "Subjects"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = { Name = "${var.app_name}-subjects" }
}
