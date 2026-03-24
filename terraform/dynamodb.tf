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

resource "aws_dynamodb_table" "users" {
  name         = "Users"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "email"
    type = "S"
  }

  global_secondary_index {
    name            = "emailIndex"
    hash_key        = "email"
    projection_type = "ALL"
  }

  tags = { Name = "${var.app_name}-users" }
}
