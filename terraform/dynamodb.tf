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

resource "aws_dynamodb_table" "exam_papers" {
  name         = "ExamPapers"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "paperId"

  attribute {
    name = "paperId"
    type = "S"
  }

  attribute {
    name = "subjectId"
    type = "S"
  }

  global_secondary_index {
    name            = "SubjectPapersIndex"
    hash_key        = "subjectId"
    range_key       = "paperId"
    projection_type = "ALL"
  }

  tags = { Name = "${var.app_name}-exam-papers" }
}

resource "aws_dynamodb_table" "exam_attempts" {
  name         = "ExamAttempts"
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
    name = "userExamKey"
    type = "S"
  }
  
  attribute {
    name = "submittedAt"
    type = "S"
  }
  
  global_secondary_index {
    name            = "UserExamIndex"
    hash_key        = "userExamKey"
    range_key       = "submittedAt"
    projection_type = "ALL"
  }

  tags = { Name = "${var.app_name}-exam-attempts" }
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
