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

resource "aws_dynamodb_table" "user_progress_profile" {
  name         = "UserProgressProfile"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"

  attribute {
    name = "userId"
    type = "S"
  }

  tags = { Name = "${var.app_name}-user-progress-profile" }
}

resource "aws_dynamodb_table" "user_topic_progress" {
  name         = "UserTopicProgress"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"
  range_key    = "topicKey"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "topicKey"
    type = "S"
  }

  tags = { Name = "${var.app_name}-user-topic-progress" }
}

resource "aws_dynamodb_table" "topic_quiz_attempts" {
  name         = "TopicQuizAttempts"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"
  range_key    = "attemptId"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "attemptId"
    type = "S"
  }

  attribute {
    name = "userTopicKey"
    type = "S"
  }

  attribute {
    name = "submittedAt"
    type = "S"
  }

  global_secondary_index {
    name            = "UserTopicIndex"
    hash_key        = "userTopicKey"
    range_key       = "submittedAt"
    projection_type = "ALL"
  }

  tags = { Name = "${var.app_name}-topic-quiz-attempts" }
}
